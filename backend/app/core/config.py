from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

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

    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    BREVO_API_KEY: Optional[str] = None
    BREVO_SENDER_EMAIL: str = "no-reply@studyforge.ai"
    BREVO_SENDER_NAME: str = "StudyForge AI"

    OMNIROUTE_BASE_URL: Optional[str] = None
    OMNIROUTE_API_KEY: Optional[str] = None
    OMNIROUTE_DEFAULT_MODEL: str = "claude-3-5-sonnet"
    OMNIROUTE_FALLBACK_MODELS: List[str] = ["gemini-1.5-pro", "llama-3-70b-instruct"]

    AI_MAX_RETRIES: int = 2
    AI_REQUEST_TIMEOUT_SECONDS: int = 30
    AI_MAX_DAILY_REQUESTS_PER_USER: int = 100

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
