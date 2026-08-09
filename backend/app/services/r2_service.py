import asyncio
from datetime import datetime, timezone
from typing import Any, BinaryIO, Optional, Union

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

from app.core.config import settings
from app.core.errors import StudyForgeException
from app.core.logging import logger

BytesLike = Union[bytes, bytearray, memoryview]


class R2Service:
    """Cloudflare R2 storage via the S3-compatible API (private bucket)."""

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def is_configured(self) -> bool:
        return all(
            [
                settings.R2_ACCOUNT_ID,
                settings.R2_ACCESS_KEY_ID,
                settings.R2_SECRET_ACCESS_KEY,
                settings.R2_BUCKET_NAME,
                settings.R2_ENDPOINT,
            ]
        )

    def _require_client(self):
        if not self.is_configured:
            raise StudyForgeException(
                code="R2_NOT_CONFIGURED",
                message="Cloudflare R2 storage is not configured.",
                status_code=503,
            )

        if self._client is None:
            self._client = boto3.client(
                "s3",
                endpoint_url=settings.R2_ENDPOINT,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                region_name="auto",
                config=Config(signature_version="s3v4"),
            )
            logger.info("Cloudflare R2 client initialized.")

        return self._client

    def _handle_client_error(self, exc: ClientError, key: str, action: str) -> None:
        error_code = exc.response.get("Error", {}).get("Code", "Unknown")
        logger.error(f"R2 {action} failed for key '{key}': {error_code}")
        raise StudyForgeException(
            code="R2_OPERATION_FAILED",
            message=f"R2 {action} failed.",
            status_code=502,
            details={"key": key, "error_code": error_code},
        ) from exc

    def _upload_object_sync(
        self,
        key: str,
        body: Union[BytesLike, BinaryIO],
        content_type: Optional[str] = None,
        metadata: Optional[dict[str, str]] = None,
    ) -> dict[str, Any]:
        client = self._require_client()
        params: dict[str, Any] = {
            "Bucket": settings.R2_BUCKET_NAME,
            "Key": key,
            "Body": body,
        }
        if content_type:
            params["ContentType"] = content_type
        if metadata:
            params["Metadata"] = metadata

        try:
            response = client.put_object(**params)
            return {
                "key": key,
                "bucket": settings.R2_BUCKET_NAME,
                "etag": response.get("ETag"),
            }
        except ClientError as exc:
            self._handle_client_error(exc, key, "upload")

    def _delete_object_sync(self, key: str) -> dict[str, str]:
        client = self._require_client()
        try:
            client.delete_object(Bucket=settings.R2_BUCKET_NAME, Key=key)
            return {"key": key, "deleted": True}
        except ClientError as exc:
            self._handle_client_error(exc, key, "delete")

    def _generate_presigned_upload_url_sync(
        self,
        key: str,
        content_type: Optional[str] = None,
        expires_in: Optional[int] = None,
    ) -> dict[str, Any]:
        client = self._require_client()
        expiry = expires_in or settings.R2_PRESIGNED_URL_EXPIRY_SECONDS
        params: dict[str, Any] = {
            "Bucket": settings.R2_BUCKET_NAME,
            "Key": key,
        }
        if content_type:
            params["ContentType"] = content_type

        try:
            url = client.generate_presigned_url(
                ClientMethod="put_object",
                Params=params,
                ExpiresIn=expiry,
            )
            return {
                "key": key,
                "url": url,
                "method": "PUT",
                "expires_in": expiry,
                "content_type": content_type,
            }
        except ClientError as exc:
            self._handle_client_error(exc, key, "presigned upload URL generation")

    def _generate_presigned_download_url_sync(
        self,
        key: str,
        expires_in: Optional[int] = None,
    ) -> dict[str, Any]:
        client = self._require_client()
        expiry = expires_in or settings.R2_PRESIGNED_URL_EXPIRY_SECONDS

        try:
            url = client.generate_presigned_url(
                ClientMethod="get_object",
                Params={
                    "Bucket": settings.R2_BUCKET_NAME,
                    "Key": key,
                },
                ExpiresIn=expiry,
            )
            return {
                "key": key,
                "url": url,
                "method": "GET",
                "expires_in": expiry,
            }
        except ClientError as exc:
            self._handle_client_error(exc, key, "presigned download URL generation")

    def _object_exists_sync(self, key: str) -> bool:
        client = self._require_client()
        try:
            client.head_object(Bucket=settings.R2_BUCKET_NAME, Key=key)
            return True
        except ClientError as exc:
            error_code = exc.response.get("Error", {}).get("Code", "")
            if error_code in {"404", "NoSuchKey", "NotFound"}:
                return False
            self._handle_client_error(exc, key, "existence check")

    def _get_object_metadata_sync(self, key: str) -> dict[str, Any]:
        client = self._require_client()
        try:
            response = client.head_object(Bucket=settings.R2_BUCKET_NAME, Key=key)
            last_modified = response.get("LastModified")
            if isinstance(last_modified, datetime):
                if last_modified.tzinfo is None:
                    last_modified = last_modified.replace(tzinfo=timezone.utc)
            else:
                last_modified = None

            return {
                "key": key,
                "bucket": settings.R2_BUCKET_NAME,
                "content_type": response.get("ContentType"),
                "content_length": response.get("ContentLength"),
                "etag": response.get("ETag"),
                "last_modified": last_modified.isoformat() if last_modified else None,
                "metadata": response.get("Metadata", {}),
            }
        except ClientError as exc:
            error_code = exc.response.get("Error", {}).get("Code", "")
            if error_code in {"404", "NoSuchKey", "NotFound"}:
                raise StudyForgeException(
                    code="R2_OBJECT_NOT_FOUND",
                    message="Object not found in R2.",
                    status_code=404,
                    details={"key": key},
                ) from exc
            self._handle_client_error(exc, key, "metadata retrieval")

    async def upload_object(
        self,
        key: str,
        body: Union[BytesLike, BinaryIO],
        content_type: Optional[str] = None,
        metadata: Optional[dict[str, str]] = None,
    ) -> dict[str, Any]:
        return await asyncio.to_thread(
            self._upload_object_sync,
            key,
            body,
            content_type,
            metadata,
        )

    async def delete_object(self, key: str) -> dict[str, str]:
        return await asyncio.to_thread(self._delete_object_sync, key)

    async def generate_presigned_upload_url(
        self,
        key: str,
        content_type: Optional[str] = None,
        expires_in: Optional[int] = None,
    ) -> dict[str, Any]:
        return await asyncio.to_thread(
            self._generate_presigned_upload_url_sync,
            key,
            content_type,
            expires_in,
        )

    async def generate_presigned_download_url(
        self,
        key: str,
        expires_in: Optional[int] = None,
    ) -> dict[str, Any]:
        return await asyncio.to_thread(
            self._generate_presigned_download_url_sync,
            key,
            expires_in,
        )

    async def object_exists(self, key: str) -> bool:
        return await asyncio.to_thread(self._object_exists_sync, key)

    async def get_object_metadata(self, key: str) -> dict[str, Any]:
        return await asyncio.to_thread(self._get_object_metadata_sync, key)


r2_service = R2Service()
