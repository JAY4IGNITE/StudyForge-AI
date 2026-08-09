import pytest

from app.core.errors import StudyForgeException
from app.utils.r2_keys import (
    MAX_RESUME_FILE_SIZE_BYTES,
    build_resume_r2_key,
    parse_resume_r2_key,
    validate_resume_upload,
)


def test_build_resume_r2_key_pdf():
    key = build_resume_r2_key("user-abc", "resume-xyz", ".pdf")
    assert key == "resumes/user-abc/resume-xyz/original/resume.pdf"


def test_build_resume_r2_key_docx():
    key = build_resume_r2_key("user-abc", "resume-xyz", ".docx")
    assert key == "resumes/user-abc/resume-xyz/original/resume.docx"


def test_build_resume_r2_key_rejects_invalid_extension():
    with pytest.raises(StudyForgeException) as exc:
        build_resume_r2_key("user-abc", "resume-xyz", ".txt")

    assert exc.value.code == "INVALID_RESUME_EXTENSION"


def test_parse_resume_r2_key_round_trip():
    key = build_resume_r2_key("64ab123", "resume_8f3", ".pdf")
    parsed = parse_resume_r2_key(key)

    assert parsed == {
        "user_id": "64ab123",
        "resume_id": "resume_8f3",
        "extension": ".pdf",
        "filename": "resume.pdf",
    }


def test_parse_resume_r2_key_invalid():
    assert parse_resume_r2_key("resumes/user/file.pdf") is None
    assert parse_resume_r2_key("uploads/user/id/original/resume.pdf") is None


def test_validate_resume_upload_pdf():
    extension = validate_resume_upload(
        original_filename="Software Engineer.pdf",
        content_type="application/pdf",
        file_size=1024,
    )
    assert extension == ".pdf"


def test_validate_resume_upload_docx():
    extension = validate_resume_upload(
        original_filename="Backend Developer.docx",
        content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        file_size=2048,
    )
    assert extension == ".docx"


def test_validate_resume_upload_rejects_unsupported_extension():
    with pytest.raises(StudyForgeException) as exc:
        validate_resume_upload(
            original_filename="resume.txt",
            content_type="text/plain",
            file_size=100,
        )

    assert exc.value.code == "INVALID_RESUME_EXTENSION"


def test_validate_resume_upload_rejects_type_mismatch():
    with pytest.raises(StudyForgeException) as exc:
        validate_resume_upload(
            original_filename="resume.pdf",
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            file_size=100,
        )

    assert exc.value.code == "RESUME_TYPE_MISMATCH"


def test_validate_resume_upload_rejects_oversized_file():
    with pytest.raises(StudyForgeException) as exc:
        validate_resume_upload(
            original_filename="resume.pdf",
            content_type="application/pdf",
            file_size=MAX_RESUME_FILE_SIZE_BYTES + 1,
        )

    assert exc.value.code == "RESUME_FILE_TOO_LARGE"


def test_resume_model_defaults():
    from datetime import datetime, timezone

    from app.models.resume import Resume

    resume = Resume(
        user_id="user-1",
        original_filename="resume.pdf",
        content_type="application/pdf",
        file_size=1024,
        r2_key="resumes/user-1/resume-1/original/resume.pdf",
    )

    assert resume.status == "uploaded"
    assert resume.parse_status == "pending"
    assert resume.parse_quality is None
    assert resume.deleted_at is None
    assert resume.uploaded_at.tzinfo is not None
    assert resume.uploaded_at <= datetime.now(timezone.utc)
