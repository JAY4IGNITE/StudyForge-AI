import redis.asyncio as redis
import json
from typing import Any, Optional
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Create a global Redis connection pool
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

async def set_cache(key: str, value: Any, expire: int = 3600):
    """Set a value in the Redis cache with an expiration time in seconds."""
    try:
        await redis_client.set(key, json.dumps(value), ex=expire)
    except Exception as e:
        print(f"Redis set error: {e}")

async def get_cache(key: str) -> Optional[Any]:
    """Retrieve a value from the Redis cache."""
    try:
        data = await redis_client.get(key)
        if data:
            return json.loads(data)
    except Exception as e:
        print(f"Redis get error: {e}")
    return None

async def delete_cache(key: str):
    """Delete a key from the Redis cache."""
    try:
        await redis_client.delete(key)
    except Exception as e:
        print(f"Redis delete error: {e}")

async def close_redis():
    """Close the Redis connection."""
    await redis_client.close()
