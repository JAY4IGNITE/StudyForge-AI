from datetime import datetime, timezone
from typing import Literal, Optional

from beanie import Document, Indexed
from pydantic import Field

ResumeStatus = Literal["uploaded", "processing", "parsed", "scored", "failed"]
ParseStatus = Literal["pending", "processing", "completed", "failed"]


class Resume(Document):
    user_id: Indexed(str)  # type: ignore
    original_filename: str
    content_type: str
    file_size: int
    r2_key: str
    status: ResumeStatus = "uploaded"
    parse_status: ParseStatus = "pending"
    parse_quality: Optional[float] = None
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    parsed_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
    parsed_data: Optional[dict] = None

    class Settings:
        name = "resumes"
        indexes = [
            [("user_id", 1), ("deleted_at", 1), ("uploaded_at", -1)],
        ]
