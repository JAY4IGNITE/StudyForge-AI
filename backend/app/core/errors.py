from fastapi import Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Any, Union
from loguru import logger
from enum import Enum

class ErrorCode(str, Enum):
    # Auth & Users
    EMAIL_EXISTS = "EMAIL_EXISTS"
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
    TOKEN_REVOKED = "TOKEN_REVOKED"
    USER_NOT_FOUND = "USER_NOT_FOUND"
    INVALID_TOKEN = "INVALID_TOKEN"
    TOKEN_EXPIRED = "TOKEN_EXPIRED"
    INVALID_OTP = "INVALID_OTP"
    
    # Practice
    TOPIC_NOT_FOUND = "TOPIC_NOT_FOUND"
    SESSION_NOT_FOUND = "SESSION_NOT_FOUND"
    QUESTION_NOT_FOUND = "QUESTION_NOT_FOUND"
    
    # File Storage
    FILE_NOT_FOUND = "FILE_NOT_FOUND"
    UPLOAD_FAILED = "UPLOAD_FAILED"
    DOWNLOAD_FAILED = "DOWNLOAD_FAILED"
    DELETE_FAILED = "DELETE_FAILED"
    STORAGE_ERROR = "STORAGE_ERROR"
    
    # General
    BAD_REQUEST = "BAD_REQUEST"
    INTERNAL_ERROR = "INTERNAL_ERROR"
    NOT_FOUND = "NOT_FOUND"

class ErrorDetail(BaseModel):
    code: str
    message: str
    request_id: Optional[str] = None
    details: Optional[Any] = None

class ErrorResponse(BaseModel):
    error: ErrorDetail

class StudyForgeException(Exception):
    def __init__(self, code: Union[ErrorCode, str], message: str, status_code: int = status.HTTP_400_BAD_REQUEST, details: Any = None):
        # Support both Enum and string during migration, but store as string
        self.code = code.value if isinstance(code, ErrorCode) else code
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)

async def studyforge_exception_handler(request: Request, exc: StudyForgeException):
    request_id = getattr(request.state, "request_id", None)
    logger.warning(f"[{exc.code}] {exc.message} (Request ID: {request_id})")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "request_id": request_id,
                "details": exc.details
            }
        }
    )
