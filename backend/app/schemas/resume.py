from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

ResumeStatus = Literal["uploaded", "processing", "parsed", "scored", "failed"]
ParseStatus = Literal["pending", "processing", "completed", "failed"]


class ResumeResponse(BaseModel):
    id: str
    user_id: str
    original_filename: str
    content_type: str
    file_size: int
    r2_key: str
    status: ResumeStatus
    parse_status: ParseStatus
    parse_quality: Optional[float] = None
    uploaded_at: datetime
    parsed_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ResumeListResponse(BaseModel):
    resumes: list[ResumeResponse]
    total: int


class ResumeUploadUrlRequest(BaseModel):
    original_filename: str = Field(..., min_length=1, max_length=255)
    content_type: str = Field(..., min_length=1, max_length=127)
    file_size: int = Field(..., gt=0)


class ResumeUploadUrlResponse(BaseModel):
    resume_id: str
    r2_key: str
    upload_url: str
    upload_method: str = "PUT"
    expires_in: int
    content_type: str
