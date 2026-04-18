from db_wait import wait_for_db
from fastapi import FastAPI
from infrastructure.security.jwt_middleware import JWTAuthMiddleware
from infrastructure.api.routes.auth import get_auth_router
from application.event_bus import EventBus
from application.handlers import register_handlers
from infrastructure.projections.user_access_projection import UserAccessProjection
from infrastructure.persistence.access_repository_impl import AccessRepositoryImpl
from application.services.acccess.access_service import AccessService

from infrastructure.api.routes.access import router as access_router

access_repository = AccessRepositoryImpl()
access_service = AccessService(access_repository)


# Levantar FastAPI
app = FastAPI(title="Brixo Core API", version="0.0.1")

def init_app():
    """Inicializa la aplicación con EventBus y routers"""
    wait_for_db()
    
    # Inicializar Event Bus
    event_bus = EventBus()
    register_handlers(event_bus)
    
    user_access_projection = UserAccessProjection(event_bus, access_service)
    user_access_projection.register()
    
    # Agregar middleware con event_bus inyectado
    app.add_middleware(JWTAuthMiddleware, event_bus=event_bus)
    
    # Incluir routers (inyectar event_bus)
    auth_router = get_auth_router(event_bus)
    app.include_router(auth_router, prefix="/auth", tags=["auth"])
    app.include_router(access_router, tags=["access"])


# Inicializar al importar el módulo (para Uvicorn)
init_app()