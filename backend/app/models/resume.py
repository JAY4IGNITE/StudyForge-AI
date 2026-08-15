from datetime import datetime, timezone
from typing import Literal, Optional, Dict, Any
import uuid
from sqlalchemy import String, Integer, Float, DateTime, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base

ResumeStatus = Literal["uploaded", "processing", "parsed", "scored", "failed"]
ParseStatus = Literal["pending", "processing", "completed", "failed"]


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[str] = mapped_column(String, index=True)
    original_filename: Mapped[str] = mapped_column(String)
    content_type: Mapped[str] = mapped_column(String)
    file_size: Mapped[int] = mapped_column(Integer)
    r2_key: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="uploaded")
    parse_status: Mapped[str] = mapped_column(String, default="pending")
    parse_quality: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    parsed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    parsed_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

    __table_args__ = (
        Index(
            "idx_resumes_user_id_deleted_at_uploaded_at",
            "user_id",
            "deleted_at",
            "uploaded_at",
        ),
    )
