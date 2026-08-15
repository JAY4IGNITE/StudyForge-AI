import json
from app.services.ai_interview_engine import ai_interview_engine
from app.schemas.ats import JobDescriptionSchema
from app.core.logging import logger


class JobParserService:
    @staticmethod
    async def parse_job_description(job_text: str) -> JobDescriptionSchema:
        prompt = f"""
You are an expert HR systems analyzer. Parse the following job description text and extract structured requirements.
Extract exact skill names. If years of experience is mentioned, extract it as an integer (e.g. 5). Otherwise use 0.

Job Description:
\"\"\"{job_text[:5000]}\"\"\"

Respond ONLY with valid JSON matching exactly this structure (no markdown fences):
{{
  "title": "Extracted Job Title",
  "required_skills": ["Skill1", "Skill2"],
  "preferred_skills": ["Skill3"],
  "technologies": ["Tech1"],
  "responsibilities": ["Responsibility1"],
  "qualifications": ["Qualification1"],
  "education_requirements": "Bachelors in CS",
  "experience_years": 2,
  "certifications": ["Cert1"],
  "seniority": "Senior"
}}
"""
        raw = await ai_interview_engine._call_nvidia_nim(
            [{"role": "user", "content": prompt}], temperature=0.1
        )
        try:
            cleaned = raw.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]

            data = json.loads(cleaned.strip())
            return JobDescriptionSchema(**data)
        except Exception as e:
            logger.error(f"Failed to parse job description: {e}")
            # Fallback to basic extraction
            return JobDescriptionSchema(
                title="Unknown Title",
                required_skills=[word for word in job_text.split() if len(word) > 4][
                    :10
                ],
            )


job_parser_service = JobParserService()
