import httpx
import json
import os
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


class RetryableAIError(Exception):
    """Network/timeout/5xx errors — worth retrying."""


class NonRetryableAIError(Exception):
    """Auth failures, bad requests, malformed responses — retrying wastes time."""

class OmniRouteAIGateway:
    def __init__(self):
        self.base_url = settings.OMNIROUTE_BASE_URL
        self.api_key = settings.OMNIROUTE_API_KEY or os.getenv("ANTHROPIC_API_KEY") or os.getenv("OPENAI_API_KEY") or os.getenv("GROQ_API_KEY")
        self.default_model = settings.OMNIROUTE_DEFAULT_MODEL

    async def generate_question(self, req: QuestionGenerationRequest) -> GeneratedQuestion:
        if self.base_url and self.api_key and self.api_key != "your-actual-api-key":
            prompt_str = f"Generate a {req.difficulty} difficulty practice question on '{req.topic}'. Target role: {req.target_role or 'Learner'}. Respond ONLY in valid JSON matching schema: {{\"prompt\": \"string\", \"expected_concepts\": [\"string\"], \"rubric\": \"string\", \"citations\": [\"string\"], \"difficulty\": \"string\"}}"
            try:
                raw_json = await self._call_ai(prompt_str)
                parsed = json.loads(raw_json)
                return GeneratedQuestion(**parsed)
            except Exception as e:
                logger.error(f"Failed to call/parse online AI response for question generation: {e}")

        # Intelligent dynamic fallback question generator
        logger.info("Using intelligent dynamic fallback question generator.")
        difficulty_prompts = {
            "easy": f"Define the fundamental concept of {req.topic} and explain why it is essential in modern software applications.",
            "medium": f"How does {req.topic} operate in practice? Compare its primary tradeoffs and architecture when applied for a {req.target_role or 'Software Engineer'}.",
            "hard": f"Analyze an advanced edge-case scenario involving {req.topic}. How would you optimize system performance and maintain reliability under high concurrency?"
        }
        prompt_text = difficulty_prompts.get(req.difficulty.lower(), f"Discuss the core design and application of {req.topic}.")

        return GeneratedQuestion(
            prompt=prompt_text,
            expected_concepts=[f"{req.topic} architecture", "performance tradeoffs", "best practices", "edge-case handling"],
            rubric=f"Clear structural breakdown of {req.topic}, mentioning core mechanics, practical use cases, and design tradeoffs.",
            citations=[f"Official {req.topic} Documentation", "StudyForge AI Knowledge Base"],
            difficulty=req.difficulty
        )

    async def evaluate_answer(self, req: AnswerEvaluationRequest) -> AnswerEvaluation:
        if self.base_url and self.api_key and self.api_key != "your-actual-api-key":
            prompt_str = f"Evaluate answer for question: '{req.question_prompt}'. User answer: '{req.user_answer}'. Expected concepts: {req.expected_concepts}. Rubric: {req.rubric}. Return JSON matching: {{\"score\": float, \"semantic_score\": float, \"strengths\": [\"string\"], \"weaknesses\": [\"string\"], \"explanation\": \"string\", \"improvement_advice\": \"string\"}}"
            try:
                raw_json = await self._call_ai(prompt_str)
                parsed = json.loads(raw_json)
                return AnswerEvaluation(**parsed)
            except Exception as e:
                logger.error(f"Failed to call/parse evaluation response: {e}")

        # Heuristic calculation based on length, depth, and concept keyword matching
        text_len = len(req.user_answer.strip())
        matched = [c for c in req.expected_concepts if any(word in req.user_answer.lower() for word in c.lower().split())]
        
        base_score = min(95.0, max(45.0, 55.0 + (text_len / 8.0)))
        concept_coverage = (len(matched) / max(1, len(req.expected_concepts))) if req.expected_concepts else 0.8
        semantic_score = round(min(98.0, base_score * 0.4 + concept_coverage * 60.0), 1)
        final_score = round((base_score + semantic_score) / 2.0, 1)

        strengths = []
        if text_len > 30:
            strengths.append("Provided a detailed explanation with clear structure")
        if matched:
            strengths.append(f"Successfully addressed concepts: {', '.join(matched[:2])}")
        else:
            strengths.append("Demonstrated direct engagement with the practice question")

        weaknesses = []
        unmatched = [c for c in req.expected_concepts if c not in matched]
        if unmatched:
            weaknesses.append(f"Omitted key expected concepts: {', '.join(unmatched[:2])}")
        if text_len < 40:
            weaknesses.append("Response could be expanded with more technical specifics and concrete code examples")

        return AnswerEvaluation(
            score=final_score,
            semantic_score=semantic_score,
            strengths=strengths,
            weaknesses=weaknesses if weaknesses else ["Minor formatting polish could further improve clarity"],
            explanation=f"Your answer scored {final_score}/100 based on semantic alignment with expected subject concepts.",
            improvement_advice="Incorporate real-world production trade-offs and code/architectural examples in future responses."
        )

    async def next_interview_turn(self, req: InterviewTurnRequest) -> InterviewTurnResponse:
        turn_count = len(req.history)
        if turn_count >= 4:
            return InterviewTurnResponse(
                interviewer_question="Thank you for completing this mock interview session!",
                feedback_on_previous="Clear articulation and logical structure in your final response.",
                is_completed=True,
                overall_summary=f"Strong technical communication demonstrated for a {req.target_role} position. Consistent depth across situational and architectural questions."
            )
        
        interview_questions = [
            f"Welcome to your mock interview for the {req.target_role} position! To start, could you introduce yourself and describe a recent technical project you led?",
            f"Great. Can you explain a complex architecture or technical trade-off you had to navigate in that project?",
            f"Tell me about a time when a system failure or unexpected production bug occurred under your watch. How did you diagnose and resolve it?",
            f"Finally, how do you approach performance optimization and scalability when designing services for high-concurrency environments?"
        ]
        
        question = interview_questions[turn_count] if turn_count < len(interview_questions) else f"Question {turn_count + 1}: How do you handle technical debt in fast-moving projects?"

        return InterviewTurnResponse(
            interviewer_question=question,
            feedback_on_previous="Good depth and structural methodology." if req.user_answer else None,
            is_completed=False,
            overall_summary=None
        )

    @retry(
        stop=stop_after_attempt(settings.AI_MAX_RETRIES),
        wait=wait_exponential(multiplier=1, min=1, max=4),
        retry=retry_if_exception_type(RetryableAIError),
        reraise=True,
    )
    async def _call_ai(self, prompt: str) -> str:
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        payload = {
            "model": self.default_model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2
        }
        try:
            async with httpx.AsyncClient(timeout=settings.AI_REQUEST_TIMEOUT_SECONDS) as client:
                resp = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
        except (httpx.TimeoutException, httpx.ConnectError, httpx.ReadError) as e:
            # Transient network issue — worth a retry.
            raise RetryableAIError(str(e)) from e

        if resp.status_code == 429 or resp.status_code >= 500:
            # Rate limited or upstream failure — worth a retry.
            raise RetryableAIError(f"AI API request failed: {resp.status_code} - {resp.text}")
        if resp.status_code != 200:
            # Bad request, auth failure, etc — retrying won't help, fail fast.
            raise NonRetryableAIError(f"AI API request failed: {resp.status_code} - {resp.text}")

        data = resp.json()
        return data["choices"][0]["message"]["content"]

ai_gateway = OmniRouteAIGateway()

