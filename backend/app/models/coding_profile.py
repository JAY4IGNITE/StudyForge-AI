from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from beanie import Document, Indexed
from uuid import UUID

class PlatformConnection(BaseModel):
    username: str
    verified: bool = False
    access_token: Optional[str] = None # encrypted if we store github oauth

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

class CodingProfile(Document):
    user_id: UUID
    display_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_public: bool = True
    profile_slug: Indexed(str, unique=True) # type: ignore
    
    platforms: ConnectedPlatforms = Field(default_factory=ConnectedPlatforms)
    cached_stats: CachedStats = Field(default_factory=CachedStats)
    
    skills: List[str] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    social_links: SocialLinks = Field(default_factory=SocialLinks)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "coding_profiles"
