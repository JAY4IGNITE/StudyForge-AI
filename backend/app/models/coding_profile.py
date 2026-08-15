from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field
import uuid
from sqlalchemy import String, Boolean, DateTime, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from app.db.database import Base


class PlatformConnection(BaseModel):
    username: str
    verified: bool = False
    access_token: Optional[str] = None  # encrypted if we store github oauth


class ConnectedPlatforms(BaseModel):
    leetcode: Optional[PlatformConnection] = None
    gfg: Optional[PlatformConnection] = None
    codeforces: Optional[PlatformConnection] = None
    codechef: Optional[PlatformConnection] = None
    github: Optional[PlatformConnection] = None
    hackerrank: Optional[PlatformConnection] = None


class CachedStats(BaseModel):
    leetcode: Optional[Dict[str, Any]] = None
    gfg: Optional[Dict[str, Any]] = None
    codeforces: Optional[Dict[str, Any]] = None
    codechef: Optional[Dict[str, Any]] = None
    github: Optional[Dict[str, Any]] = None
    last_synced_at: Optional[datetime] = None


class Project(BaseModel):
    title: str
    description: str
    tech_stack: List[str]
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    image_url: Optional[str] = None


class SocialLinks(BaseModel):
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    portfolio: Optional[str] = None


class CodingProfile(Base):
    __tablename__ = "coding_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[str] = mapped_column(String, index=True)
    display_name: Mapped[str] = mapped_column(String)
    bio: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    profile_slug: Mapped[str] = mapped_column(String, unique=True, index=True)

    platforms: Mapped[Dict[str, Any]] = mapped_column(
        JSON, default=lambda: ConnectedPlatforms().model_dump()
    )
    cached_stats: Mapped[Dict[str, Any]] = mapped_column(
        JSON, default=lambda: CachedStats().model_dump()
    )

    skills: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    projects: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    social_links: Mapped[Dict[str, Any]] = mapped_column(
        JSON, default=lambda: SocialLinks().model_dump()
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
