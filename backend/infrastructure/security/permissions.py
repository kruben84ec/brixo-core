import json

from fastapi import Depends, HTTPException, Request, status

from infrastructure.redis_client import get_redis


def require_permission(code: str):
    async def _check(request: Request):
        user_id: str = request.state.user_id
        tenant_id: str = request.state.tenant_id
        redis = await get_redis()
        raw = await redis.get(f"user_access:{tenant_id}:{user_id}")
        if not raw:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Sin snapshot de permisos — vuelva a autenticarse",
            )
        snapshot = json.loads(raw)
        if code not in snapshot.get("permissions", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permiso requerido: {code}",
            )

    return Depends(_check)
