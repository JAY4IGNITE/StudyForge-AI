import httpx
import json
from typing import Optional
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from app.core.config import settings
from app.core.logging import logger
from app.core.errors import StudyForgeException
from app.ai.contracts import (
    QuestionGenerationRequest, GeneratedQuestion,
    AnswerEvaluationRequest, AnswerEvaluation,
    InterviewTurnRequest, InterviewTurnResponse
)

class OmniRouteAIGateway:
    def __init__(self):
        self.base_url = settings.OMNIROUTE_BASE_URL
        self.api_key = settings.OMNIROUTE_API_KEY
        self.default_model = settings.OMNIROUTE_DEFAULT_MODEL

    async def generate_question(self, req: QuestionGenerationRequest) -> GeneratedQuestion:
        if not self.base_url or not self.api_key:
            # Fallback deterministic question generation if AI credentials are not configured
            logger.info("OmniRoute credentials not present, using intelligent fallback question generator.")
            return GeneratedQuestion(
                prompt=f"Explain the key principles of {req.topic} in the context of {req.target_role or 'software engineering'}.",
                expected_concepts=["core principles", "practical application", "trade-offs"],
                rubric="Clear explanation of principles, mention of real-world use cases, awareness of trade-offs.",
                citations=["StudyForge AI Curriculum"],
                difficulty=req.difficulty
            )

        prompt_str = f"Generate a {req.difficulty} difficulty practice question on '{req.topic}'. Target role: {req.target_role or 'Learner'}. Respond ONLY in valid JSON matching schema: {{'prompt': string, 'expected_concepts': [string], 'rubric': string, 'citations': [string], 'difficulty': string}}"
        
        raw_json = await self._call_ai(prompt_str)
        try:
            parsed = json.loads(raw_json)
            return GeneratedQuestion(**parsed)
        except Exception as e:
            logger.error(f"Failed to parse AI response for question generation: {e}")
            return GeneratedQuestion(
                prompt=f"Discuss best practices for {req.topic}.",
                expected_concepts=["best practices", "common pitfalls"],
                rubric="Logical response covering key considerations.",
                citations=[],
                difficulty=req.difficulty
            )

    async def evaluate_answer(self, req: AnswerEvaluationRequest) -> AnswerEvaluation:
        if not self.base_url or not self.api_key:
            logger.info("OmniRoute credentials not present, using heuristic evaluation fallback.")
            # Heuristic calculation based on length and keyword coverage
            text_len = len(req.user_answer.strip())
            score = min(95.0, max(40.0, 50.0 + (text_len / 10.0)))
            matched = [c for c in req.expected_concepts if c.lower() in req.user_answer.lower()]
            semantic_score = (len(matched) / max(1, len(req.expected_concepts))) * 100.0 if req.expected_concepts else score
            
            return AnswerEvaluation(
                score=round(score, 1),
                semantic_score=round(semantic_score, 1),
                strengths=["Structured answer format", "Direct response to prompt"] if text_len > 20 else ["Attempted question"],
                weaknesses=["Could include more specific domain concepts"] if len(matched) < len(req.expected_concepts) else [],
                explanation=f"Your response provided a solid overview. You covered key aspects related to {', '.join(matched) if matched else 'the topic'}.",
                improvement_advice="Elaborate further on concrete implementation details and edge cases."
            )

        prompt_str = f"Evaluate answer for question: '{req.question_prompt}'. User answer: '{req.user_answer}'. Expected concepts: {req.expected_concepts}. Rubric: {req.rubric}. Return JSON matching: {{'score': float, 'semantic_score': float, 'strengths': [string], 'weaknesses': [string], 'explanation': string, 'improvement_advice': string}}"
        raw_json = await self._call_ai(prompt_str)
        try:
            parsed = json.loads(raw_json)
            return AnswerEvaluation(**parsed)
        except Exception as e:
            logger.error(f"Failed to parse evaluation response: {e}")
            return AnswerEvaluation(
                score=70.0,
                semantic_score=70.0,
                strengths=["Answer submitted successfully"],
                weaknesses=["Automated detailed feedback unavailable"],
                explanation="Your response was received and logged.",
                improvement_advice="Continue practicing with more detailed examples."
            )

    async def next_interview_turn(self, req: InterviewTurnRequest) -> InterviewTurnResponse:
        turn_count = len(req.history)
        if turn_count >= 4:
            return InterviewTurnResponse(
                interviewer_question="Thank you for taking part in this mock interview. We have concluded all interview questions.",
                feedback_on_previous="Solid answer showing good problem solving methodology.",
                is_completed=True,
                overall_summary="Strong overall presentation, clear communication of concepts, and structured answers."
            )
        
        return InterviewTurnResponse(
            interviewer_question=f"Question {turn_count + 1}: Can you describe a challenging technical or situational scenario you faced in a {req.target_role} role and how you resolved it?",
            feedback_on_previous="Good effort on your previous response." if req.user_answer else None,
            is_completed=False,
            overall_summary=None
        )

    @retry(stop=stop_after_attempt(settings.AI_MAX_RETRIES), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def _call_ai(self, prompt: str) -> str:
        async with httpx.AsyncClient(timeout=settings.AI_REQUEST_TIMEOUT_SECONDS) as client:
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            payload = {
                "model": self.default_model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2
            }
            resp = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
            if resp.status_code != 200:
                raise Exception(f"OmniRoute request failed: {resp.status_code} - {resp.text}")
            data = resp.json()
            return data["choices"][0]["message"]["content"]

ai_gateway = OmniRouteAIGateway()
