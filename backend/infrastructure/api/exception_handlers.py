"""
Capa de manejo de excepciones global para Brixo.

Dos responsabilidades separadas:
  1. Respuesta al frontend  — JSON consistente, nunca expone detalles internos.
  2. Log técnico            — stack trace y contexto completo para observabilidad.

Registro en main.py (orden de precedencia FastAPI: más específico primero):
    BrixoException          → brixo_exception_handler
    RequestValidationError  → validation_exception_handler
    HTTPException           → http_exception_handler
    Exception               → unhandled_exception_handler  (catch-all)
"""

import traceback

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from domain.exceptions import BrixoException
from infrastructure.logging import get_logger

logger = get_logger()


async def brixo_exception_handler(request: Request, exc: BrixoException) -> JSONResponse:
    """
    Excepciones de dominio lanzadas explícitamente desde use cases o servicios.
    El 'detail' técnico va al log; solo 'message' llega al cliente.
    """
    logger.error(
        exc.detail or exc.message,
        extra={
            "error_code": exc.error_code,
            "path": str(request.url.path),
            "method": request.method,
            "user_id": getattr(request.state, "user_id", None),
            "tenant_id": getattr(request.state, "tenant_id", None),
        },
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.error_code, "message": exc.message},
    )


async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """
    HTTPException lanzadas directamente en endpoints (404, 403, 401…).
    Se loguean como WARNING porque son errores esperados del protocolo.
    """
    logger.warning(
        "http_exception",
        extra={
            "status_code": exc.status_code,
            "detail": str(exc.detail),
            "path": str(request.url.path),
            "method": request.method,
            "user_id": getattr(request.state, "user_id", None),
            "tenant_id": getattr(request.state, "tenant_id", None),
        },
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "HTTP_ERROR", "message": str(exc.detail)},
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """
    Errores de validación Pydantic (body/query/path mal formados).
    Devuelve al cliente qué campos fallaron y por qué, sin stack trace.
    """
    errors = exc.errors()
    logger.warning(
        "validation_error",
        extra={
            "path": str(request.url.path),
            "method": request.method,
            "validation_errors": errors,
        },
    )
    return JSONResponse(
        status_code=422,
        content={
            "error": "VALIDATION_ERROR",
            "message": "Los datos enviados no son válidos.",
            "fields": [
                {
                    "field": ".".join(str(loc) for loc in e["loc"]),
                    "issue": e["msg"],
                }
                for e in errors
            ],
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all para cualquier excepción no prevista.
    Stack trace completo va al log técnico; al cliente solo llega un 500 genérico.
    """
    logger.error(
        "unhandled_exception",
        extra={
            "exception_type": type(exc).__name__,
            "traceback": traceback.format_exc(),
            "path": str(request.url.path),
            "method": request.method,
            "user_id": getattr(request.state, "user_id", None),
            "tenant_id": getattr(request.state, "tenant_id", None),
        },
    )
    return JSONResponse(
        status_code=500,
        content={
            "error": "INTERNAL_ERROR",
            "message": "Ocurrió un error interno. Por favor intente más tarde.",
        },
    )
