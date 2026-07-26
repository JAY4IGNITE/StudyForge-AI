from datetime import datetime, timezone
from typing import Optional, List
from beanie import Document, Indexed
from pydantic import Field, BaseModel

class Topic(Document):
    name: Indexed(str, unique=True) # type: ignore
    slug: Indexed(str, unique=True) # type: ignore
    description: Optional[str] = None
    domain: str = "general"
    status: str = "active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "topics"

class Question(Document):
    topic_id: str
    difficulty: str # easy, medium, hard
    mode: str = "text"
    prompt: str
    expected_concepts: List[str] = Field(default_factory=list)
    rubric: Optional[str] = None
    citations: List[str] = Field(default_factory=list)
    prompt_version: str = "v1"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "questions"

class PracticeSession(Document):
    user_id: Indexed(str) # type: ignore
    topic_id: str
    target_difficulty: str = "medium"
    status: str = "active" # active, completed
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

    class Settings:
        name = "practice_sessions"

class EvaluationDetail(BaseModel):
    score: float # 0 to 100
    semantic_score: float # 0 to 100
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    explanation: str
    improvement_advice: str

class Attempt(Document):
    user_id: Indexed(str) # type: ignore
    session_id: Indexed(str) # type: ignore
    question_id: str
    answer_text: str
    score: float
    semantic_score: float
    evaluation: EvaluationDetail
    duration_seconds: int = 0
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "attempts"

class MasteryProfile(Document):
    user_id: Indexed(str) # type: ignore
    topic_id: Indexed(str) # type: ignore
    mastery_score: float = 50.0 # 0 to 100
    confidence: float = 0.5
    rolling_accuracy: float = 0.5
    recommended_difficulty: str = "medium"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "mastery_profiles"

class InterviewSession(Document):
    user_id: Indexed(str) # type: ignore
    target_role: str
    interview_type: str # behavioral, technical, situational
    turns: List[dict] = Field(default_factory=list)
    final_evaluation: Optional[dict] = None
    status: str = "active"
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

    class Settings:
        name = "interview_sessions"

class LearningResource(Document):
    title: str
    url: str
    description: str
    topic_id: str
    difficulty: str
    tags: List[str] = Field(default_factory=list)
    source_attribution: str = "StudyForge AI"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "resources"
