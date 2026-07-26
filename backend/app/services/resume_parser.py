import json
from typing import Dict, Any, List
from app.services.ai_interview_engine import ai_interview_engine
from app.core.logging import logger

class ResumeParserService:
    @staticmethod
    async def parse_and_extract(resume_text: str, filename: str = "resume.pdf") -> Dict[str, Any]:
        """
        Extracts projects, skills, work experience, and custom questions using NVIDIA NIM.
        """
        prompt = f"""
You are an expert technical recruiter analyzing a candidate's resume.

Resume Document Text:
\"\"\"{resume_text[:4000]}\"\"\"

Extract structured candidate insights and generate 5 tailored interview questions.

Respond ONLY in valid JSON format (no markdown code blocks):
{{
  "extracted_skills": ["Python", "React", "FastAPI", "MongoDB", "Docker", "AWS"],
  "extracted_projects": ["StudyForge AI Platform", "Real-Time Distributed Chat Service"],
  "extracted_experience": ["Software Development Engineer at Tech Corp (2 years)"],
  "generated_questions": [
    "I see you built a real-time chat service. How did you handle WebSocket connection failures and scaling?",
    "Can you explain your experience using FastAPI and MongoDB Atlas in production?",
    "Tell me about a technical trade-off you had to make when designing your StudyForge AI platform."
  ]
}}
"""
        raw = await ai_interview_engine._call_nvidia_nim([{"role": "user", "content": prompt}], temperature=0.3)
        try:
            cleaned = raw.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            return json.loads(cleaned.strip())
        except Exception as e:
            logger.error(f"Failed to parse resume JSON: {e}")
            return {
                "extracted_skills": ["Software Engineering", "Full-Stack Development", "Problem Solving"],
                "extracted_projects": ["Full-Stack Web Application"],
                "extracted_experience": ["Software Engineer"],
                "generated_questions": [
                    "Can you walk me through your most complex software project?",
                    "How do you ensure high performance and low latency in your web applications?"
                ]
            }

resume_parser_service = ResumeParserService()
