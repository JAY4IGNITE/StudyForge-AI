from datetime import datetime, timedelta, timezone
from typing import Optional, Any
import jwt
from passlib.context import CryptContext
from app.core.config import settings
from app.core.errors import StudyForgeException
from fastapi import status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(subject: str, role: str = "learner", expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_TTL_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "type": "access"
    }
    encoded_jwt = jwt.encode(to_encode, settings.JWT_ACCESS_SECRET, algorithm="HS256")
    return encoded_jwt

def create_refresh_token(subject: str, jti: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.JWT_REFRESH_TTL_DAYS)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "jti": jti,
        "type": "refresh"
    }
    encoded_jwt = jwt.encode(to_encode, settings.JWT_REFRESH_SECRET, algorithm="HS256")
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_ACCESS_SECRET, algorithms=["HS256"])
        if payload.get("type") != "access":
            raise StudyForgeException(code="INVALID_TOKEN", message="Invalid token type", status_code=status.HTTP_401_UNAUTHORIZED)
        return payload
    except jwt.ExpiredSignatureError:
        raise StudyForgeException(code="TOKEN_EXPIRED", message="Access token has expired", status_code=status.HTTP_401_UNAUTHORIZED)
    except jwt.PyJWTError:
        raise StudyForgeException(code="INVALID_TOKEN", message="Could not validate credentials", status_code=status.HTTP_401_UNAUTHORIZED)

def decode_refresh_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_REFRESH_SECRET, algorithms=["HS256"])
        if payload.get("type") != "refresh":
            raise StudyForgeException(code="INVALID_TOKEN", message="Invalid refresh token type", status_code=status.HTTP_401_UNAUTHORIZED)
        return payload
    except jwt.ExpiredSignatureError:
        raise StudyForgeException(code="TOKEN_EXPIRED", message="Refresh token has expired", status_code=status.HTTP_401_UNAUTHORIZED)
    except jwt.PyJWTError:
        raise StudyForgeException(code="INVALID_TOKEN", message="Could not validate refresh token", status_code=status.HTTP_401_UNAUTHORIZED)
