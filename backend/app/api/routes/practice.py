from fastapi import APIRouter, Depends, status
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.practice import StartSessionRequest, SubmitAnswerRequest
from app.services.practice_service import practice_service

router = APIRouter(prefix="/practice", tags=["Practice"])

@router.post("/sessions", status_code=status.HTTP_201_CREATED)
async def create_session(req: StartSessionRequest, user: User = Depends(get_current_user)):
    return await practice_service.create_session(
        user_id=str(user.id),
        topic_id=req.topic_id,
        target_role=user.target_role
    )

@router.get("/sessions/{session_id}")
async def get_session(session_id: str, user: User = Depends(get_current_user)):
    return await practice_service.get_session(session_id, str(user.id))

@router.post("/sessions/{session_id}/questions")
async def generate_next_question(session_id: str, user: User = Depends(get_current_user)):
    return await practice_service.generate_next_question(
        session_id=session_id,
        user_id=str(user.id),
        target_role=user.target_role
    )

@router.post("/sessions/{session_id}/attempts")
async def submit_attempt(session_id: str, req: SubmitAnswerRequest, user: User = Depends(get_current_user)):
    return await practice_service.submit_attempt(
        session_id=session_id,
        question_id=req.question_id,
        answer_text=req.answer_text,
        duration_seconds=req.duration_seconds,
        user_id=str(user.id)
    )

@router.post("/sessions/{session_id}/complete")
async def complete_session(session_id: str, user: User = Depends(get_current_user)):
    return await practice_service.complete_session(session_id, str(user.id))
