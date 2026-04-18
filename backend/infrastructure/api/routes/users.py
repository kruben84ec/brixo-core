from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field

from adapters.repositories.user_repository_sql import UserRepositorySQL
from application.event_bus import EventBus
from application.use_cases.create_user import CreateUserCommand, CreateUserUseCase

VALID_AUTHORITY_LEVELS = {"OWNER", "ADMIN", "MANAGER", "OPERATOR"}


# ─── DTOs ────────────────────────────────────────────────────────────────────

class CreateUserRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    authority_level: str = Field(default="OPERATOR")


class UserResponse(BaseModel):
    id: str
    tenant_id: str
    username: str
    email: str
    authority_level: str
    is_active: bool


# ─── Factory ─────────────────────────────────────────────────────────────────

def create_user_router(event_bus: EventBus) -> APIRouter:
    router = APIRouter(prefix="/users", tags=["users"])

    user_repo = UserRepositorySQL()
    create_user_uc = CreateUserUseCase(user_repo, event_bus)

    @router.get("/", response_model=list[UserResponse])
    async def list_users(request: Request):
        tenant_id: str = request.state.tenant_id
        users = user_repo.list_users_by_tenant(tenant_id)
        return [
            UserResponse(
                id=u.id,
                tenant_id=u.tenant_id,
                username=u.username,
                email=u.email,
                authority_level=u.authority_level,
                is_active=u.is_active,
            )
            for u in users
        ]

    @router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
    async def create_user(payload: CreateUserRequest, request: Request):
        tenant_id: str = request.state.tenant_id
        try:
            user = create_user_uc.execute(
                CreateUserCommand(
                    tenant_id=tenant_id,
                    username=payload.username,
                    email=str(payload.email),
                    password=payload.password,
                    authority_level=payload.authority_level,
                )
            )
            return UserResponse(
                id=user.id,
                tenant_id=user.tenant_id,
                username=user.username,
                email=user.email,
                authority_level=user.authority_level,
                is_active=user.is_active,
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
            )

    return router
