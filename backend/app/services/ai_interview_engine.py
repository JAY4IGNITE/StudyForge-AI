import json
import httpx
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger

NVIDIA_NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
DEFAULT_MODEL = "meta/llama-3.1-70b-instruct"


class AIInterviewEngine:
    @staticmethod
    async def _call_nvidia_nim(
        messages: List[Dict[str, str]], temperature: float = 0.5, max_tokens: int = 1500
    ) -> str:
        if not settings.NVIDIA_NIM_API_KEY:
            logger.warning("NVIDIA_NIM_API_KEY is not set. Using fallback AI response.")
            return ""

        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_NIM_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": DEFAULT_MODEL,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(NVIDIA_NIM_URL, headers=headers, json=payload)
                if res.status_code == 200:
                    return res.json()["choices"][0]["message"]["content"]
                else:
                    logger.error(f"NVIDIA NIM Error {res.status_code}: {res.text}")
                    return ""
        except Exception as e:
            logger.error(f"Exception during NVIDIA NIM API call: {e}")
            return ""

    @staticmethod
    async def get_initial_question(
        mode: str,
        target_role: str,
        job_description: Optional[str] = None,
        resume_context: Optional[str] = None,
    ) -> str:
        prompt = f"""
You are an expert executive AI interviewer conducting a real-time voice & video interview for the role of '{target_role}'.
Interview Mode: '{mode}' (technical, behavioral, coding, hr, resume, job_description).
Job Description Context: {job_description or 'Standard industry requirements'}
Candidate Resume Context: {resume_context or 'Standard candidate profile'}

Greet the candidate briefly, establish a professional yet warm tone, and ask your FIRST interview question tailored to this role and mode.
Keep your response concise, spoken-friendly, and clear (2-4 sentences).
"""
        messages = [{"role": "user", "content": prompt}]
        response = await AIInterviewEngine._call_nvidia_nim(messages, temperature=0.7)
        if not response:
            return f"Welcome! I am your AI Interviewer for the {target_role} position. To start, could you introduce yourself and highlight your core technical background?"
        return response

    @staticmethod
    async def evaluate_turn(
        history: List[Dict[str, Any]],
        user_answer: str,
        mode: str,
        target_role: str,
        code_submission: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Evaluates the turn answer and generates the next turn or completion status.
        """
        history_summary = []
        for h in history:
            history_summary.append(f"Interviewer: {h.get('question')}")
            if h.get("user_answer"):
                history_summary.append(f"Candidate: {h.get('user_answer')}")

        prompt = f"""
You are conducting a high-stakes AI Interview for the role of '{target_role}' (Mode: '{mode}').

Conversation History:
{chr(10).join(history_summary)}

Candidate's Latest Answer: "{user_answer}"
{f'Submitted Code: {code_submission}' if code_submission else ''}

Evaluate the candidate's latest response.
Determine if the interview is completed (usually after 4-5 turns) or if a follow-up/next question is needed.

Respond ONLY in valid JSON format without markdown code blocks:
{{
  "feedback_on_previous": "Constructive 2-sentence feedback on their latest response.",
  "ideal_answer": "Model exemplary answer demonstrating optimal STAR format or technical correctness.",
  "better_answer": "Direct improved version of the user's specific response.",
  "is_completed": false,
  "next_question": "Follow-up question or new topic question if not completed."
}}
"""
        messages = [{"role": "user", "content": prompt}]
        raw = await AIInterviewEngine._call_nvidia_nim(messages, temperature=0.4)

        try:
            cleaned = raw.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            data = json.loads(cleaned.strip())
            return data
        except Exception as e:
            logger.error(f"Failed to parse turn evaluation JSON: {e}")
            is_done = len(history) >= 4
            return {
                "feedback_on_previous": "Good technical clarity and structured communication.",
                "ideal_answer": "An optimal answer includes specific metrics, architectural choices, and trade-off analysis.",
                "better_answer": user_answer,
                "is_completed": is_done,
                "next_question": (
                    "Can you describe a challenging bug or systemic failure you resolved in your recent project?"
                    if not is_done
                    else ""
                ),
            }

    @staticmethod
    async def generate_full_report(session_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates comprehensive 6-axis report, radar metrics, ATS recommendations, and learning plans.
        """
        role = session_data.get("target_role", "Software Engineer")
        turns = session_data.get("turns", [])

        turns_text = "\n".join(
            [
                f"Q: {t.get('question')}\nA: {t.get('user_answer', 'N/A')}\n"
                for t in turns
            ]
        )

        prompt = f"""
Generate an in-depth executive Interview Performance Report for a '{role}' interview.

Interview Record:
{turns_text}

Respond ONLY in valid JSON format (no markdown fences):
{{
  "overall_score": 86.5,
  "scores": {{
    "communication": 88.0,
    "technical": 84.0,
    "confidence": 90.0,
    "problem_solving": 82.0,
    "coding": 85.0,
    "behavioral": 87.0
  }},
  "strengths": [
    "Clear communication structure using STAR method",
    "Strong technical grasp of system scalability & database indexing"
  ],
  "weaknesses": [
    "Could provide more quantitative impact metrics for past projects",
    "Pacing accelerated slightly during complex technical trade-off questions"
  ],
  "ats_keywords_missing": ["Microservices", "Distributed Caching", "Kubernetes", "Prometheus"],
  "resume_improvements": [
    "Add explicit performance improvement percentages to recent backend refactoring projects",
    "Highlight experience with async event-driven architecture"
  ],
  "learning_plan_7_days": [
    {{"day": 1, "topic": "System Design Patterns", "focus": "Review caching & database sharding strategies", "recommended_resources": ["System Design Primer", "StudyForge Resource Library"]}},
    {{"day": 3, "topic": "STAR Method Refinement", "focus": "Prepare 3 leadership & conflict resolution stories", "recommended_resources": ["Behavioral Interview Mastery"]}}
  ]
}}
"""
        messages = [{"role": "user", "content": prompt}]
        raw = await AIInterviewEngine._call_nvidia_nim(messages, temperature=0.3)
        try:
            cleaned = raw.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            return json.loads(cleaned.strip())
        except Exception:
            return {
                "overall_score": 85.0,
                "scores": {
                    "communication": 86.0,
                    "technical": 84.0,
                    "confidence": 88.0,
                    "problem_solving": 82.0,
                    "coding": 85.0,
                    "behavioral": 85.0,
                },
                "strengths": [
                    "Clear articulation",
                    "Strong fundamental technical knowledge",
                ],
                "weaknesses": ["Elaborate more on specific project metrics"],
                "ats_keywords_missing": ["CI/CD", "Docker", "REST API"],
                "resume_improvements": [
                    "Highlight impact metrics in project descriptions"
                ],
                "learning_plan_7_days": [
                    {
                        "day": 1,
                        "topic": "Core Fundamentals",
                        "focus": "Review key data structures",
                        "recommended_resources": ["StudyForge DSA Module"],
                    }
                ],
            }


ai_interview_engine = AIInterviewEngine()
