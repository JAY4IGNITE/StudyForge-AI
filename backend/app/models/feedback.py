from datetime import datetime, timezone
from typing import Optional, List
from beanie import Document, Indexed
from pydantic import Field, BaseModel

class Feedback(Document):
    user_id: Indexed(str) # type: ignore
    category: str # practice, interview, platform, bug
    rating: int # 1 to 5
    comment: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "feedback"

class RoadmapItem(BaseModel):
    step_number: int
    topic_name: str
    reason: str
    estimated_hours: int

class UserRoadmap(Document):
    user_id: Indexed(str) # type: ignore
    target_role: str
    steps: List[RoadmapItem] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "user_roadmaps"
