# backend/infrastructure/security/jwt_middleware.py

from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Optional
from backend.infrastructure.env.settings import get_settings
from backend.infrastructure.security.jwt_service import JWTService
from backend.infrastructure.logging import get_logger

settings = get_settings()
SECRET = settings.jwt.private_key

TTL = settings.jwt.access_token_exp_minutes
logger = get_logger()
security = HTTPBearer(auto_error=False)


class JWTAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Rutas públicas (login, health, etc.)
        if request.url.path in ["/auth/login", "/health"]:
            return await call_next(request)

        credentials: Optional[HTTPAuthorizationCredentials] = await security(request)

        if not credentials:
            raise HTTPException(status_code=401, detail="Missing authorization token")

        settings = get_settings()
        jwt_service = JWTService(
            secret=SECRET,
            ttl_minutes=TTL,
        )

        try:
            payload = jwt_service.decode(credentials.credentials)
        except Exception as e:
            logger.warning(
                "Invalid JWT token",
                extra={"error": str(e)},
            )
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        request.state.user_id = payload.get("sub")
        request.state.tenant_id = payload.get("tenant_id")

        if not request.state.user_id or not request.state.tenant_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        logger.debug(
            "Authenticated request",
            extra={
                "user_id": request.state.user_id,
                "tenant_id": request.state.tenant_id,
                "path": request.url.path,
            },
        )

        return await call_next(request)
