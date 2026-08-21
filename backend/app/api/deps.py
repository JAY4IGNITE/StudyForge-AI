import logging
from fastapi import Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.user import User
from app.core.errors import StudyForgeException
from app.core.supabase import get_supabase_client
from datetime import datetime, timezone

logger = logging.getLogger(__name__)
security_bearer = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_bearer),
) -> User:
    token = credentials.credentials
    try:
        supabase = get_supabase_client()
        user_response = supabase.auth.get_user(token)
        sb_user = user_response.user
    except Exception as e:
        logger.error(f"Error validating Supabase user token: {e}")
        raise StudyForgeException(
            code="INVALID_TOKEN",
            message="Could not validate credentials",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    if not sb_user:
        raise StudyForgeException(
            code="INVALID_TOKEN",
            message="Could not validate credentials",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    # Sync user to local DB
    user = await User.find_one({"oauth_id": sb_user.id})
    if not user:
        # Fallback to check if a user with this email already exists
        user = await User.find_one({"email": sb_user.email})
        if user:
            user.oauth_id = sb_user.id
            user.auth_provider = "supabase"
            await user.save()
        else:
            name = (
                sb_user.user_metadata.get("full_name", sb_user.email.split("@")[0])
                if sb_user.user_metadata
                else sb_user.email.split("@")[0]
            )
            user = User(
                email=sb_user.email,
                auth_provider="supabase",
                oauth_id=sb_user.id,
                display_name=name,
                email_verified_at=datetime.now(timezone.utc)
                if getattr(sb_user, "email_confirmed_at", None)
                else None,
                goals=[],
                preferences={},
            )
            await user.insert()

    return user
