from db_wait import wait_for_db
from fastapi import FastAPI
from infrastructure.security.jwt_middleware import JWTAuthMiddleware
from infrastructure.api.routes.auth import get_auth_router
from application.event_bus import EventBus
from application.handlers import register_handlers

# Levantar FastAPI
app = FastAPI(title="Brixo Core API", version="0.0.1")

def init_app():
    """Inicializa la aplicación con EventBus y routers"""
    wait_for_db()
    
    # Inicializar Event Bus
    event_bus = EventBus()
    register_handlers(event_bus)
    
    # Agregar middleware con event_bus inyectado
    app.add_middleware(JWTAuthMiddleware, event_bus=event_bus)
    
    # Incluir routers (inyectar event_bus)
    auth_router = get_auth_router(event_bus)
    app.include_router(auth_router, prefix="/auth", tags=["auth"])

# Inicializar al importar el módulo (para Uvicorn)
init_app()