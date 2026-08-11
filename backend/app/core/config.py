from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional, Union, Any
from pydantic import field_validator

class Settings(BaseSettings):
    APP_NAME: str = "StudyForge AI"
    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"

    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DATABASE: str = "studyforge"

    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    CHROMA_COLLECTION: str = "studyforge-resources"

    JWT_ACCESS_SECRET: str = "dev-secret-key-change-in-production-12345"
    JWT_REFRESH_SECRET: str = "dev-refresh-secret-key-change-in-production-67890"
    JWT_ACCESS_TTL_MINUTES: int = 15
    JWT_REFRESH_TTL_DAYS: int = 30

    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_URL: str = "http://localhost:8000"

    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None

    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://localhost:3000"]

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
    BREVO_SENDER_EMAIL: str = "no-reply@studyforge.ai"
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

    model_config = SettingsConfigDict(env_file=["../.env", ".env"], env_file_encoding="utf-8", extra="ignore")

settings = Settings()
