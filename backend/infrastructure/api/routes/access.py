import json
from typing import Optional

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel

from infrastructure.redis_client import get_redis
from infrastructure.logging import get_logger

logger = get_logger()

router = APIRouter()


# =========================
# RESPONSE MODEL
# =========================

class AccessSnapshotResponse(BaseModel):
    user_id: str
    tenant_id: str
    roles: list[str]
    permissions: list[str]
    updated_at: str


# =========================
# ENDPOINT
# =========================

@router.get("/me/access", response_model=AccessSnapshotResponse)
async def get_my_access(request: Request):

    # 🔐 Contexto inyectado por JWT middleware
    user_id: Optional[str] = getattr(request.state, "user_id", None)
    tenant_id: Optional[str] = getattr(request.state, "tenant_id", None)

    if not user_id or not tenant_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    redis = await get_redis()

    key = f"user_access:{tenant_id}:{user_id}"

    snapshot_raw = await redis.get(key)

    # =========================
    # FALLBACK CONTROLADO
    # =========================

    if not snapshot_raw:
        logger.warning(
            "User access snapshot missing",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
            },
        )

        # MVP fallback — respuesta mínima segura
        return AccessSnapshotResponse(
            user_id=user_id,
            tenant_id=tenant_id,
            roles=[],
            permissions=[],
            updated_at="snapshot_missing"
        )

    # =========================
    # NORMAL FLOW
    # =========================

    try:
        snapshot = json.loads(snapshot_raw)

        logger.debug(
            "User access snapshot served",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
            },
        )

        return AccessSnapshotResponse(**snapshot)

    except Exception as exc:
        logger.error(
            "Snapshot parse failed",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "error": str(exc),
            },
        )

        raise HTTPException(
            status_code=500,
            detail="Access snapshot corrupted"
        )