from unittest.mock import MagicMock, patch

import pytest
from botocore.exceptions import ClientError

from app.core.errors import StudyForgeException
from app.services.r2_service import R2Service


@pytest.fixture
def r2_settings():
    with patch("app.services.r2_service.settings") as mock_settings:
        mock_settings.R2_ACCOUNT_ID = "test-account"
        mock_settings.R2_ACCESS_KEY_ID = "test-access-key"
        mock_settings.R2_SECRET_ACCESS_KEY = "test-secret-key"
        mock_settings.R2_BUCKET_NAME = "studyforge-resumes"
        mock_settings.R2_ENDPOINT = "https://test-account.r2.cloudflarestorage.com"
        mock_settings.R2_PRESIGNED_URL_EXPIRY_SECONDS = 3600
        yield mock_settings


@pytest.fixture
def r2_service(r2_settings):
    return R2Service()


@pytest.fixture
def mock_s3_client(r2_service):
    client = MagicMock()
    r2_service._client = client
    return client


def test_is_configured_false_when_missing_credentials():
    service = R2Service()
    with patch("app.services.r2_service.settings") as mock_settings:
        mock_settings.R2_ACCOUNT_ID = None
        mock_settings.R2_ACCESS_KEY_ID = "key"
        mock_settings.R2_SECRET_ACCESS_KEY = "secret"
        mock_settings.R2_BUCKET_NAME = "bucket"
        mock_settings.R2_ENDPOINT = "https://example.r2.cloudflarestorage.com"
        assert service.is_configured is False


def test_require_client_raises_when_not_configured():
    service = R2Service()
    with patch("app.services.r2_service.settings") as mock_settings:
        mock_settings.R2_ACCOUNT_ID = None
        mock_settings.R2_ACCESS_KEY_ID = None
        mock_settings.R2_SECRET_ACCESS_KEY = None
        mock_settings.R2_BUCKET_NAME = None
        mock_settings.R2_ENDPOINT = None

        with pytest.raises(StudyForgeException) as exc:
            service._require_client()

        assert exc.value.code == "R2_NOT_CONFIGURED"


def test_upload_object_sync(mock_s3_client, r2_service):
    mock_s3_client.put_object.return_value = {"ETag": '"abc123"'}

    result = r2_service._upload_object_sync(
        key="resumes/user-1/resume-1/original/resume.pdf",
        body=b"%PDF-1.4",
        content_type="application/pdf",
        metadata={"user_id": "user-1"},
    )

    mock_s3_client.put_object.assert_called_once_with(
        Bucket="studyforge-resumes",
        Key="resumes/user-1/resume-1/original/resume.pdf",
        Body=b"%PDF-1.4",
        ContentType="application/pdf",
        Metadata={"user_id": "user-1"},
    )
    assert result["key"] == "resumes/user-1/resume-1/original/resume.pdf"
    assert result["etag"] == '"abc123"'


def test_delete_object_sync(mock_s3_client, r2_service):
    result = r2_service._delete_object_sync("resumes/user-1/resume-1/original/resume.pdf")

    mock_s3_client.delete_object.assert_called_once_with(
        Bucket="studyforge-resumes",
        Key="resumes/user-1/resume-1/original/resume.pdf",
    )
    assert result["deleted"] is True


def test_generate_presigned_upload_url_sync(mock_s3_client, r2_service):
    mock_s3_client.generate_presigned_url.return_value = "https://signed-upload.example/upload"

    result = r2_service._generate_presigned_upload_url_sync(
        key="resumes/user-1/resume-1/original/resume.pdf",
        content_type="application/pdf",
    )

    mock_s3_client.generate_presigned_url.assert_called_once_with(
        ClientMethod="put_object",
        Params={
            "Bucket": "studyforge-resumes",
            "Key": "resumes/user-1/resume-1/original/resume.pdf",
            "ContentType": "application/pdf",
        },
        ExpiresIn=3600,
    )
    assert result["method"] == "PUT"
    assert result["url"] == "https://signed-upload.example/upload"


def test_generate_presigned_download_url_sync(mock_s3_client, r2_service):
    mock_s3_client.generate_presigned_url.return_value = "https://signed-download.example/download"

    result = r2_service._generate_presigned_download_url_sync(
        key="resumes/user-1/resume-1/original/resume.pdf",
    )

    mock_s3_client.generate_presigned_url.assert_called_once_with(
        ClientMethod="get_object",
        Params={
            "Bucket": "studyforge-resumes",
            "Key": "resumes/user-1/resume-1/original/resume.pdf",
        },
        ExpiresIn=3600,
    )
    assert result["method"] == "GET"
    assert result["url"] == "https://signed-download.example/download"


def test_object_exists_sync_true(mock_s3_client, r2_service):
    assert r2_service._object_exists_sync("resumes/user-1/resume-1/original/resume.pdf") is True
    mock_s3_client.head_object.assert_called_once()


def test_object_exists_sync_false(mock_s3_client, r2_service):
    mock_s3_client.head_object.side_effect = ClientError(
        {"Error": {"Code": "404", "Message": "Not Found"}},
        "HeadObject",
    )

    assert r2_service._object_exists_sync("missing.pdf") is False


def test_get_object_metadata_sync(mock_s3_client, r2_service):
    from datetime import datetime, timezone

    mock_s3_client.head_object.return_value = {
        "ContentType": "application/pdf",
        "ContentLength": 1024,
        "ETag": '"etag-value"',
        "LastModified": datetime(2026, 8, 9, 12, 0, 0, tzinfo=timezone.utc),
        "Metadata": {"user_id": "user-1"},
    }

    result = r2_service._get_object_metadata_sync("resumes/user-1/resume-1/original/resume.pdf")

    assert result["content_type"] == "application/pdf"
    assert result["content_length"] == 1024
    assert result["metadata"] == {"user_id": "user-1"}


def test_get_object_metadata_sync_not_found(mock_s3_client, r2_service):
    mock_s3_client.head_object.side_effect = ClientError(
        {"Error": {"Code": "NoSuchKey", "Message": "Not Found"}},
        "HeadObject",
    )

    with pytest.raises(StudyForgeException) as exc:
        r2_service._get_object_metadata_sync("missing.pdf")

    assert exc.value.code == "R2_OBJECT_NOT_FOUND"


@pytest.mark.asyncio
async def test_async_upload_object(r2_service, mock_s3_client):
    mock_s3_client.put_object.return_value = {"ETag": '"abc123"'}

    result = await r2_service.upload_object(
        key="resumes/user-1/resume-1/original/resume.pdf",
        body=b"%PDF-1.4",
        content_type="application/pdf",
    )

    assert result["etag"] == '"abc123"'
