from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.models.coding_profile import PlatformConnection, ConnectedPlatforms, CachedStats, Project, SocialLinks

class CodingProfileCreate(BaseModel):
    display_name: str
    bio: Optional[str] = None
    profile_slug: str

class CodingProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    is_public: Optional[bool] = None
    skills: Optional[List[str]] = None
    projects: Optional[List[Project]] = None
    social_links: Optional[SocialLinks] = None

class PlatformConnectRequest(BaseModel):
    platform: str
    username: str

class CodingProfileResponse(BaseModel):
    id: str
    display_name: str
    bio: Optional[str]
    avatar_url: Optional[str]
    is_public: bool
    profile_slug: str
    platforms: ConnectedPlatforms
    cached_stats: CachedStats
    skills: List[str]
    projects: List[Project]
    social_links: SocialLinks

    class Config:
        from_attributes = True

class PublicCodingProfileResponse(CodingProfileResponse):
    pass
