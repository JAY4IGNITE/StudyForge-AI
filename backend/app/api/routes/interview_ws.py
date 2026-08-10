import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.ai_interview_engine import ai_interview_engine
from app.services.websocket_manager import manager
from app.core.websocket_auth import authenticate_websocket
from app.models.interview import InterviewSession, TurnTurnData, VisionTelemetry, VoiceTelemetry
from app.schemas.websocket import WebSocketMessage
from app.core.logging import logger

router = APIRouter(prefix="/ws/interviews", tags=["AI Interview WebSockets"])

async def stream_text_chunks(text: str, websocket: WebSocket, chunk_size: int = 5, delay: float = 0.05):
    """Simulates streaming by yielding chunks of a complete text string"""
    words = text.split(" ")
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size]) + " "
        await websocket.send_json(
            WebSocketMessage(
                type="ai.stream.chunk",
                payload={"text": chunk}
            ).model_dump()
        )
        await asyncio.sleep(delay)

@router.websocket("/{session_id}")
async def interview_websocket(websocket: WebSocket, session_id: str):
    """
    Production-ready WebSocket endpoint for interview sessions.
    Handles auth, AI streaming, and telemetry.
    """
    await websocket.accept()
    
    # Phase 4: Authentication via first message
    user = await authenticate_websocket(websocket)
    if not user:
        return # Connection closed by auth handler
        
    # Phase 9: Authorization (Ownership check)
    session = await InterviewSession.get(session_id)
    if not session or session.user_id != str(user.id):
        await websocket.send_json(
            WebSocketMessage(
                type="connection.error",
                payload={"code": "FORBIDDEN", "message": "Access denied to this session"}
            ).model_dump()
        )
        await websocket.close(code=1008)
        return

    # Phase 3: Connection Manager
    await manager.connect(websocket, str(user.id))
    manager.join_room(websocket, session_id)
    
    try:
        # Notify connection success
        await manager.send_personal_message(
            WebSocketMessage(type="connection.connected", payload={"session_id": session_id}),
            websocket
        )

        while True:
            try:
                data = await websocket.receive_json()
            except json.JSONDecodeError:
                await manager.send_personal_message(
                    WebSocketMessage(type="connection.error", payload={"code": "INVALID_MESSAGE", "message": "Malformed JSON"}),
                    websocket
                )
                continue
                
            event_type = data.get("type")
            payload = data.get("payload", {})
            
            if event_type == "ping":
                await manager.send_personal_message(WebSocketMessage(type="pong"), websocket)
                
            elif event_type == "interview.user_message":
                user_answer = payload.get("text", "")
                vision_metrics = payload.get("vision_metrics", {})
                
                # Fetch history from session
                history = [{"question": t.question, "user_answer": t.user_answer} for t in session.turns]
                
                # Notify UI that AI is processing
                await manager.send_personal_message(
                    WebSocketMessage(type="ai.stream.start", payload={}), 
                    websocket
                )
                
                # Call AI Engine
                eval_res = await ai_interview_engine.evaluate_turn(
                    history=history,
                    user_answer=user_answer,
                    mode=session.mode,
                    target_role=session.target_role
                )
                
                next_question = eval_res.get("next_question", "")
                feedback = eval_res.get("feedback_on_previous", "")
                is_completed = eval_res.get("is_completed", False)
                
                if next_question:
                    # Stream the next question chunks
                    await stream_text_chunks(next_question, websocket)
                    
                # Determine the question that was asked (or use a default first question)
                asked_question = session.pending_question or "Tell me about yourself."
                
                # Validate telemetry safely
                try:
                    vision_telem = VisionTelemetry.model_validate(vision_metrics) if vision_metrics else None
                except Exception:
                    vision_telem = None
                    
                # Persist turn to MongoDB
                turn = TurnTurnData(
                    turn_index=len(session.turns),
                    question=asked_question,
                    user_answer=user_answer,
                    feedback=feedback,
                    ideal_answer=eval_res.get("ideal_answer"),
                    better_answer=eval_res.get("better_answer"),
                    vision_metrics=vision_telem
                )
                session.turns.append(turn)
                session.pending_question = next_question
                if is_completed:
                    session.status = "completed"
                
                try:
                    await session.save()
                except Exception as e:
                    logger.error(f"Failed to save session {session_id}: {e}")
                    await manager.send_personal_message(
                        WebSocketMessage(type="connection.error", payload={"code": "SERVER_ERROR", "message": "Failed to save session turn"}),
                        websocket
                    )
                    continue

                # Signal stream completion and send full turn evaluation
                await manager.send_personal_message(
                    WebSocketMessage(
                        type="ai.stream.end", 
                        payload={
                            "feedback": feedback,
                            "ideal_answer": eval_res.get("ideal_answer"),
                            "next_question": next_question,
                            "is_completed": is_completed
                        }
                    ),
                    websocket
                )

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for session: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error in session {session_id}: {e}")
        try:
            await manager.send_personal_message(
                WebSocketMessage(type="connection.error", payload={"code": "SERVER_ERROR", "message": "Internal server error"}),
                websocket
            )
        except:
            pass
    finally:
        manager.leave_room(websocket, session_id)
        manager.disconnect(websocket, str(user.id))
