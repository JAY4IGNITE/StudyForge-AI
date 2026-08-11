from app.models.user import User
from app.services.ai.generator import AIGenerator
from app.services.jobs.jsearch_service import jsearch_service
from app.services.jobs.job_matcher import job_matcher
from fastapi import HTTPException
from typing import Dict, Any

class JobRecommendationService:
    def __init__(self):
        self.ai = AIGenerator()

    async def analyze_job(self, job_id: str, current_user: User) -> Dict[str, Any]:
        """
        Analyze a job with AI, providing insights and a personalized match summary.
        """
        try:
            # 1. Fetch job details
            job_details = await jsearch_service.get_job_details(job_id)
            if not job_details.get("data"):
                raise HTTPException(status_code=404, detail="Job not found.")
                
            job_data = job_details["data"][0]
            
            # 2. Extract job context
            job_title = job_data.get("job_title", "Unknown Role")
            job_description = job_data.get("job_description", "")
            job_skills = job_data.get("job_required_skills", [])
            
            # 3. Get user match score
            match_data = job_matcher.calculate_match(job_skills, current_user.preferences.preferred_subjects, current_user.preferences.dict())
            
            missing_skills = match_data.get("missing_skills", [])
            matched_skills = match_data.get("matched_skills", [])
            
            # 4. Generate AI Prompt
            prompt = f"""
            Analyze the following job description for the role of '{job_title}'.
            
            Job Description:
            {job_description[:2000]}... (truncated)
            
            The applicant has the following skills: {', '.join(matched_skills) if matched_skills else 'None specifically mentioned'}.
            The applicant is missing these key skills: {', '.join(missing_skills) if missing_skills else 'None specifically identified'}.
            
            Provide a structured analysis returning exactly this JSON format:
            {{
                "what_they_want": "1-2 sentence summary of the core objective of this role",
                "key_technologies": ["tech1", "tech2", "tech3"],
                "likely_interview_topics": ["topic1", "topic2"],
                "preparation_recommendations": ["Actionable step 1", "Actionable step 2", "Actionable step 3"]
            }}
            """
            
            # 5. Call AI (using existing infrastructure)
            analysis_result = await self.ai.generate_json(prompt)
            
            return {
                "match_score": match_data["overall_match_percentage"],
                "analysis": analysis_result
            }
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise
            raise HTTPException(status_code=500, detail=f"Failed to analyze job: {str(e)}")

job_recommendation_service = JobRecommendationService()
