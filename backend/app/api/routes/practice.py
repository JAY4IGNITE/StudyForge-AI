from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from app.api.deps import get_current_user
from app.models.user import User
from app.models.practice import Topic, Question, PracticeSession, Attempt
from app.schemas.practice import StartSessionRequest, SubmitAnswerRequest
from app.ai.gateway import ai_gateway
from app.ai.contracts import QuestionGenerationRequest, AnswerEvaluationRequest
from app.services.adaptive_service import adaptive_service
from app.core.errors import StudyForgeException

router = APIRouter(prefix="/practice", tags=["Practice"])

@router.post("/sessions", status_code=status.HTTP_201_CREATED)
async def create_session(req: StartSessionRequest, user: User = Depends(get_current_user)):
    topic = await Topic.get(req.topic_id)
    if not topic:
        raise StudyForgeException(code="TOPIC_NOT_FOUND", message="Topic not found.")
        
    mastery = await adaptive_service.get_or_create_mastery(str(user.id), str(topic.id))
    
    session = PracticeSession(
        user_id=str(user.id),
        topic_id=str(topic.id),
        target_difficulty=mastery.recommended_difficulty
    )
    await session.insert()
    return {"session_id": str(session.id), "target_difficulty": session.target_difficulty}

@router.get("/sessions/{session_id}")
async def get_session(session_id: str, user: User = Depends(get_current_user)):
    session = await PracticeSession.get(session_id)
    if not session or session.user_id != str(user.id):
        raise StudyForgeException(code="SESSION_NOT_FOUND", message="Practice session not found.")
    return session

@router.post("/sessions/{session_id}/questions")
async def generate_next_question(session_id: str, user: User = Depends(get_current_user)):
    session = await PracticeSession.get(session_id)
    if not session or session.user_id != str(user.id):
        raise StudyForgeException(code="SESSION_NOT_FOUND", message="Session not found.")
        
    topic = await Topic.get(session.topic_id)
    mastery = await adaptive_service.get_or_create_mastery(str(user.id), session.topic_id)

    ai_req = QuestionGenerationRequest(
        topic=topic.name if topic else "General Knowledge",
        difficulty=session.target_difficulty,
        user_goal="Practice",
        target_role=user.target_role,
        recent_accuracy=mastery.rolling_accuracy
    )
    generated = await ai_gateway.generate_question(ai_req)
    
    question = Question(
        topic_id=session.topic_id,
        difficulty=generated.difficulty,
        prompt=generated.prompt,
        expected_concepts=generated.expected_concepts,
        rubric=generated.rubric,
        citations=generated.citations
    )
    await question.insert()
    
    return {
        "question_id": str(question.id),
        "prompt": question.prompt,
        "difficulty": question.difficulty,
        "citations": question.citations
    }

@router.post("/sessions/{session_id}/attempts")
async def submit_attempt(session_id: str, req: SubmitAnswerRequest, user: User = Depends(get_current_user)):
    session = await PracticeSession.get(session_id)
    if not session or session.user_id != str(user.id):
        raise StudyForgeException(code="SESSION_NOT_FOUND", message="Session not found.")
        
    question = await Question.get(req.question_id)
    if not question:
        raise StudyForgeException(code="QUESTION_NOT_FOUND", message="Question not found.")

    ai_eval_req = AnswerEvaluationRequest(
        question_prompt=question.prompt,
        expected_concepts=question.expected_concepts,
        rubric=question.rubric or "Clear conceptual explanation",
        user_answer=req.answer_text,
        difficulty=question.difficulty
    )
    eval_res = await ai_gateway.evaluate_answer(ai_eval_req)
    
    attempt = Attempt(
        user_id=str(user.id),
        session_id=str(session.id),
        question_id=str(question.id),
        answer_text=req.answer_text,
        score=eval_res.score,
        semantic_score=eval_res.semantic_score,
        evaluation=eval_res.dict(),
        duration_seconds=req.duration_seconds
    )
    await attempt.insert()

    # Update adaptive mastery profile
    updated_mastery = await adaptive_service.update_mastery_after_attempt(
        user_id=str(user.id),
        topic_id=session.topic_id,
        latest_score=eval_res.score
    )

    return {
        "attempt_id": str(attempt.id),
        "score": attempt.score,
        "semantic_score": attempt.semantic_score,
        "evaluation": attempt.evaluation,
        "updated_mastery_score": updated_mastery.mastery_score,
        "next_recommended_difficulty": updated_mastery.recommended_difficulty
    }

@router.post("/sessions/{session_id}/complete")
async def complete_session(session_id: str, user: User = Depends(get_current_user)):
    session = await PracticeSession.get(session_id)
    if not session or session.user_id != str(user.id):
        raise StudyForgeException(code="SESSION_NOT_FOUND", message="Session not found.")
        
    session.status = "completed"
    session.completed_at = datetime.now(timezone.utc)
    await session.save()
    return {"message": "Session completed successfully."}
