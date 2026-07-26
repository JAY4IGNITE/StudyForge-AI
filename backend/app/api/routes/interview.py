from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from app.api.deps import get_current_user
from app.models.user import User
from app.models.practice import InterviewSession
from app.schemas.interview import StartInterviewRequest, SubmitTurnRequest
from app.ai.gateway import ai_gateway
from app.ai.contracts import InterviewTurnRequest
from app.core.errors import StudyForgeException

router = APIRouter(prefix="/interviews", tags=["Interviews"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_interview(req: StartInterviewRequest, user: User = Depends(get_current_user)):
    interview = InterviewSession(
        user_id=str(user.id),
        target_role=req.target_role,
        interview_type=req.interview_type
    )
    
    # Get initial turn
    ai_resp = await ai_gateway.next_interview_turn(
        InterviewTurnRequest(target_role=req.target_role, interview_type=req.interview_type, history=[])
    )
    
    turn_data = {
        "turn": 1,
        "question": ai_resp.interviewer_question,
        "answer": None,
        "feedback": None
    }
    interview.turns.append(turn_data)
    await interview.insert()
    
    interview_dict = {
        "id": str(interview.id),
        "interview_id": str(interview.id),
        "user_id": str(user.id),
        "target_role": interview.target_role,
        "interview_type": interview.interview_type,
        "turns": interview.turns,
        "status": interview.status
    }
    return {"interview": interview_dict, "turn": turn_data}

@router.get("/{interview_id}")
async def get_interview(interview_id: str, user: User = Depends(get_current_user)):
    interview = await InterviewSession.get(interview_id)
    if not interview or interview.user_id != str(user.id):
        raise StudyForgeException(code="INTERVIEW_NOT_FOUND", message="Interview session not found.")
    return interview

@router.post("/{interview_id}/turns")
async def submit_interview_turn(interview_id: str, req: SubmitTurnRequest, user: User = Depends(get_current_user)):
    interview = await InterviewSession.get(interview_id)
    if not interview or interview.user_id != str(user.id):
        raise StudyForgeException(code="INTERVIEW_NOT_FOUND", message="Interview session not found.")
        
    if not interview.turns or interview.status == "completed":
        raise StudyForgeException(code="INTERVIEW_COMPLETED", message="Interview is already completed.")

    # Record answer for current turn
    current_turn = interview.turns[-1]
    current_turn["answer"] = req.user_answer

    # Request next turn or final summary from AI
    ai_resp = await ai_gateway.next_interview_turn(
        InterviewTurnRequest(
            target_role=interview.target_role,
            interview_type=interview.interview_type,
            history=interview.turns,
            user_answer=req.user_answer
        )
    )
    current_turn["feedback"] = ai_resp.feedback_on_previous

    if ai_resp.is_completed:
        interview.status = "completed"
        interview.completed_at = datetime.now(timezone.utc)
        interview.final_evaluation = {
            "overall_summary": ai_resp.overall_summary or "Completed interview session.",
            "total_turns": len(interview.turns)
        }
    else:
        next_turn_data = {
            "turn": len(interview.turns) + 1,
            "question": ai_resp.interviewer_question,
            "answer": None,
            "feedback": None
        }
        interview.turns.append(next_turn_data)

    await interview.save()
    return {"interview": interview, "next_turn": interview.turns[-1] if not ai_resp.is_completed else None}
