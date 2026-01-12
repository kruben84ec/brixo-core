import os
from typing import Optional
from redis.asyncio import Redis, ConnectionPool
from backend.infrastructure.logging import get_logger

logger = get_logger()

_redis: Optional[Redis] = None

async def get_redis() -> Redis:
    global _redis

    if _redis is None:
        redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
        _redis = Redis.from_url(redis_url, decode_responses=True)
        logger.info("Redis client created", extra={"redis_url": redis_url})

    return _redis

async def close_redis() -> None:
    global _redis
    if _redis is not None:
        await _redis.aclose()
        _redis = None
        logger.info("Redis connection closed")