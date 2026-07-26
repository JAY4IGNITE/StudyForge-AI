from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from app.schemas.auth import (
    UserRegisterRequest, UserLoginRequest, TokenResponse,
    OTPVerifyRequest, ForgotPasswordRequest, ResetPasswordRequest, UserProfileUpdate
)
from app.services.auth_service import auth_service
from app.services.email_service import email_service
from app.api.deps import get_current_user
from app.models.user import User
from app.core.errors import StudyForgeException
from app.core.security import hash_password

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(req: UserRegisterRequest):
    user = await auth_service.register_user(req)
    return {"message": "Registration successful. OTP sent to your email.", "user_id": str(user.id)}

@router.post("/login", response_model=TokenResponse)
async def login(req: UserLoginRequest):
    return await auth_service.authenticate_user(req)

@router.post("/refresh", response_model=TokenResponse)
async def refresh(refresh_token: str):
    return await auth_service.refresh_tokens(refresh_token)

@router.post("/verify-email/confirm")
async def verify_email_confirm(req: OTPVerifyRequest):
    success = await email_service.verify_otp(req.email.lower(), req.otp_code, purpose="verification")
    if not success:
        raise StudyForgeException(code="INVALID_OTP", message="Invalid or expired OTP code.")
    
    user = await User.find_one(User.email == req.email.lower())
    if user:
        user.email_verified_at = datetime.now(timezone.utc)
        await user.save()
    return {"message": "Email verified successfully."}

@router.post("/password/forgot")
async def forgot_password(req: ForgotPasswordRequest):
    await email_service.generate_and_save_otp(req.email.lower(), purpose="password_reset")
    return {"message": "Password reset OTP sent to email."}

@router.post("/password/reset")
async def reset_password(req: ResetPasswordRequest):
    success = await email_service.verify_otp(req.email.lower(), req.otp_code, purpose="password_reset")
    if not success:
        raise StudyForgeException(code="INVALID_OTP", message="Invalid or expired OTP code.")
        
    user = await User.find_one(User.email == req.email.lower())
    if not user:
        raise StudyForgeException(code="USER_NOT_FOUND", message="User not found.")
        
    user.password_hash = hash_password(req.new_password)
    await user.save()
    return {"message": "Password reset successfully."}
