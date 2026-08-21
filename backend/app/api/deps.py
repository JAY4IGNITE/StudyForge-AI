import logging
import jwt
import httpx
from fastapi import Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.user import User
from app.core.errors import StudyForgeException
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
    validation_error_reason = "Unknown error"

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
            validation_error_reason = f"Local JWT decode failed: {e}"
            logger.warning(validation_error_reason)

    # 2. Async verification via Supabase REST API endpoint (/auth/v1/user)
    if not user_id or not user_email:
        if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
            try:
                base_url = str(settings.SUPABASE_URL).rstrip("/")
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.get(
                        f"{base_url}/auth/v1/user",
                        headers={
                            "Authorization": f"Bearer {token}",
                            "apikey": settings.SUPABASE_ANON_KEY,
                        },
                    )
                    if resp.status_code == 200:
                        sb_user = resp.json()
                        user_id = sb_user.get("id")
                        user_email = sb_user.get("email")
                        user_metadata = sb_user.get("user_metadata", {}) or {}
                        is_email_verified = bool(sb_user.get("email_confirmed_at"))
                    else:
                        validation_error_reason = (
                            f"Supabase Auth API returned {resp.status_code}: {resp.text}"
                        )
                        logger.error(validation_error_reason)
            except Exception as e:
                validation_error_reason = f"Network error connecting to Supabase: {e}"
                logger.error(validation_error_reason)
        else:
            validation_error_reason = (
                "Neither SUPABASE_JWT_SECRET nor (SUPABASE_URL and SUPABASE_ANON_KEY) are configured."
            )
            logger.error(validation_error_reason)

    if not user_id or not user_email:
        # Check unverified token for diagnostic clues
        try:
            unverified = jwt.decode(token, options={"verify_signature": False})
            logger.error(
                f"Token validation failed. Token issuer: {unverified.get('iss')}, "
                f"expected Supabase URL: {settings.SUPABASE_URL}. Reason: {validation_error_reason}"
            )
        except Exception:
            pass

        raise StudyForgeException(
            code="INVALID_TOKEN",
            message="Could not validate credentials",
            details={"reason": validation_error_reason}
            if settings.APP_ENV == "development"
            else None,
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
