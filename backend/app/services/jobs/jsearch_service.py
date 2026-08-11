import httpx
from typing import Dict, Any, Optional
import urllib.parse
from fastapi import HTTPException
from app.core.config import settings
from app.core.logging import logger

class JSearchService:
    BASE_URL = "https://api.openwebninja.com/jsearch"

    def __init__(self):
        self.api_key = settings.JSEARCH_API_KEY or "ak_vtwjdgusa9bfoeaerph11opdpbql6uow889t7zzr7yw3n7o"
        self.headers = {
            "X-API-Key": self.api_key
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
        endpoint = f"{self.BASE_URL}/search-v2"
        
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



jsearch_service = JSearchService()
