from datetime import datetime, timezone
from typing import List, Optional
from beanie import Document, Indexed
from pydantic import Field

class AtsReport(Document):
    user_id: Indexed(str) # type: ignore
    resume_id: Indexed(str) # type: ignore
    job_description_text: str # In a full system this might reference a Job model
    overall_score: float
    keyword_score: float
    semantic_score: float
    formatting_score: float
    completeness_score: float
    impact_score: float
    confidence: float
    matched_keywords: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "ats_reports"
        indexes = [
            [("user_id", 1), ("created_at", -1)],
            [("resume_id", 1)]
        ]
