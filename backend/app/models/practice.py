from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
import uuid
from sqlalchemy import String, Integer, Float, DateTime, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from pydantic import BaseModel, Field
from app.db.database import Base

class Topic(Base):
    __tablename__ = "topics"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    slug: Mapped[str] = mapped_column(String, unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    domain: Mapped[str] = mapped_column(String, default="general")
    status: Mapped[str] = mapped_column(String, default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class Question(Base):
    __tablename__ = "questions"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic_id: Mapped[str] = mapped_column(String, index=True)
    difficulty: Mapped[str] = mapped_column(String)
    mode: Mapped[str] = mapped_column(String, default="text")
    prompt: Mapped[str] = mapped_column(String)
    expected_concepts: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    rubric: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    citations: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    prompt_version: Mapped[str] = mapped_column(String, default="v1")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class PracticeSession(Base):
    __tablename__ = "practice_sessions"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[str] = mapped_column(String, index=True)
    topic_id: Mapped[str] = mapped_column(String)
    target_difficulty: Mapped[str] = mapped_column(String, default="medium")
    status: Mapped[str] = mapped_column(String, default="active")
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

class EvaluationDetail(BaseModel):
    score: float
    semantic_score: float
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    explanation: str
    improvement_advice: str

class Attempt(Base):
    __tablename__ = "attempts"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[str] = mapped_column(String, index=True)
    session_id: Mapped[str] = mapped_column(String, index=True)
    question_id: Mapped[str] = mapped_column(String)
    answer_text: Mapped[str] = mapped_column(String)
    score: Mapped[float] = mapped_column(Float)
    semantic_score: Mapped[float] = mapped_column(Float)
    evaluation: Mapped[Dict[str, Any]] = mapped_column(JSON)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class MasteryProfile(Base):
    __tablename__ = "mastery_profiles"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[str] = mapped_column(String, index=True)
    topic_id: Mapped[str] = mapped_column(String, index=True)
    mastery_score: Mapped[float] = mapped_column(Float, default=50.0)
    confidence: Mapped[float] = mapped_column(Float, default=0.5)
    rolling_accuracy: Mapped[float] = mapped_column(Float, default=0.5)
    recommended_difficulty: Mapped[str] = mapped_column(String, default="medium")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class LearningResource(Base):
    __tablename__ = "resources"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String)
    url: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    topic_id: Mapped[str] = mapped_column(String)
    difficulty: Mapped[str] = mapped_column(String)
    tags: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    source_attribution: Mapped[str] = mapped_column(String, default="StudyForge AI")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
