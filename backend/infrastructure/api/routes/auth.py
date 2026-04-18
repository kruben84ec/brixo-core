from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, EmailStr

from infrastructure.env.settings import get_settings
from infrastructure.security.jwt_service import JWTService
from application.services.auth.login_user import LoginUser
from adapters.repositories.auth_repository_sql import AuthRepositorySQL
from application.event_bus import EventBus

settings = get_settings()
auth_repository = AuthRepositorySQL()

_jwt_service = JWTService(
    private_key=settings.jwt.private_key,
    public_key=settings.jwt.public_key,
    ttl_minutes=settings.jwt.access_token_exp_minutes,
)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


def get_auth_router(event_bus: EventBus) -> APIRouter:
    router = APIRouter()
    login_user_uc = LoginUser(auth_repository, event_bus)

    @router.post("/login", response_model=TokenResponse)
    async def login(payload: LoginRequest):
        try:
            user = login_user_uc.execute(payload.email, payload.password)
            token = _jwt_service.generate(
                user_id=str(user.id),
                tenant_id=str(user.tenant_id),
            )
            return TokenResponse(access_token=token)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas",
            )

    @router.post("/refresh", response_model=TokenResponse)
    async def refresh(request: Request):
        # El middleware ya validó el token y pobló request.state
        token = _jwt_service.generate(
            user_id=request.state.user_id,
            tenant_id=request.state.tenant_id,
        )
        return TokenResponse(access_token=token)

    return router
