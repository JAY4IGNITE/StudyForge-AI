from datetime import datetime, timezone
from app.models.practice import Topic, Question, PracticeSession, Attempt
from app.core.errors import StudyForgeException, ErrorCode
from app.ai.gateway import ai_gateway
from app.ai.contracts import QuestionGenerationRequest, AnswerEvaluationRequest
from app.services.adaptive_service import adaptive_service
from fastapi import status
from typing import Dict, Any

class PracticeService:
    async def create_session(self, user_id: str, topic_id: str, target_role: str) -> Dict[str, Any]:
        topic = await Topic.get(topic_id)
        if not topic:
            raise StudyForgeException(code=ErrorCode.TOPIC_NOT_FOUND, message="Topic not found.", status_code=status.HTTP_404_NOT_FOUND)
            
        mastery = await adaptive_service.get_or_create_mastery(user_id, topic_id)
        
        session = PracticeSession(
            user_id=user_id,
            topic_id=topic_id,
            target_difficulty=mastery.recommended_difficulty
        )
        await session.insert()
        return {"session_id": str(session.id), "target_difficulty": session.target_difficulty}

    async def get_session(self, session_id: str, user_id: str) -> PracticeSession:
        session = await PracticeSession.get(session_id)
        if not session or session.user_id != user_id:
            raise StudyForgeException(code=ErrorCode.SESSION_NOT_FOUND, message="Practice session not found.", status_code=status.HTTP_404_NOT_FOUND)
        return session

    async def generate_next_question(self, session_id: str, user_id: str, target_role: str) -> Dict[str, Any]:
        session = await self.get_session(session_id, user_id)
        topic = await Topic.get(session.topic_id)
        mastery = await adaptive_service.get_or_create_mastery(user_id, session.topic_id)

        ai_req = QuestionGenerationRequest(
            topic=topic.name if topic else "General Knowledge",
            difficulty=session.target_difficulty,
            user_goal="Practice",
            target_role=target_role,
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

    async def submit_attempt(self, session_id: str, question_id: str, answer_text: str, duration_seconds: int, user_id: str) -> Dict[str, Any]:
        session = await self.get_session(session_id, user_id)
        
        question = await Question.get(question_id)
        if not question:
            raise StudyForgeException(code=ErrorCode.QUESTION_NOT_FOUND, message="Question not found.", status_code=status.HTTP_404_NOT_FOUND)

        ai_eval_req = AnswerEvaluationRequest(
            question_prompt=question.prompt,
            expected_concepts=question.expected_concepts,
            rubric=question.rubric or "Clear conceptual explanation",
            user_answer=answer_text,
            difficulty=question.difficulty
        )
        eval_res = await ai_gateway.evaluate_answer(ai_eval_req)
        
        attempt = Attempt(
            user_id=user_id,
            session_id=str(session.id),
            question_id=str(question.id),
            answer_text=answer_text,
            score=eval_res.score,
            semantic_score=eval_res.semantic_score,
            evaluation=eval_res.model_dump() if hasattr(eval_res, "model_dump") else eval_res.dict(),
            duration_seconds=duration_seconds
        )
        await attempt.insert()

        updated_mastery = await adaptive_service.update_mastery_after_attempt(
            user_id=user_id,
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

    async def complete_session(self, session_id: str, user_id: str) -> Dict[str, str]:
        session = await self.get_session(session_id, user_id)
        session.status = "completed"
        session.completed_at = datetime.now(timezone.utc)
        await session.save()
        return {"message": "Session completed successfully."}

practice_service = PracticeService()
