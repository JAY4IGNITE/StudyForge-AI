from datetime import datetime, timezone
from typing import Optional, List
from beanie import Document, Indexed
from pydantic import Field, BaseModel

class UserPreferences(BaseModel):
    preferred_subjects: List[str] = Field(default_factory=list)
    difficulty_preference: str = "medium"
    practice_mode: str = "text"

class User(Document):
    email: Indexed(str, unique=True) # type: ignore
    password_hash: Optional[str] = None
    auth_provider: str = "local" # local, google, github
    oauth_id: Optional[str] = None
    display_name: str
    role: str = "learner"
    email_verified_at: Optional[datetime] = None
    goals: List[str] = Field(default_factory=list)
    target_role: Optional[str] = None
    preferences: UserPreferences = Field(default_factory=UserPreferences)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"
        indexes = [
            [("auth_provider", 1), ("oauth_id", 1)]
        ]

class OAuthState(Document):
    state: Indexed(str, unique=True) # type: ignore
    provider: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Settings:
        name = "oauth_states"

class RefreshToken(Document):
    user_id: str
    jti: Indexed(str, unique=True) # type: ignore
    expiry: datetime
    is_revoked: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "refresh_tokens"

class EmailOTP(Document):
    email: Indexed(str) # type: ignore
    purpose: str # verification, password_reset
    otp_code: str
    attempt_count: int = 0
    expires_at: datetime
    consumed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "email_otps"
