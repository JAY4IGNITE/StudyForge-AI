from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
import uuid
from sqlalchemy import String, Float, Integer, DateTime, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from pydantic import BaseModel, Field
from app.db.database import Base

class VisionTelemetry(BaseModel):
    eye_contact_percentage: float = 87.0
    head_pose_stability: float = 90.0
    posture_score: float = 92.0
    slouch_count: int = 0
    shoulder_alignment_score: float = 94.0
    attention_score: float = 88.0
    looking_away_count: int = 2
    hand_gesture_count: int = 5

class VoiceTelemetry(BaseModel):
    speaking_speed_wpm: float = 140.0
    pause_count: int = 4
    filler_word_count: int = 3
    filler_word_breakdown: Dict[str, int] = Field(default_factory=dict)
    speech_clarity_score: float = 92.0
    average_pause_seconds: float = 1.2

class TurnTurnData(BaseModel):
    turn_index: int
    question: str
    user_answer: Optional[str] = None
    audio_duration_seconds: float = 0.0
    transcript_confidence: float = 0.95
    feedback: Optional[str] = None
    ideal_answer: Optional[str] = None
    better_answer: Optional[str] = None
    vision_metrics: Optional[VisionTelemetry] = None
    voice_metrics: Optional[VoiceTelemetry] = None
    code_submission: Optional[str] = None
    code_execution_result: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InterviewSession(Base):
    __tablename__ = "interview_sessions"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[str] = mapped_column(String, index=True)
    mode: Mapped[str] = mapped_column(String, default="technical")
    target_role: Mapped[str] = mapped_column(String, default="Software Engineer")
    target_company: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    job_description_text: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    resume_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    livekit_room_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    livekit_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    recording_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    pending_question: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    turns: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String, default="active")
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

class RadarScore(BaseModel):
    communication: float = 85.0
    technical: float = 80.0
    confidence: float = 88.0
    problem_solving: float = 82.0
    coding: float = 78.0
    behavioral: float = 84.0

class LearningPlanDay(BaseModel):
    day: int
    topic: str
    focus: str
    recommended_resources: List[str] = Field(default_factory=list)

class InterviewReport(Base):
    __tablename__ = "interview_reports"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interview_id: Mapped[str] = mapped_column(String, index=True)
    user_id: Mapped[str] = mapped_column(String, index=True)
    overall_score: Mapped[float] = mapped_column(Float, default=85.0)
    scores: Mapped[Dict[str, Any]] = mapped_column(JSON, default=lambda: RadarScore().model_dump())
    strengths: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    weaknesses: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    ats_keywords_missing: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    resume_improvements: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    ats_score: Mapped[float] = mapped_column(Float, default=0.0)
    learning_plan_7_days: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    learning_plan_14_days: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[str] = mapped_column(String, index=True)
    file_name: Mapped[str] = mapped_column(String)
    extracted_skills: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    extracted_projects: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    extracted_experience: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    generated_questions: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    ats_score: Mapped[float] = mapped_column(Float, default=0.0)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
