from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.auth import UserProfileUpdate
from app.models.practice import MasteryProfile

router = APIRouter(prefix="/me", tags=["User Profile"])


@router.get("")
async def get_me(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "email": user.email,
        "display_name": user.display_name,
        "role": user.role,
        "email_verified": user.email_verified_at is not None,
        "goals": user.goals,
        "target_role": user.target_role,
        "preferences": user.preferences.dict() if user.preferences else {},
    }


@router.patch("")
async def update_me(req: UserProfileUpdate, user: User = Depends(get_current_user)):
    if req.display_name is not None:
        user.display_name = req.display_name
    if req.target_role is not None:
        user.target_role = req.target_role
    if req.goals is not None:
        user.goals = req.goals
    if req.preferred_subjects is not None:
        user.preferences.preferred_subjects = req.preferred_subjects
    if req.difficulty_preference is not None:
        user.preferences.difficulty_preference = req.difficulty_preference

    await user.save()
    return {"message": "Profile updated successfully"}


@router.get("/mastery")
async def get_my_mastery(user: User = Depends(get_current_user)):
    masteries = await MasteryProfile.find(
        MasteryProfile.user_id == str(user.id)
    ).to_list()
    return masteries
