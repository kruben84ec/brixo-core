

import json
from datetime import datetime, timezone

from infrastructure.redis_client import get_redis
from infrastructure.logging import get_logger
from application.services.acccess.access_service import AccessService
from domain.events.auth import UserAuthenticated
from application.event_bus import EventBus

logger = get_logger()



class UserAccessProjection:
    """
    Mantiene snapshot de acceso rápido por usuario.
    """

    def __init__(self, event_bus: EventBus, access_service: AccessService):
        self.event_bus = event_bus
        self.access_service = access_service

    # ========================
    # REGISTRO EN EVENT BUS
    # ========================

    def register(self):
        self.event_bus.subscribe(UserAuthenticated, self.on_user_authenticated)

    # ========================
    # HANDLERS
    # ========================

    async def on_user_authenticated(self, event: UserAuthenticated):
        redis = await get_redis()

        key = f"user_access:{event.tenant_id}:{event.user_id}"
        
        access = await self.access_service.get_user_access(str(event.user_id), str(event.tenant_id))
        

        snapshot = {
            "user_id": str(event.user_id),
            "tenant_id": str(event.tenant_id),
            "roles": access["roles"],
            "permissions": access["permissions"],
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

        await redis.set(key, json.dumps(snapshot))

        logger.info(
            "User access snapshot created",
            extra={
                "tenant_id": str(event.tenant_id),
                "user_id": str(event.user_id),
            },
        )