from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field

from infrastructure.env.settings import get_settings
from infrastructure.security.jwt_service import JWTService
from application.services.auth.login_user import LoginUser
from application.use_cases.signup import SignUpCommand, SignUpUseCase
from adapters.repositories.auth_repository_sql import AuthRepositorySQL
from adapters.repositories.tenant_repository_sql import TenantRepositorySQL
from adapters.repositories.user_repository_sql import UserRepositorySQL
from application.event_bus import EventBus

settings = get_settings()
auth_repository = AuthRepositorySQL()
_tenant_repository = TenantRepositorySQL()
_user_repository = UserRepositorySQL()

_jwt_service = JWTService(
    private_key=settings.jwt.private_key,
    public_key=settings.jwt.public_key,
    ttl_minutes=settings.jwt.access_token_exp_minutes,
)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=255, description="Nombre de tu empresa u organización")
    username: str = Field(..., min_length=1, max_length=100, description="Tu nombre o alias")
    email: EmailStr
    password: str = Field(..., min_length=8)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegisterResponse(BaseModel):
    user_id: str
    tenant_id: str
    username: str
    email: str
    authority_level: str
    access_token: str
    token_type: str = "bearer"


def get_auth_router(event_bus: EventBus) -> APIRouter:
    router = APIRouter()
    login_user_uc = LoginUser(auth_repository, event_bus)
    signup_uc = SignUpUseCase(_tenant_repository, _user_repository, event_bus)

    @router.post("/login", response_model=TokenResponse)
    async def login(payload: LoginRequest):
        user = login_user_uc.execute(payload.email, payload.password)
        token = _jwt_service.generate(
            user_id=str(user.id),
            tenant_id=str(user.tenant_id),
        )
        return TokenResponse(access_token=token)

    @router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
    async def register(payload: RegisterRequest):
        try:
            result = signup_uc.execute(
                SignUpCommand(
                    company_name=payload.company_name,
                    username=payload.username,
                    email=str(payload.email),
                    password=payload.password,
                )
            )
            token = _jwt_service.generate(
                user_id=result.user_id,
                tenant_id=result.tenant_id,
            )
            return RegisterResponse(
                user_id=result.user_id,
                tenant_id=result.tenant_id,
                username=result.username,
                email=result.email,
                authority_level=result.authority_level,
                access_token=token,
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(e),
            )

    @router.post("/refresh", response_model=TokenResponse)
    async def refresh(request: Request):
        token = _jwt_service.generate(
            user_id=request.state.user_id,
            tenant_id=request.state.tenant_id,
        )
        return TokenResponse(access_token=token)

    return router
