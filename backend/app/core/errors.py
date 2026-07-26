from fastapi import Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Any
from loguru import logger

class ErrorDetail(BaseModel):
    code: str
    message: str
    request_id: Optional[str] = None
    details: Optional[Any] = None

class ErrorResponse(BaseModel):
    error: ErrorDetail

class StudyForgeException(Exception):
    def __init__(self, code: str, message: str, status_code: int = status.HTTP_400_BAD_REQUEST, details: Any = None):
        self.code = code
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
