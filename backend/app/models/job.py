from datetime import datetime, timezone
from typing import Optional
from beanie import Document, Indexed
from pydantic import Field

class JobApplication(Document):
    user_id: Indexed(str)  # type: ignore
    job_id: Indexed(str)   # type: ignore # JSearch job ID
    company_name: str
    job_title: str
    location: Optional[str] = None
    application_url: Optional[str] = None
    
    # Statuses: Saved, Interested, Applied, Assessment, Interview, Offer, Rejected, Withdrawn
    status: str = "Saved"
    
    notes: Optional[str] = None
    
    saved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    applied_at: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "job_applications"
        indexes = [
            [("user_id", 1), ("status", 1)],
            [("user_id", 1), ("job_id", 1)]
        ]
