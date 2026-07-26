from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.core.logging import logger
from app.models.user import User, RefreshToken, EmailOTP
from app.models.practice import Topic, Question, PracticeSession, Attempt, MasteryProfile, InterviewSession, LearningResource
from app.models.feedback import Feedback, UserRoadmap

# Monkeypatch for Beanie 2.1.0 + PyMongo 4.x compatibility
if not hasattr(AsyncIOMotorClient, "append_metadata"):
    setattr(AsyncIOMotorClient, "append_metadata", lambda self, *args, **kwargs: None)

db_client: AsyncIOMotorClient = None

async def init_db():
    global db_client
    logger.info(f"Connecting to MongoDB at: {settings.MONGODB_URI}")
    try:
        db_client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=3000)
        await init_beanie(
            database=db_client[settings.MONGODB_DATABASE],
            document_models=[
                User,
                RefreshToken,
                EmailOTP,
                Topic,
                Question,
                PracticeSession,
                Attempt,
                MasteryProfile,
                InterviewSession,
                LearningResource,
                Feedback,
                UserRoadmap,
            ],
        )
        logger.info("Beanie initialized successfully with all document models.")
    except Exception as e:
        logger.error(f"MongoDB initialization failed: {e}. Check MONGODB_URI configuration.")
        raise e

async def close_db():
    global db_client
    if db_client:
        db_client.close()
        logger.info("MongoDB connection closed.")
