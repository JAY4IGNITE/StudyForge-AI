import uuid
import asyncio
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import (
    ResumeUploadUrlRequest,
    ResumeUploadUrlResponse,
    ResumeResponse,
    ResumeListResponse,
)
from app.services.r2_service import r2_service
from app.services.resume_parser import resume_parser_service
from datetime import datetime, timezone
import httpx

MAX_RESUME_BYTES = 10 * 1024 * 1024  # 10 MB

router = APIRouter()


@router.post("/upload-url", response_model=ResumeUploadUrlResponse)
async def generate_upload_url(
    request: ResumeUploadUrlRequest, current_user: User = Depends(get_current_user)
) -> Any:
    """Generate a presigned R2 URL for direct client-side upload."""
    if not r2_service.is_configured:
        raise HTTPException(status_code=503, detail="R2 is not configured")

    resume_id = f"resume_{uuid.uuid4().hex[:12]}"
    r2_key = (
        f"resumes/{current_user.id}/{resume_id}/original/{request.original_filename}"
    )

    url_data = await r2_service.generate_presigned_upload_url(
        key=r2_key, content_type=request.content_type
    )

    # Save pending resume to DB
    resume = Resume(
        user_id=str(current_user.id),
        original_filename=request.original_filename,
        content_type=request.content_type,
        file_size=request.file_size,
        r2_key=r2_key,
        status="uploaded",
    )
    await resume.insert()

    return ResumeUploadUrlResponse(
        resume_id=str(resume.id),
        r2_key=r2_key,
        upload_url=url_data["url"],
        upload_method=url_data["method"],
        expires_in=url_data["expires_in"],
        content_type=request.content_type,
    )


@router.post("/{id}/process", response_model=ResumeResponse)
async def process_resume(
    id: str, current_user: User = Depends(get_current_user)
) -> Any:
    """Download resume from R2, parse it, and save the structured format."""
    resume = await Resume.get(id)
    if not resume or str(resume.user_id) != str(current_user.id):
        raise HTTPException(status_code=404, detail="Resume not found")

    if not await r2_service.object_exists(resume.r2_key):
        raise HTTPException(status_code=404, detail="Resume file not found in R2")

    # Set status to processing
    resume.status = "processing"
    resume.parse_status = "processing"
    await resume.save()

    # Download file (using a presigned GET for simplicity in reading bytes)
    url_data = await r2_service.generate_presigned_download_url(resume.r2_key)
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            async with client.stream("GET", url_data["url"]) as resp:
                resp.raise_for_status()
                chunks = bytearray()
                async for chunk in resp.aiter_bytes():
                    chunks.extend(chunk)
                    if len(chunks) > MAX_RESUME_BYTES:
                        raise ValueError("Resume exceeds the maximum supported size")
                file_bytes = bytes(chunks)
    except Exception as e:
        resume.status = "failed"
        resume.parse_status = "failed"
        await resume.save()
        raise HTTPException(status_code=502, detail=f"Failed to fetch file: {e}") from e

    # Parse
    parsed_resume = await asyncio.to_thread(
        resume_parser_service.parse_resume_file,
        file_bytes=file_bytes,
        filename=resume.original_filename,
        content_type=resume.content_type,
    )

    if parsed_resume.parse_quality == 0.0:
        resume.status = "failed"
        resume.parse_status = "failed"
        await resume.save()
        raise HTTPException(
            status_code=400, detail="Parsing failed: " + str(parsed_resume.warnings)
        )

    resume.status = "parsed"
    resume.parse_status = "completed"
    resume.parse_quality = parsed_resume.parse_quality
    resume.parsed_at = datetime.now(timezone.utc)

    # parsed_data is the structured resume content consumed by the ATS engine.
    # TODO: promote `parsed_data` to a proper typed field on the Resume model
    # (currently set dynamically since Beanie allows extra attributes) so it
    # shows up in schema/OpenAPI instead of being an implicit dynamic field.
    resume.parsed_data = parsed_resume.model_dump()
    await resume.save()

    return resume


@router.get("", response_model=ResumeListResponse)
async def list_resumes(current_user: User = Depends(get_current_user)) -> Any:
    resumes = await Resume.find(Resume.user_id == str(current_user.id)).to_list()
    return ResumeListResponse(resumes=resumes, total=len(resumes))


@router.get("/{id}", response_model=ResumeResponse)
async def get_resume(id: str, current_user: User = Depends(get_current_user)) -> Any:
    resume = await Resume.get(id)
    if not resume or str(resume.user_id) != str(current_user.id):
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.delete("/{id}")
async def delete_resume(id: str, current_user: User = Depends(get_current_user)) -> Any:
    resume = await Resume.get(id)
    if not resume or str(resume.user_id) != str(current_user.id):
        raise HTTPException(status_code=404, detail="Resume not found")

    # Delete from R2
    await r2_service.delete_object(resume.r2_key)

    # Delete from DB
    await resume.delete()
    return {"message": "Resume deleted"}
