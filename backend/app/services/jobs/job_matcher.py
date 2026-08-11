from typing import List, Dict, Any
from app.models.user import User

class JobMatcher:
    def __init__(self):
        pass
        
    def calculate_match(self, job_requirements: List[str], user_skills: List[str], user_preferences: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates a compatibility score (0-100) between a user and a job.
        
        Args:
            job_requirements: List of normalized skills required by the job
            user_skills: List of skills the user possesses (from profile/resume)
            user_preferences: Other user preferences (location, etc.)
            
        Returns:
            Dictionary containing the score, matched skills, missing skills, and analysis.
        """
        if not job_requirements:
            return {
                "overall_match_percentage": 50, # Neutral score if no requirements specified
                "matched_skills": [],
                "missing_skills": [],
                "analysis_reasoning": "The job description does not specify clear skill requirements. Complete your profile to improve match accuracy."
            }
            
        job_req_lower = [req.lower() for req in job_requirements]
        user_skills_lower = [skill.lower() for skill in user_skills]
        
        matched = []
        missing = []
        
        for req in job_req_lower:
            # Simple substring matching for now
            if any(req in user_skill or user_skill in req for user_skill in user_skills_lower):
                # Find the original case from job requirements
                original_req = next((r for r in job_requirements if r.lower() == req), req)
                matched.append(original_req)
            else:
                original_req = next((r for r in job_requirements if r.lower() == req), req)
                missing.append(original_req)
                
        # Calculate base score based on skills (Weight: 70%)
        skill_score = (len(matched) / len(job_requirements)) * 100 if job_requirements else 0
        
        # Add a baseline score so it's not 0% (Weight: 30%)
        # This could incorporate education, experience, etc.
        baseline_score = 15 
        
        final_score = int((skill_score * 0.7) + (baseline_score * (100 / 30) * 0.3))
        # Cap at 100
        final_score = min(final_score, 100)
        
        reasoning = "Your profile is a strong match." if final_score > 75 else (
            "You have some relevant skills, but there are notable gaps." if final_score > 40 else 
            "Significant skill gaps detected. Consider using the Study Roadmap to prepare."
        )
        
        return {
            "overall_match_percentage": final_score,
            "matched_skills": matched,
            "missing_skills": missing,
            "analysis_reasoning": reasoning
        }
        
job_matcher = JobMatcher()
