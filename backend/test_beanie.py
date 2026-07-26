import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User

if not hasattr(AsyncIOMotorClient, "append_metadata"):
    setattr(AsyncIOMotorClient, "append_metadata", lambda self, *args, **kwargs: None)

async def test():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DATABASE]
    await init_beanie(database=db, document_models=[User])
    print("SUCCESS")

asyncio.run(test())
