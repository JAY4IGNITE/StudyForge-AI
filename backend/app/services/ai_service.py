import json
import httpx
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger
from tenacity import (
    retry,
    wait_exponential,
    stop_after_attempt,
    retry_if_exception_type,
)


class RateLimitError(Exception):
    pass


NVIDIA_NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
DEFAULT_MODEL = "meta/llama-3.1-70b-instruct"


class AIService:
    @staticmethod
    @retry(
        wait=wait_exponential(multiplier=1, min=1, max=4),
        stop=stop_after_attempt(2),
        retry=retry_if_exception_type((httpx.RequestError, RateLimitError)),
        reraise=True,
    )
    async def chat_with_mentor(
        message: str,
        user_name: Optional[str] = None,
        history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        """
        Interacts with NVIDIA NIM (Llama 3.1 70B) to act as Socratic Study Mentor & Interview Coach.
        Generates progressive hints, explanations, and step-by-step solutions.
        """
        if not settings.NVIDIA_NIM_API_KEY:
            return "NVIDIA NIM API key is not configured. Please add NVIDIA_NIM_API_KEY to your environment."

        system_prompt = (
            "You are StudyForge AI Mentor, an expert Socratic tutor and interview coach powered by NVIDIA NIM. "
            "Your goal is to guide students through technical topics (Python, System Design, DSA, Data Science, Web Dev), "
            "provide progressive hints without giving away solutions instantly, and explain code/solutions step-by-step when asked."
        )

        messages = [{"role": "system", "content": system_prompt}]

        if history:
            for item in history[-6:]:  # Keep context compact
                messages.append(
                    {
                        "role": item.get("role", "user"),
                        "content": item.get("content", ""),
                    }
                )

        messages.append({"role": "user", "content": message})

        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_NIM_API_KEY}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": DEFAULT_MODEL,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 1024,
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(NVIDIA_NIM_URL, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"]
                elif res.status_code == 429:
                    logger.warning("NVIDIA NIM Rate Limit Exceeded (429). Retrying...")
                    raise RateLimitError("Rate limit exceeded")
                else:
                    logger.error(
                        f"NVIDIA NIM Chat API error {res.status_code}: {res.text}"
                    )
                    return f"NVIDIA NIM service error ({res.status_code}). Please try again."
        except httpx.RequestError as e:
            logger.error(f"Request error calling NVIDIA NIM API: {e}")
            raise
        except Exception as e:
            logger.error(f"Exception calling NVIDIA NIM API: {e}")
            return "Failed to reach NVIDIA NIM AI service. Please check network connectivity."

    @staticmethod
    async def generate_questions_and_solutions(
        topic: str, difficulty: str = "medium", count: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Uses NVIDIA NIM to generate structured multiple-choice questions with detailed step-by-step solutions.
        """
        if not settings.NVIDIA_NIM_API_KEY:
            logger.warning("NVIDIA_NIM_API_KEY missing during question generation")
            return []

        prompt = f"""
Generate {count} high-quality technical multiple-choice questions for topic '{topic}' at '{difficulty}' difficulty level.

Respond ONLY with a valid JSON array of objects with the following format (no markdown fences, no conversational text):
[
  {{
    "question": "Clear problem statement or question",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_option_index": 0,
    "explanation": "Detailed explanation of why the correct option is right",
    "solution_steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]
  }}
]
"""

        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_NIM_API_KEY}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": DEFAULT_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.5,
            "max_tokens": 2048,
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(NVIDIA_NIM_URL, headers=headers, json=payload)
                if res.status_code == 200:
                    content = res.json()["choices"][0]["message"]["content"].strip()
                    # Clean markdown code block formatting if present
                    if content.startswith("```json"):
                        content = content[7:]
                    if content.startswith("```"):
                        content = content[3:]
                    if content.endswith("```"):
                        content = content[:-3]
                    content = content.strip()
                    return json.loads(content)
                else:
                    logger.error(
                        f"NVIDIA NIM question generation error {res.status_code}: {res.text}"
                    )
                    return []
        except Exception as e:
            logger.error(f"Exception generating questions via NVIDIA NIM: {e}")
            return []

    @staticmethod
    async def generate_json(prompt: str) -> Dict[str, Any]:
        """
        Uses NVIDIA NIM to generate JSON based on a prompt.
        """
        if not settings.NVIDIA_NIM_API_KEY:
            logger.warning("NVIDIA_NIM_API_KEY missing during json generation")
            return {}

        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_NIM_API_KEY}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": DEFAULT_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.5,
            "max_tokens": 2048,
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(NVIDIA_NIM_URL, headers=headers, json=payload)
                if res.status_code == 200:
                    content = res.json()["choices"][0]["message"]["content"].strip()
                    if content.startswith("```json"):
                        content = content[7:]
                    if content.startswith("```"):
                        content = content[3:]
                    if content.endswith("```"):
                        content = content[:-3]
                    content = content.strip()
                    return json.loads(content)
                else:
                    logger.error(
                        f"NVIDIA NIM json generation error {res.status_code}: {res.text}"
                    )
                    return {}
        except Exception as e:
            logger.error(f"Exception generating json via NVIDIA NIM: {e}")
            return {}


ai_service = AIService()
