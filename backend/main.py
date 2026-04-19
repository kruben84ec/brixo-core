from contextlib import asynccontextmanager

from db_wait import wait_for_db
from fastapi import FastAPI
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
from application.services.acccess.access_service import AccessService
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
    description=(
        "API REST para el sistema de control de inventario Brixo.\n\n"
        "**Autenticación**: Bearer JWT (RS256). Usa `POST /api/auth/login` para obtener el token "
        "y pégalo en el botón **Authorize** de esta UI.\n\n"
        "**Multi-tenant**: cada request se opera dentro del tenant del usuario autenticado."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "auth",      "description": "Login y renovación de token"},
        {"name": "products",  "description": "Gestión de productos e inventario"},
        {"name": "users",     "description": "Gestión de usuarios y asignación de roles"},
        {"name": "audit",     "description": "Historial de auditoría por tenant"},
        {"name": "access",    "description": "Snapshot de permisos del usuario autenticado"},
        {"name": "health",    "description": "Estado del servicio"},
    ],
    lifespan=lifespan,
)

# ── Exception handlers ────────────────────────────────────────────────────────
# Orden de precedencia: FastAPI elige el handler cuyo tipo sea el más específico.
# BrixoException y RequestValidationError son más específicos que Exception.
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

    # ── Middlewares (add_middleware es LIFO: el último añadido es el más externo) ──
    # Orden de ejecución en request: CORS → HTTPLogging → JWT → Handler
    app.add_middleware(JWTAuthMiddleware, event_bus=event_bus)   # ③ innermost
    app.add_middleware(HTTPLoggingMiddleware)                     # ② capta todos los requests (incl. 401)
    app.add_middleware(                                           # ① outermost — preflight CORS
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)

    auth_router = get_auth_router(event_bus)
    app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
    app.include_router(access_router, tags=["access"])
    app.include_router(create_product_router(event_bus), prefix="/api")
    app.include_router(create_user_router(event_bus), prefix="/api")
    app.include_router(create_audit_router(), prefix="/api")


init_app()
