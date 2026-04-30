from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field

from adapters.repositories.role_repository_sql import RoleRepositorySQL
from adapters.repositories.user_repository_sql import UserRepositorySQL
from application.event_bus import EventBus
from application.use_cases.assign_role_to_user import AssignRoleCommand, AssignRoleToUserUseCase
from application.use_cases.create_user import CreateUserCommand, CreateUserUseCase
from infrastructure.security.permissions import require_permission

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


class AssignRoleRequest(BaseModel):
    role_id: str = Field(..., description="UUID del rol a asignar")


class AssignRoleResponse(BaseModel):
    id: str
    user_id: str
    role_id: str
    assigned_by: str | None
    assigned_at: str


# ─── Factory ─────────────────────────────────────────────────────────────────

def create_user_router(event_bus: EventBus) -> APIRouter:
    router = APIRouter(prefix="/users", tags=["users"])

    user_repo = UserRepositorySQL()
    role_repo = RoleRepositorySQL()
    create_user_uc = CreateUserUseCase(user_repo, event_bus)
    assign_role_uc = AssignRoleToUserUseCase(user_repo, role_repo, event_bus)

    @router.get("/me", response_model=UserResponse)
    async def get_me(request: Request):
        user_id: str = request.state.user_id
        user = user_repo.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return UserResponse(
            id=user.id,
            tenant_id=user.tenant_id,
            username=user.username,
            email=user.email,
            authority_level=user.authority_level,
            is_active=user.is_active,
        )

    @router.get("/", response_model=list[UserResponse], dependencies=[require_permission("USERS_READ")])
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

    @router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED, dependencies=[require_permission("USERS_WRITE")])
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

    @router.post("/{user_id}/roles", response_model=AssignRoleResponse, status_code=status.HTTP_201_CREATED, dependencies=[require_permission("ROLES_WRITE")])
    async def assign_role(user_id: str, payload: AssignRoleRequest, request: Request):
        tenant_id: str = request.state.tenant_id
        actor_user_id: str = request.state.user_id
        try:
            user_role = assign_role_uc.execute(
                AssignRoleCommand(
                    tenant_id=tenant_id,
                    user_id=user_id,
                    role_id=payload.role_id,
                    assigned_by_user_id=actor_user_id,
                )
            )
            return AssignRoleResponse(
                id=user_role.id,
                user_id=user_role.user_id,
                role_id=user_role.role_id,
                assigned_by=user_role.assigned_by,
                assigned_at=str(user_role.assigned_at),
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
            )

    return router
