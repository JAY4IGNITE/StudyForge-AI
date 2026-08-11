from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

class JobSearchRequest(BaseModel):
    query: str
    page: int = 1
    num_pages: int = 1
    employment_types: Optional[str] = None
    remote_jobs_only: bool = False
    date_posted: str = "all"

class JobRequiredExperience(BaseModel):
    required_experience_in_months: Optional[int] = None
    experience_mentioned: Optional[bool] = None
    experience_preferred: Optional[bool] = None

class JobData(BaseModel):
    job_id: str
    employer_name: Optional[str] = None
    employer_logo: Optional[str] = None
    employer_website: Optional[str] = None
    job_publisher: Optional[str] = None
    job_employment_type: Optional[str] = None
    job_title: str
    job_apply_link: Optional[str] = None
    job_description: Optional[str] = None
    job_is_remote: Optional[bool] = None
    job_city: Optional[str] = None
    job_state: Optional[str] = None
    job_country: Optional[str] = None
    job_posted_at_datetime_utc: Optional[str] = None
    job_min_salary: Optional[float] = None
    job_max_salary: Optional[float] = None
    job_salary_currency: Optional[str] = None
    job_salary_period: Optional[str] = None
    job_required_skills: Optional[List[str]] = None
    job_required_experience: Optional[JobRequiredExperience] = None

class JobSearchResponse(BaseModel):
    status: str
    request_id: str
    parameters: dict
    data: List[JobData]

class JobMatchScore(BaseModel):
    overall_match_percentage: int
    matched_skills: List[str]
    missing_skills: List[str]
    analysis_reasoning: str

class JobApplicationCreate(BaseModel):
    job_id: str
    company_name: str
    job_title: str
    location: Optional[str] = None
    application_url: Optional[str] = None

class JobApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class JobApplicationResponse(BaseModel):
    id: str
    user_id: str
    job_id: str
    company_name: str
    job_title: str
    location: Optional[str] = None
    application_url: Optional[str] = None
    status: str
    notes: Optional[str] = None
    saved_at: datetime
    applied_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
