from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.api.deps import get_current_user
from app.models.user import User
from app.models.coding_profile import CodingProfile, PlatformConnection
from app.schemas.coding_profile import (
    CodingProfileCreate,
    CodingProfileUpdate,
    CodingProfileResponse,
    PublicCodingProfileResponse,
    PlatformConnectRequest,
)
from app.services.coding_profile.aggregator_service import sync_profile_stats
from app.services.coding_profile.leetcode_service import verify_leetcode_username
from app.services.coding_profile.codeforces_service import verify_codeforces_username
from app.services.coding_profile.github_service import verify_github_username

router = APIRouter(prefix="/coding-profile", tags=["coding-profile"])


@router.post("/create", response_model=CodingProfileResponse)
async def create_profile(
    profile_in: CodingProfileCreate, current_user: User = Depends(get_current_user)
):
    existing = await CodingProfile.find_one(CodingProfile.user_id == current_user.id)
    if existing:
        raise HTTPException(
            status_code=400, detail="Profile already exists for this user"
        )

    # Check if slug is taken
    slug_taken = await CodingProfile.find_one(
        CodingProfile.profile_slug == profile_in.profile_slug
    )
    if slug_taken:
        raise HTTPException(status_code=400, detail="Profile slug already taken")

    new_profile = CodingProfile(
        user_id=current_user.id,
        display_name=profile_in.display_name,
        bio=profile_in.bio,
        profile_slug=profile_in.profile_slug,
    )

    await new_profile.insert()
    return new_profile


@router.get("/me", response_model=CodingProfileResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    profile = await CodingProfile.find_one(CodingProfile.user_id == current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Auto-sync if needed
    profile = await sync_profile_stats(profile, force=False)
    return profile


@router.get("/{slug}", response_model=PublicCodingProfileResponse)
async def get_public_profile(slug: str):
    profile = await CodingProfile.find_one(CodingProfile.profile_slug == slug)
    if not profile or not profile.is_public:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile = await sync_profile_stats(profile, force=False)
    return profile


@router.put("/update", response_model=CodingProfileResponse)
async def update_profile(
    update_in: CodingProfileUpdate, current_user: User = Depends(get_current_user)
):
    profile = await CodingProfile.find_one(CodingProfile.user_id == current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_data = update_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    await profile.save()
    return profile


@router.post("/sync", response_model=CodingProfileResponse)
async def sync_profile(current_user: User = Depends(get_current_user)):
    profile = await CodingProfile.find_one(CodingProfile.user_id == current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile = await sync_profile_stats(profile, force=True)
    return profile


@router.post("/connect", response_model=CodingProfileResponse)
async def connect_platform(
    req: PlatformConnectRequest, current_user: User = Depends(get_current_user)
):
    profile = await CodingProfile.find_one(CodingProfile.user_id == current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    platform_name = req.platform.lower()

    # Verify username exists on the target platform
    is_valid = False
    if platform_name == "leetcode":
        is_valid = await verify_leetcode_username(req.username)
        if is_valid:
            profile.platforms.leetcode = PlatformConnection(
                username=req.username, verified=True
            )
    elif platform_name == "codeforces":
        is_valid = await verify_codeforces_username(req.username)
        if is_valid:
            profile.platforms.codeforces = PlatformConnection(
                username=req.username, verified=True
            )
    elif platform_name == "github":
        is_valid = await verify_github_username(req.username)
        if is_valid:
            profile.platforms.github = PlatformConnection(
                username=req.username, verified=True
            )
    else:
        raise HTTPException(status_code=400, detail="Unsupported platform")

    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail=f"Username {req.username} not found on {platform_name}",
        )

    await profile.save()

    # Trigger a sync for the new platform
    profile = await sync_profile_stats(profile, force=True)
    return profile


@router.delete("/disconnect/{platform}", response_model=CodingProfileResponse)
async def disconnect_platform(
    platform: str, current_user: User = Depends(get_current_user)
):
    profile = await CodingProfile.find_one(CodingProfile.user_id == current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    platform_name = platform.lower()
    if hasattr(profile.platforms, platform_name):
        setattr(profile.platforms, platform_name, None)
        # Clear cached stats for this platform
        if hasattr(profile.cached_stats, platform_name):
            setattr(profile.cached_stats, platform_name, None)
        await profile.save()
        return profile
    else:
        raise HTTPException(status_code=400, detail="Unsupported platform")
