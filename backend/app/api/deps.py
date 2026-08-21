import logging
import jwt
from fastapi import Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.user import User
from app.core.errors import StudyForgeException
from app.core.supabase import get_supabase_client
from app.core.config import settings
from datetime import datetime, timezone

logger = logging.getLogger(__name__)
security_bearer = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_bearer),
) -> User:
    token = credentials.credentials
    user_id = None
    user_email = None
    user_metadata = {}
    is_email_verified = False

    # 1. Fast local verification if SUPABASE_JWT_SECRET is configured
    if settings.SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )
            user_id = payload.get("sub")
            user_email = payload.get("email")
            user_metadata = payload.get("user_metadata", {})
            is_email_verified = bool(
                payload.get("email_confirmed_at")
                or payload.get("app_metadata", {}).get("email_verified")
            )
        except Exception as e:
            logger.debug(f"Local JWT verification failed: {e}")

    # 2. Fallback to Supabase Auth API verification
    if not user_id or not user_email:
        try:
            supabase = get_supabase_client()
            user_response = supabase.auth.get_user(token)
            sb_user = user_response.user
            if sb_user:
                user_id = sb_user.id
                user_email = sb_user.email
                user_metadata = sb_user.user_metadata or {}
                is_email_verified = bool(getattr(sb_user, "email_confirmed_at", None))
        except Exception as e:
            logger.error(f"Supabase Auth API verification failed: {e}")

    if not user_id or not user_email:
        raise StudyForgeException(
            code="INVALID_TOKEN",
            message="Could not validate credentials",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    # Sync user to local DB
    user = await User.find_one({"oauth_id": user_id})
    if not user:
        # Fallback to check if a user with this email already exists
        user = await User.find_one({"email": user_email})
        if user:
            user.oauth_id = user_id
            user.auth_provider = "supabase"
            await user.save()
        else:
            name = (
                user_metadata.get("full_name", user_email.split("@")[0])
                if user_metadata
                else user_email.split("@")[0]
            )
            user = User(
                email=user_email,
                auth_provider="supabase",
                oauth_id=user_id,
                display_name=name,
                email_verified_at=datetime.now(timezone.utc)
                if is_email_verified
                else None,
                goals=[],
                preferences={},
            )
            await user.insert()

    return user
