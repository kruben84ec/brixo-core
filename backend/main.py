from contextlib import asynccontextmanager

from db_wait import wait_for_db
from fastapi import FastAPI
from infrastructure.database import close_connection_pool, initialize_connection_pool
from infrastructure.security.jwt_middleware import JWTAuthMiddleware
from infrastructure.api.routes.auth import get_auth_router
from infrastructure.api.routes.products import create_product_router
from application.event_bus import EventBus
from application.handlers import register_handlers
from infrastructure.projections.user_access_projection import UserAccessProjection
from adapters.repositories.access_repository_sql import AccessRepositorySQL
from adapters.repositories.audit_log_repository_sql import AuditLogRepositorySQL
from adapters.repositories.role_repository_sql import RoleRepositorySQL
from adapters.repositories.user_repository_sql import UserRepositorySQL
from application.services.acccess.access_service import AccessService

from infrastructure.api.routes.access import router as access_router

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


app = FastAPI(title="Brixo Core API", version="0.0.1", lifespan=lifespan)


def init_app():
    wait_for_db()

    event_bus = EventBus()
    register_handlers(event_bus, audit_log_repository)

    user_access_projection = UserAccessProjection(event_bus, access_service)
    user_access_projection.register()

    app.add_middleware(JWTAuthMiddleware, event_bus=event_bus)

    auth_router = get_auth_router(event_bus)
    app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
    app.include_router(access_router, tags=["access"])
    app.include_router(create_product_router(event_bus), prefix="/api")


init_app()
