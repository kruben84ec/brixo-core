import os
from contextlib import asynccontextmanager

from db_wait import wait_for_db
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from infrastructure.database import close_connection_pool, initialize_connection_pool
from infrastructure.security.jwt_middleware import JWTAuthMiddleware
from infrastructure.api.middleware.http_logging import HTTPLoggingMiddleware
from infrastructure.api.exception_handlers import (
    brixo_exception_handler,
    http_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)
from infrastructure.api.routes.auth import get_auth_router
from infrastructure.api.routes.products import create_product_router
from infrastructure.api.routes.users import create_user_router
from infrastructure.api.routes.audit import create_audit_router
from application.event_bus import EventBus
from application.handlers import register_handlers
from infrastructure.projections.user_access_projection import UserAccessProjection
from adapters.repositories.access_repository_sql import AccessRepositorySQL
from adapters.repositories.audit_log_repository_sql import AuditLogRepositorySQL
from adapters.repositories.role_repository_sql import RoleRepositorySQL
from adapters.repositories.user_repository_sql import UserRepositorySQL
from application.services.access.access_service import AccessService
from domain.exceptions import BrixoException

from infrastructure.api.routes.access import router as access_router
from infrastructure.api.routes.health import router as health_router


access_repository = AccessRepositorySQL()
access_service = AccessService(access_repository)

audit_log_repository = AuditLogRepositorySQL()
user_repository = UserRepositorySQL()
role_repository = RoleRepositorySQL()


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_connection_pool()
    yield
    close_connection_pool()


app = FastAPI(
    title="Brixo API",
    version="1.0.0-mvp",
    lifespan=lifespan,
)

# ── Exception handlers ────────────────────────────────────────────────────────
app.add_exception_handler(BrixoException, brixo_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)


def init_app():
    wait_for_db()

    event_bus = EventBus()
    register_handlers(event_bus, audit_log_repository)

    user_access_projection = UserAccessProjection(event_bus, access_service)
    user_access_projection.register()

    # ──────────────────────────────────────────
    # CORS CONFIG (dinámico desde ENV)
    # ──────────────────────────────────────────
    cors_origins = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000"
    ).split(",")

    # ── Middlewares (orden crítico) ──
    # CORS debe ser el más externo
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(HTTPLoggingMiddleware)

    # ⚠️ IMPORTANTE: tu middleware JWT debe ignorar OPTIONS
    app.add_middleware(JWTAuthMiddleware, event_bus=event_bus)

    # ──────────────────────────────────────────
    # ROUTES
    # ──────────────────────────────────────────
    app.include_router(health_router)

    auth_router = get_auth_router(event_bus)
    app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
    app.include_router(access_router, tags=["access"])
    app.include_router(create_product_router(event_bus), prefix="/api")
    app.include_router(create_user_router(event_bus), prefix="/api")
    app.include_router(create_audit_router(), prefix="/api")


init_app()