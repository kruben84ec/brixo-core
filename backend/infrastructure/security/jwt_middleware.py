from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from uuid import UUID
from datetime import datetime, timezone

from infrastructure.security.jwt_service import JWTService
from application.event_bus import EventBus
from domain.events.auth import UserAuthenticated
from infrastructure.env.settings import get_settings
from infrastructure.logging import get_logger

logger = get_logger()
settings = get_settings()

PUBLIC_PATHS = {
    "/api/auth/login",
    "/api/auth/register",
    "/docs",
    "/redoc",
    "/openapi.json",
    "/health",
}


class JWTAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, event_bus: EventBus):
        super().__init__(app)
        self.jwt_service = JWTService(
            private_key=settings.jwt.private_key,
            public_key=settings.jwt.public_key,
            ttl_minutes=settings.jwt.access_token_exp_minutes,
        )
        self.event_bus = event_bus

    async def dispatch(self, request: Request, call_next):
        if request.url.path in PUBLIC_PATHS:
            return await call_next(request)

        auth_header = request.headers.get("authorization")

        if not auth_header:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization token missing",
            )

        try:
            scheme, credentials = auth_header.split()
            if scheme.lower() != "bearer":
                raise ValueError("Invalid authentication scheme")

            payload = self.jwt_service.decode(credentials)

            user_id = str(UUID(payload["sub"]))
            tenant_id = str(UUID(payload["tenant"]))

            self.event_bus.publish(
                UserAuthenticated(
                    tenant_id=tenant_id,
                    user_id=user_id,
                    occurred_at=datetime.now(timezone.utc),
                )
            )

            request.state.user_id = user_id
            request.state.tenant_id = tenant_id

        except ValueError as e:
            logger.warning("JWT authentication failed", extra={"error": str(e)})
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        return await call_next(request)
