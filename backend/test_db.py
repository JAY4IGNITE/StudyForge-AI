import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def run_test():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DATABASE]
    try:
        db()
    except Exception as e:
        print("CALLING DB:", type(e), str(e))
    
    try:
        db.append_metadata()
    except Exception as e:
        print("APPEND_METADATA:", type(e), str(e))

asyncio.run(run_test())
