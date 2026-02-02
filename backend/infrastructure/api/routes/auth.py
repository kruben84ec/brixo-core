from fastapi import APIRouter, HTTPException
from infrastructure.env.settings import get_settings
from infrastructure.security.jwt_service import JWTService
from application.services.auth.login_user import LoginUser
from infrastructure.persistence.auth_repository_sql import AuthRepositorySQL
from application.event_bus import EventBus

settings = get_settings()
auth_repository = AuthRepositorySQL()

def get_auth_router(event_bus: EventBus) -> APIRouter:
    """Retorna el router de autenticación con el event_bus inyectado"""
    router = APIRouter()
    login_user_uc = LoginUser(auth_repository, event_bus)

    @router.post("/login")
    async def login(payload: dict):
        try:
            user = login_user_uc.execute(
                payload["email"],
                payload["password"]
            )

            jwt_service = JWTService(
                secret=settings.jwt.private_key,
                ttl_minutes=settings.jwt.access_token_exp_minutes
            )

            token = jwt_service.generate(
                user_id=str(user.id),
                tenant_id=str(user.tenant_id)
            )

            return {"access_token": token}

        except ValueError:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return router
