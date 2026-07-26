from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from beanie import Document, Indexed
from pydantic import BaseModel, Field

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

class InterviewSession(Document):
    user_id: Indexed(str) # type: ignore
    mode: str = "technical" # technical, behavioral, coding, hr, resume, job_description
    target_role: str = "Software Engineer"
    target_company: Optional[str] = None
    job_description_text: Optional[str] = None
    resume_id: Optional[str] = None
    livekit_room_name: Optional[str] = None
    livekit_token: Optional[str] = None
    recording_url: Optional[str] = None
    turns: List[TurnTurnData] = Field(default_factory=list)
    status: str = "active" # active, completed, canceled
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

    class Settings:
        name = "interview_sessions"

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

class InterviewReport(Document):
    interview_id: Indexed(str) # type: ignore
    user_id: Indexed(str) # type: ignore
    overall_score: float = 85.0
    scores: RadarScore = Field(default_factory=RadarScore)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    ats_keywords_missing: List[str] = Field(default_factory=list)
    resume_improvements: List[str] = Field(default_factory=list)
    learning_plan_7_days: List[LearningPlanDay] = Field(default_factory=list)
    learning_plan_14_days: List[LearningPlanDay] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "interview_reports"

class ResumeAnalysis(Document):
    user_id: Indexed(str) # type: ignore
    file_name: str
    extracted_skills: List[str] = Field(default_factory=list)
    extracted_projects: List[str] = Field(default_factory=list)
    extracted_experience: List[str] = Field(default_factory=list)
    generated_questions: List[str] = Field(default_factory=list)
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "resume_analyses"
