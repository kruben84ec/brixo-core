from backend.infrastructure.redis_client import get_redis
from backend.domain.events import RoleAssigned, RoleRevoked


async def on_role_assigned(event: RoleAssigned):
    redis = await get_redis()
    key = f"user:{event.tenant_id}:{event.user_id}:roles"
    await redis.sadd(key, event.role_code)  # type: ignore


async def on_role_revoked(event: RoleRevoked):
    redis = await get_redis()
    key = f"user:{event.tenant_id}:{event.user_id}:roles"
    await redis.srem(key, event.role_code)  # type: ignore