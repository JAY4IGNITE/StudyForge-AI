import httpx
from typing import Dict, Any, Optional
import urllib.parse
from fastapi import HTTPException
from app.core.config import settings
from app.core.logging import logger

class JSearchService:
    BASE_URL = "https://jsearch.p.rapidapi.com"

    def __init__(self):
        self.api_key = settings.JSEARCH_API_KEY
        if not self.api_key:
            logger.warning("JSEARCH_API_KEY is not set. Job search will use mock data or fail.")
        self.headers = {
            "X-RapidAPI-Key": self.api_key or "",
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        }
    
    async def search_jobs(
        self, 
        query: str, 
        page: int = 1, 
        num_pages: int = 1,
        employment_types: Optional[str] = None,
        remote_jobs_only: bool = False,
        date_posted: str = "all"
    ) -> Dict[str, Any]:
        """Search jobs using JSearch API."""
        if not self.api_key:
            return self._get_mock_search_response(query)

        endpoint = f"{self.BASE_URL}/search"
        
        # JSearch combines many filters into the query string sometimes, but also has explicit params
        params: Dict[str, Any] = {
            "query": query,
            "page": str(page),
            "num_pages": str(num_pages),
            "date_posted": date_posted,
        }

        if employment_types:
            params["employment_types"] = employment_types
        if remote_jobs_only:
            # According to JSearch docs, remote can sometimes be a param or added to query
            params["remote_jobs_only"] = "true"

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    endpoint,
                    headers=self.headers,
                    params=params,
                    timeout=settings.AI_REQUEST_TIMEOUT_SECONDS
                )
                
                if response.status_code == 429:
                    logger.error("JSearch API rate limit exceeded")
                    raise HTTPException(status_code=429, detail="Job search rate limit exceeded. Please try again later.")
                
                response.raise_for_status()
                data = response.json()
                
                if data.get("status") != "OK" and "data" not in data:
                    logger.error(f"JSearch API error: {data}")
                    raise HTTPException(status_code=502, detail="Failed to fetch jobs from external provider.")
                    
                return data

        except httpx.TimeoutException:
            logger.error("JSearch API timeout")
            raise HTTPException(status_code=504, detail="Job search timed out. Please try again.")
        except httpx.HTTPStatusError as e:
            logger.error(f"JSearch API HTTP error: {e.response.status_code} - {e.response.text}")
            raise HTTPException(status_code=502, detail="External job search service error.")
        except Exception as e:
            logger.error(f"Unexpected error calling JSearch API: {str(e)}")
            raise HTTPException(status_code=500, detail="An unexpected error occurred while searching for jobs.")

    async def get_job_details(self, job_id: str) -> Dict[str, Any]:
        """Get details for a specific job."""
        if not self.api_key:
            return self._get_mock_job_details(job_id)

        endpoint = f"{self.BASE_URL}/job-details"
        params = {"job_id": job_id}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    endpoint,
                    headers=self.headers,
                    params=params,
                    timeout=settings.AI_REQUEST_TIMEOUT_SECONDS
                )
                
                if response.status_code == 429:
                    raise HTTPException(status_code=429, detail="Rate limit exceeded.")
                
                response.raise_for_status()
                return response.json()
                
        except Exception as e:
            logger.error(f"Error fetching job details for {job_id}: {str(e)}")
            raise HTTPException(status_code=502, detail="Failed to fetch job details.")

    def _get_mock_search_response(self, query: str) -> Dict[str, Any]:
        """Return a mock response for development when API key is not set."""
        return {
            "status": "OK",
            "request_id": "mock-req-123",
            "parameters": {"query": query},
            "data": [
                {
                    "job_id": "mock-job-1",
                    "employer_name": "Tech Innovators Inc",
                    "employer_logo": "https://ui-avatars.com/api/?name=TI&background=random",
                    "employer_website": "https://example.com",
                    "job_publisher": "LinkedIn",
                    "job_employment_type": "INTERN",
                    "job_title": f"{query.title()} Intern",
                    "job_apply_link": "https://example.com/apply",
                    "job_description": f"We are looking for a highly motivated {query} intern to join our team. You will work on cutting-edge technologies like Python, React, and AWS.",
                    "job_is_remote": True,
                    "job_city": "San Francisco",
                    "job_state": "CA",
                    "job_country": "US",
                    "job_posted_at_datetime_utc": "2026-08-10T10:00:00.000Z",
                    "job_min_salary": 3000,
                    "job_max_salary": 5000,
                    "job_salary_currency": "USD",
                    "job_salary_period": "MONTH",
                    "job_required_skills": ["Python", "React", "Git", "REST APIs", "AWS"],
                    "job_required_experience": {"required_experience_in_months": 0}
                },
                {
                    "job_id": "mock-job-2",
                    "employer_name": "Global Systems Solutions",
                    "employer_logo": "https://ui-avatars.com/api/?name=GS&background=random",
                    "employer_website": "https://example.com",
                    "job_publisher": "Indeed",
                    "job_employment_type": "FULLTIME",
                    "job_title": f"Junior {query.title()}",
                    "job_apply_link": "https://example.com/apply2",
                    "job_description": "Join our backend team. Requirements include Python, FastAPI, MongoDB, and Docker.",
                    "job_is_remote": False,
                    "job_city": "Bengaluru",
                    "job_state": "KA",
                    "job_country": "IN",
                    "job_posted_at_datetime_utc": "2026-08-09T14:30:00.000Z",
                    "job_min_salary": None,
                    "job_max_salary": None,
                    "job_required_skills": ["Python", "FastAPI", "MongoDB", "Docker"],
                    "job_required_experience": {"required_experience_in_months": 12}
                }
            ]
        }
        
    def _get_mock_job_details(self, job_id: str) -> Dict[str, Any]:
        """Return a mock job detail response."""
        mock_data = self._get_mock_search_response("Software Engineer")["data"]
        job = next((j for j in mock_data if j["job_id"] == job_id), mock_data[0])
        return {
            "status": "OK",
            "request_id": "mock-req-456",
            "parameters": {"job_id": job_id},
            "data": [job]
        }

jsearch_service = JSearchService()
