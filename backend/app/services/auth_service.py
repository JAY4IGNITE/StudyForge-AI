import uuid
from datetime import datetime, timezone, timedelta
from typing import Tuple
from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.models.user import User, RefreshToken
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, TokenResponse, UserProfileUpdate
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_refresh_token
from app.core.errors import StudyForgeException
from app.services.email_service import email_service

class AuthService:
    @staticmethod
    async def register_user(session: AsyncSession, req: UserRegisterRequest) -> User:
        result = await session.execute(select(User).where(User.email == req.email.lower()))
        existing = result.scalars().first()
        if existing:
            raise StudyForgeException(code="EMAIL_EXISTS", message="An account with this email already exists.", status_code=status.HTTP_400_BAD_REQUEST)
        
        user = User(
            email=req.email.lower(),
            password_hash=hash_password(req.password),
            display_name=req.display_name
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        await email_service.generate_and_save_otp(session, user.email, purpose="verification")
        return user

    @staticmethod
    async def authenticate_user(session: AsyncSession, req: UserLoginRequest) -> Tuple[TokenResponse, str]:
        result = await session.execute(select(User).where(User.email == req.email.lower()))
        user = result.scalars().first()
        if not user or not verify_password(req.password, user.password_hash):
            raise StudyForgeException(code="INVALID_CREDENTIALS", message="Invalid email or password.", status_code=status.HTTP_401_UNAUTHORIZED)
        
        return await AuthService.create_user_tokens(session, user)

    @staticmethod
    async def create_user_tokens(session: AsyncSession, user: User) -> Tuple[TokenResponse, str]:
        """Returns (TokenResponse for the JSON body, raw refresh token for the httpOnly cookie)."""
        jti = str(uuid.uuid4())
        access_token = create_access_token(subject=str(user.id), role=user.role)
        refresh_token = create_refresh_token(subject=str(user.id), jti=jti)
        
        # Save refresh token
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.JWT_REFRESH_TTL_DAYS)
        token_doc = RefreshToken(
            user_id=str(user.id),
            jti=jti,
            expiry=expires_at
        )
        session.add(token_doc)
        await session.commit()
        return TokenResponse(access_token=access_token), refresh_token

    @staticmethod
    async def refresh_tokens(session: AsyncSession, refresh_token_str: str) -> Tuple[TokenResponse, str]:
        payload = decode_refresh_token(refresh_token_str)
        user_id = payload.get("sub")
        jti = payload.get("jti")
        
        result = await session.execute(select(RefreshToken).where(RefreshToken.jti == jti, RefreshToken.is_revoked == False))
        token_doc = result.scalars().first()
        if not token_doc:
            raise StudyForgeException(code="TOKEN_REVOKED", message="Refresh token revoked or invalid", status_code=status.HTTP_401_UNAUTHORIZED)
            
        token_doc.is_revoked = True
        await session.commit()
        
        user_uuid = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
        user_result = await session.execute(select(User).where(User.id == user_uuid))
        user = user_result.scalars().first()
        if not user:
            raise StudyForgeException(code="USER_NOT_FOUND", message="User not found", status_code=status.HTTP_404_NOT_FOUND)
            
        return await AuthService.create_user_tokens(session, user)

auth_service = AuthService()
