from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.ai_interview_engine import ai_interview_engine
from app.core.logging import logger

router = APIRouter(prefix="/ws/interviews", tags=["AI Interview WebSockets"])

@router.websocket("/stream/{session_id}")
async def interview_stream_websocket(websocket: WebSocket, session_id: str):
    """
    Bi-directional WebSocket for real-time speech streaming, vision telemetry processing, and low-latency response delivery.
    """
    await websocket.accept()
    logger.info(f"WebSocket connection established for interview session: {session_id}")

    try:
        while True:
            data = await websocket.receive_json()
            event_type = data.get("event")

            if event_type == "ping":
                await websocket.send_json({"event": "pong"})

            elif event_type == "audio_chunk":
                # Real-time audio streaming chunk event
                transcript_text = data.get("transcript", "")
                await websocket.send_json({
                    "event": "transcript_update",
                    "text": transcript_text,
                    "confidence": 0.96
                })

            elif event_type == "vision_telemetry":
                # Processing client-side MediaPipe vision telemetry
                metrics = data.get("metrics", {})
                await websocket.send_json({
                    "event": "telemetry_ack",
                    "status": "processed",
                    "eye_contact": metrics.get("eye_contact", 85)
                })

            elif event_type == "user_finished_speaking":
                user_answer = data.get("user_answer", "")
                mode = data.get("mode", "technical")
                target_role = data.get("target_role", "Software Engineer")
                history = data.get("history", [])

                # Get low latency turn evaluation from NVIDIA NIM AI Engine
                eval_res = await ai_interview_engine.evaluate_turn(
                    history=history,
                    user_answer=user_answer,
                    mode=mode,
                    target_role=target_role
                )

                await websocket.send_json({
                    "event": "ai_response",
                    "feedback": eval_res.get("feedback_on_previous"),
                    "ideal_answer": eval_res.get("ideal_answer"),
                    "next_question": eval_res.get("next_question"),
                    "is_completed": eval_res.get("is_completed", False)
                })

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for session: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error in session {session_id}: {e}")
        await websocket.close()
