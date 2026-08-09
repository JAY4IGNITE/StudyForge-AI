import os
from typing import Optional

from app.core.errors import StudyForgeException

RESUME_R2_PREFIX = "resumes"

ALLOWED_RESUME_EXTENSIONS = {".pdf", ".docx"}
ALLOWED_RESUME_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

EXTENSION_BY_CONTENT_TYPE = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
}

CONTENT_TYPE_BY_EXTENSION = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

MAX_RESUME_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


def normalize_extension(filename: str) -> str:
    _, ext = os.path.splitext(filename.lower().strip())
    return ext if ext else ""


def extension_for_content_type(content_type: str) -> str:
    normalized = content_type.lower().strip()
    extension = EXTENSION_BY_CONTENT_TYPE.get(normalized)
    if not extension:
        raise StudyForgeException(
            code="INVALID_RESUME_CONTENT_TYPE",
            message="Unsupported resume content type.",
            details={"content_type": content_type},
        )
    return extension


def validate_resume_upload(
    original_filename: str,
    content_type: str,
    file_size: int,
    max_size_bytes: int = MAX_RESUME_FILE_SIZE_BYTES,
) -> str:
    extension = normalize_extension(original_filename)
    if extension not in ALLOWED_RESUME_EXTENSIONS:
        raise StudyForgeException(
            code="INVALID_RESUME_EXTENSION",
            message="Only PDF and DOCX resume files are supported.",
            details={"extension": extension or None},
        )

    normalized_content_type = content_type.lower().strip()
    if normalized_content_type not in ALLOWED_RESUME_CONTENT_TYPES:
        raise StudyForgeException(
            code="INVALID_RESUME_CONTENT_TYPE",
            message="Unsupported resume content type.",
            details={"content_type": content_type},
        )

    expected_extension = EXTENSION_BY_CONTENT_TYPE[normalized_content_type]
    if extension != expected_extension:
        raise StudyForgeException(
            code="RESUME_TYPE_MISMATCH",
            message="File extension does not match the declared content type.",
            details={
                "extension": extension,
                "content_type": content_type,
            },
        )

    if file_size > max_size_bytes:
        raise StudyForgeException(
            code="RESUME_FILE_TOO_LARGE",
            message="Resume file exceeds the maximum allowed size.",
            details={"file_size": file_size, "max_size": max_size_bytes},
        )

    return expected_extension


def build_resume_r2_key(user_id: str, resume_id: str, extension: str) -> str:
    if extension not in ALLOWED_RESUME_EXTENSIONS:
        raise StudyForgeException(
            code="INVALID_RESUME_EXTENSION",
            message="Unsupported resume file extension for storage.",
            details={"extension": extension},
        )

    return f"{RESUME_R2_PREFIX}/{user_id}/{resume_id}/original/resume{extension}"


def parse_resume_r2_key(r2_key: str) -> Optional[dict[str, str]]:
    parts = r2_key.strip("/").split("/")
    if len(parts) != 5:
        return None
    prefix, user_id, resume_id, folder, filename = parts
    if prefix != RESUME_R2_PREFIX or folder != "original":
        return None
    if not filename.startswith("resume"):
        return None

    extension = normalize_extension(filename)
    if extension not in ALLOWED_RESUME_EXTENSIONS:
        return None

    return {
        "user_id": user_id,
        "resume_id": resume_id,
        "extension": extension,
        "filename": filename,
    }
