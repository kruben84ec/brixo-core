import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from infrastructure.logging import get_logger

logger = get_logger()

_SKIP_PATHS = frozenset({"/health", "/docs", "/redoc", "/openapi.json"})


class HTTPLoggingMiddleware(BaseHTTPMiddleware):
    """
    Registra cada request HTTP en el log técnico.

    Campos emitidos:
        method, path, status_code, duration_ms, user_id, tenant_id

    Posición en el stack (definida en main.py):
        CORS → HTTPLogging → JWT → Handler
    El user_id/tenant_id están disponibles en el log de respuesta porque
    JWTAuthMiddleware los inyecta en request.state antes de llamar al handler,
    y la lectura ocurre DESPUÉS de que call_next() retorna.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        if request.url.path in _SKIP_PATHS:
            return await call_next(request)

        start = time.perf_counter()
        response = await call_next(request)
        duration_ms = round((time.perf_counter() - start) * 1000, 2)

        logger.info(
            "http_request",
            extra={
                "method": request.method,
                "path": str(request.url.path),
                "status_code": response.status_code,
                "duration_ms": duration_ms,
                "user_id": getattr(request.state, "user_id", None),
                "tenant_id": getattr(request.state, "tenant_id", None),
            },
        )
        return response
