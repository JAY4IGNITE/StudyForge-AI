import re
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List


def _validate_password_strength(value: str) -> str:
    if len(value) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    if not re.search(r"[A-Za-z]", value):
        raise ValueError("Password must contain at least one letter.")
    if not re.search(r"\d", value):
        raise ValueError("Password must contain at least one digit.")
    return value


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    display_name: str

    @field_validator("password")
    @classmethod
    def check_password_strength(cls, v: str) -> str:
        return _validate_password_strength(v)

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    # The refresh token is set as an httpOnly cookie (see auth.py routes)
    # and is deliberately NOT included here — it must never be readable
    # by frontend JavaScript.
    access_token: str
    token_type: str = "bearer"

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp_code: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def check_password_strength(cls, v: str) -> str:
        return _validate_password_strength(v)

class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    target_role: Optional[str] = None
    goals: Optional[List[str]] = None
    preferred_subjects: Optional[List[str]] = None
    difficulty_preference: Optional[str] = None
