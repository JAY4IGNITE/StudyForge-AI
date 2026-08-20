from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional, Union, Any
from pydantic import field_validator


class Settings(BaseSettings):
    APP_NAME: str = "StudyForge AI"
    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"

    DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/studyforge"
    )
    DIRECT_URL: Optional[str] = None

    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    CHROMA_COLLECTION: str = "studyforge-resources"

    # No hardcoded fallback: if these are missing from the environment,
    # Settings() below will raise a ValidationError at startup instead of
    # silently running with a guessable, public secret.
    JWT_ACCESS_SECRET: str
    JWT_REFRESH_SECRET: str
    JWT_ACCESS_TTL_MINUTES: int = 15
    JWT_REFRESH_TTL_DAYS: int = 30

    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_URL: str = "http://localhost:8000"

    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None

    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None

    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json

                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    BREVO_API_KEY: Optional[str] = None
    BREVO_SENDER_EMAIL: str = "aistudyforge@gmail.com"
    BREVO_SENDER_NAME: str = "StudyForge AI"

    OMNIROUTE_BASE_URL: Optional[str] = None
    OMNIROUTE_API_KEY: Optional[str] = None
    OMNIROUTE_DEFAULT_MODEL: str = "claude-3-5-sonnet"
    OMNIROUTE_FALLBACK_MODELS: List[str] = ["gemini-1.5-pro", "llama-3-70b-instruct"]

    NVIDIA_NIM_API_KEY: Optional[str] = None

    R2_ACCOUNT_ID: Optional[str] = None
    R2_ACCESS_KEY_ID: Optional[str] = None
    R2_SECRET_ACCESS_KEY: Optional[str] = None
    R2_BUCKET_NAME: Optional[str] = None
    R2_ENDPOINT: Optional[str] = None
    R2_PRESIGNED_URL_EXPIRY_SECONDS: int = 3600

    AI_MAX_RETRIES: int = 2
    AI_REQUEST_TIMEOUT_SECONDS: int = 12
    AI_MAX_DAILY_REQUESTS_PER_USER: int = 100

    JSEARCH_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=["../.env", ".env"], env_file_encoding="utf-8", extra="ignore"
    )

    @field_validator("JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET")
    @classmethod
    def secrets_must_be_strong(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError(
                "JWT secrets must be at least 32 characters. "
                'Generate one with: python -c "import secrets; print(secrets.token_urlsafe(48))"'
            )
        return v


try:
    settings = Settings()
except Exception as exc:  # pragma: no cover
    raise RuntimeError(
        "Failed to load application settings. Check that JWT_ACCESS_SECRET and "
        f"JWT_REFRESH_SECRET are set in your environment/.env file.\nOriginal error: {exc}"
    ) from exc
