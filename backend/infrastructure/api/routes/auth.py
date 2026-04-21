from fastapi import APIRouter, HTTPException, Request, Response, status
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

# Access token: corta duración (15 min)
_access_token_service = JWTService(
    private_key=settings.jwt.private_key,
    public_key=settings.jwt.public_key,
    ttl_minutes=settings.jwt.access_token_exp_minutes,
)

# Refresh token: larga duración (7 días = 10080 min)
_refresh_token_service = JWTService(
    private_key=settings.jwt.private_key,
    public_key=settings.jwt.public_key,
    ttl_minutes=7 * 24 * 60,  # 7 días en minutos
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


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict  # { id, name, email, tenant_id }


class RegisterResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict  # { id, name, email, tenant_id }


def get_auth_router(event_bus: EventBus) -> APIRouter:
    router = APIRouter()
    login_user_uc = LoginUser(auth_repository, event_bus)
    signup_uc = SignUpUseCase(_tenant_repository, _user_repository, event_bus)

    def _set_refresh_cookie(response: Response, user_id: str, tenant_id: str):
        """Helper: genera refresh token y lo setea en cookie HttpOnly"""
        refresh_token = _refresh_token_service.generate(
            user_id=user_id,
            tenant_id=tenant_id,
        )
        response.set_cookie(
            key="refreshToken",
            value=refresh_token,
            max_age=7 * 24 * 60 * 60,  # 7 días
            secure=False,  # En prod: True (HTTPS)
            httponly=True,  # JavaScript NO puede leer
            samesite="lax",  # CSRF protection
            path="/api",  # Solo se envía a /api/*
        )

    @router.post("/login", response_model=LoginResponse)
    async def login(payload: LoginRequest):
        user = login_user_uc.execute(payload.email, payload.password)
        access_token = _access_token_service.generate(
            user_id=str(user.id),
            tenant_id=str(user.tenant_id),
        )
        response = LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "tenant_id": str(user.tenant_id),
            }
        )
        # Convertir a JSONResponse para setear cookie
        from fastapi.responses import JSONResponse
        json_response = JSONResponse(content=response.model_dump())
        _set_refresh_cookie(json_response, str(user.id), str(user.tenant_id))
        return json_response

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
            access_token = _access_token_service.generate(
                user_id=result.user_id,
                tenant_id=result.tenant_id,
            )
            response = RegisterResponse(
                access_token=access_token,
                token_type="bearer",
                user={
                    "id": result.user_id,
                    "name": result.username,
                    "email": result.email,
                    "tenant_id": result.tenant_id,
                }
            )
            # Convertir a JSONResponse para setear cookie
            from fastapi.responses import JSONResponse
            json_response = JSONResponse(content=response.model_dump(), status_code=status.HTTP_201_CREATED)
            _set_refresh_cookie(json_response, result.user_id, result.tenant_id)
            return json_response
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(e),
            )

    @router.post("/refresh", response_model=TokenResponse)
    async def refresh(request: Request):
        """Genera nuevo access token usando refresh token de cookie HttpOnly"""
        refresh_token = request.cookies.get("refreshToken")
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No refresh token found",
            )
        
        try:
            # Valida el refresh token
            decoded = _refresh_token_service.decode(refresh_token)
            user_id = decoded.get("sub")
            tenant_id = decoded.get("tenant")
            
            # Genera nuevo access token
            new_access_token = _access_token_service.generate(
                user_id=user_id,
                tenant_id=tenant_id,
            )
            return TokenResponse(access_token=new_access_token)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=str(e),
            )

    @router.post("/logout")
    async def logout():
        """Logout: elimina la cookie de refresh token"""
        response = Response(status_code=status.HTTP_200_OK)
        response.delete_cookie(
            key="refreshToken",
            path="/api",
            secure=False,  # En prod: True (HTTPS)
            httponly=True,
            samesite="lax",
        )
        return response

    return router
