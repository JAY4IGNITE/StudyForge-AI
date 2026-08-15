from datetime import datetime, timezone
from typing import List, Optional
import uuid
from sqlalchemy import String, Float, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from pydantic import BaseModel, Field
from app.db.database import Base


class AtsReport(Base):
    __tablename__ = "ats_reports"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[str] = mapped_column(String, index=True)
    resume_id: Mapped[str] = mapped_column(String, index=True)
    job_description_text: Mapped[str] = mapped_column(String)
    overall_score: Mapped[float] = mapped_column(Float)
    keyword_score: Mapped[float] = mapped_column(Float)
    semantic_score: Mapped[float] = mapped_column(Float)
    formatting_score: Mapped[float] = mapped_column(Float)
    completeness_score: Mapped[float] = mapped_column(Float)
    impact_score: Mapped[float] = mapped_column(Float)
    confidence: Mapped[float] = mapped_column(Float)
    matched_keywords: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    missing_keywords: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    warnings: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    recommendations: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (Index("idx_ats_user_created", "user_id", "created_at"),)
