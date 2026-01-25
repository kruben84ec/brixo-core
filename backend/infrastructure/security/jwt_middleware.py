from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from uuid import UUID
from datetime import datetime, timezone

from backend.infrastructure.security.jwt_service import JWTService
from backend.application.event_bus import EventBus
from backend.domain.events.auth import UserAuthenticated
from backend.infrastructure.env.settings import get_settings
from backend.infrastructure.logging import get_logger

logger = get_logger()
security = HTTPBearer()
settings = get_settings()


class JWTAuthMiddleware:
    def __init__(self, event_bus: EventBus):
        self.jwt_service = JWTService(
            secret=settings.jwt.private_key,
            ttl_minutes=settings.jwt.access_token_exp_minutes,
        )
        self.event_bus = event_bus

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials | None = await security(request)

        if credentials is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization token missing",
            )

        try:
            payload = self.jwt_service.decode(credentials.credentials)

            user_id = UUID(payload["sub"])
            tenant_id = UUID(payload["tenant"])

            # 🔥 Evento de dominio
            self.event_bus.publish(
                UserAuthenticated(
                    tenant_id=tenant_id,
                    user_id=user_id,
                    occurred_at=datetime.now(timezone.utc),
                )
            )

            # Contexto para handlers / endpoints
            request.state.user_id = user_id
            request.state.tenant_id = tenant_id

        except Exception as exc:
            logger.warning(
                "JWT authentication failed",
                extra={"error": str(exc)},
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
