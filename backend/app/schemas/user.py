from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserPreferencesResponse(BaseModel):
    preferred_subjects: List[str]
    difficulty_preference: str
    practice_mode: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    display_name: str
    role: str
    goals: List[str]
    target_role: Optional[str]
    preferences: UserPreferencesResponse
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
