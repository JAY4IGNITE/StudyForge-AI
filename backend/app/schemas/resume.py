from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator

ResumeStatus = Literal["uploaded", "processing", "parsed", "scored", "failed"]
ParseStatus = Literal["pending", "processing", "completed", "failed"]

# Only these are actually handled by resume_parser_service (PyMuPDF / python-docx).
# Anything else is rejected before we ever hand out an R2 presigned upload URL.
ALLOWED_RESUME_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # .docx
}
ALLOWED_RESUME_EXTENSIONS = {".pdf", ".docx"}


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

    model_config = {"from_attributes": True}


class ResumeListResponse(BaseModel):
    resumes: list[ResumeResponse]
    total: int


class ResumeUploadUrlRequest(BaseModel):
    original_filename: str = Field(..., min_length=1, max_length=255)
    content_type: str = Field(..., min_length=1, max_length=127)
    file_size: int = Field(..., gt=0, le=10 * 1024 * 1024)  # keep in sync with MAX_RESUME_BYTES

    @field_validator("content_type")
    @classmethod
    def content_type_must_be_allowed(cls, v: str) -> str:
        if v not in ALLOWED_RESUME_CONTENT_TYPES:
            raise ValueError("Only PDF and DOCX resumes are supported.")
        return v

    @field_validator("original_filename")
    @classmethod
    def filename_must_have_allowed_extension(cls, v: str) -> str:
        lower = v.lower()
        if not any(lower.endswith(ext) for ext in ALLOWED_RESUME_EXTENSIONS):
            raise ValueError("Resume filename must end in .pdf or .docx")
        # Strip any path components so it can't influence the R2 key structure
        # (e.g. "../other_user/x.pdf" or "sub/dir/x.pdf").
        return v.replace("/", "_").replace("\\", "_")


class ResumeUploadUrlResponse(BaseModel):
    resume_id: str
    r2_key: str
    upload_url: str
    upload_method: str = "PUT"
    expires_in: int
    content_type: str

class ResumeExperience(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    bullets: list[str] = Field(default_factory=list)

class ResumeProject(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    technologies: list[str] = Field(default_factory=list)
    bullets: list[str] = Field(default_factory=list)

class ResumeEducation(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class ParsedResume(BaseModel):
    contact: dict[str, str] = Field(default_factory=dict)
    summary: str = ""
    skills: list[str] = Field(default_factory=list)
    experience: list[ResumeExperience] = Field(default_factory=list)
    projects: list[ResumeProject] = Field(default_factory=list)
    education: list[ResumeEducation] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    achievements: list[str] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)
    raw_text: str = ""
    parser: str = ""
    ocr_used: bool = False
    parse_quality: float = 1.0
    warnings: list[str] = Field(default_factory=list)
