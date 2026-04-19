from infrastructure.redis_client import get_redis
from domain.events.base import RoleAssigned, RoleRevoked
from infrastructure.logging import get_logger


logger = get_logger()


async def on_role_assigned(event: RoleAssigned):
    redis = await get_redis()
    key = f"user:{event.tenant_id}:{event.user_id}:roles"
    logger.info("Assigning role",
                extra={"user_id": event.user_id, "role_code": event.role_code})
    
    await redis.sadd(key, event.role_code)  # type: ignore


async def on_role_revoked(event: RoleRevoked):
    redis = await get_redis()
    key = f"user:{event.tenant_id}:{event.user_id}:roles"
    await redis.srem(key, event.role_code)  # type: ignore