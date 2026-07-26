from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    display_name: str

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
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

class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    target_role: Optional[str] = None
    goals: Optional[List[str]] = None
    preferred_subjects: Optional[List[str]] = None
    difficulty_preference: Optional[str] = None
