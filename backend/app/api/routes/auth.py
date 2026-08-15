from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status, Request, Response, Cookie
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
from app.core.limiter import limiter
from app.core.cookies import set_refresh_cookie, clear_refresh_cookie

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/hour")
async def register(request: Request, req: UserRegisterRequest):
    user = await auth_service.register_user(req)
    return {"message": "Registration successful. OTP sent to your email.", "user_id": str(user.id)}

@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(request: Request, response: Response, req: UserLoginRequest):
    tokens, refresh_token = await auth_service.authenticate_user(req)
    set_refresh_cookie(response, refresh_token)
    # Trigger security login alert
    await email_service.send_security_login_alert(req.email.lower())
    return tokens

@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("30/minute")
async def refresh(
    request: Request,
    response: Response,
    refresh_token: str | None = Cookie(default=None),
):
    if not refresh_token:
        raise StudyForgeException(
            code="INVALID_TOKEN", message="No refresh token provided.", status_code=status.HTTP_401_UNAUTHORIZED
        )
    tokens, new_refresh_token = await auth_service.refresh_tokens(refresh_token)
    set_refresh_cookie(response, new_refresh_token)
    return tokens

@router.post("/logout")
async def logout(response: Response):
    clear_refresh_cookie(response)
    return {"message": "Logged out."}

@router.post("/verify-email/confirm")
@limiter.limit("10/hour")
async def verify_email_confirm(request: Request, req: OTPVerifyRequest):
    success = await email_service.verify_otp(req.email.lower(), req.otp_code, purpose="verification")
    if not success:
        raise StudyForgeException(code="INVALID_OTP", message="Invalid or expired OTP code.")

    user = await User.find_one({"email": req.email.lower()})
    if user:
        user.email_verified_at = datetime.now(timezone.utc)
        await user.save()
        # Trigger welcome email upon successful email verification
        await email_service.send_welcome_email(user.email, user.display_name)

    return {"message": "Email verified successfully."}

@router.post("/password/forgot")
@limiter.limit("5/hour")
async def forgot_password(request: Request, req: ForgotPasswordRequest):
    await email_service.generate_and_save_otp(req.email.lower(), purpose="password_reset")
    return {"message": "Password reset OTP sent to email."}

@router.post("/password/reset")
@limiter.limit("10/hour")
async def reset_password(request: Request, req: ResetPasswordRequest):
    success = await email_service.verify_otp(req.email.lower(), req.otp_code, purpose="password_reset")
    if not success:
        raise StudyForgeException(code="INVALID_OTP", message="Invalid or expired OTP code.")

    user = await User.find_one({"email": req.email.lower()})
    if not user:
        raise StudyForgeException(code="USER_NOT_FOUND", message="User not found.")

    user.password_hash = hash_password(req.new_password)
    await user.save()

    # Send confirmation email
    await email_service.send_password_changed_email(user.email)
    return {"message": "Password reset successfully."}
