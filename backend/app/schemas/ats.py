from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from app.schemas.resume import ParsedResume

class JobDescriptionSchema(BaseModel):
    title: str = ""
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    responsibilities: List[str] = Field(default_factory=list)
    qualifications: List[str] = Field(default_factory=list)
    education_requirements: str = ""
    experience_years: int = 0
    certifications: List[str] = Field(default_factory=list)
    seniority: str = ""

class AtsScoreBreakdown(BaseModel):
    keyword_score: float = 0.0
    semantic_score: float = 0.0
    formatting_score: float = 0.0
    completeness_score: float = 0.0
    impact_score: float = 0.0

class AtsAnalysisResponse(BaseModel):
    overall_score: float
    confidence: float
    parse_quality: float
    breakdown: AtsScoreBreakdown
    matched_keywords: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    
class JobParserRequest(BaseModel):
    job_text: str
    
class AtsAnalyzeRequest(BaseModel):
    job_text: str
    resume_id: str

from uuid import UUID

class AtsReportSchema(BaseModel):
    id: UUID
    user_id: str
    resume_id: str
    job_description_text: str
    overall_score: float
    keyword_score: float
    semantic_score: float
    formatting_score: float
    completeness_score: float
    impact_score: float
    confidence: float
    matched_keywords: List[str]
    missing_keywords: List[str]
    warnings: List[str]
    recommendations: List[str]
    created_at: datetime
    
    model_config = {"from_attributes": True}
