from dataclasses import dataclass
from datetime import datetime, timezone

from application.event_bus import EventBus
from application.ports.role_repository import RoleRepository, UserRoleData
from application.ports.user_repository import UserRepository
from domain.events.base import RoleAssigned


@dataclass(frozen=True)
class AssignRoleCommand:
    tenant_id: str
    user_id: str
    role_id: str
    assigned_by_user_id: str


class AssignRoleToUserUseCase:
    def __init__(
        self,
        user_repo: UserRepository,
        role_repo: RoleRepository,
        event_bus: EventBus,
    ):
        self._user_repo = user_repo
        self._role_repo = role_repo
        self._event_bus = event_bus

    def execute(self, command: AssignRoleCommand) -> UserRoleData:
        user = self._user_repo.get_user_by_id(command.user_id)
        if not user:
            raise ValueError(f"Usuario no encontrado: {command.user_id}")
        if user.tenant_id != command.tenant_id:
            raise ValueError("El usuario no pertenece al tenant indicado")

        role = self._role_repo.get_role_by_id(command.role_id)
        if not role:
            raise ValueError(f"Rol no encontrado: {command.role_id}")
        if role.tenant_id != command.tenant_id:
            raise ValueError("El rol no pertenece al tenant indicado")

        user_role = self._role_repo.assign_role_to_user(
            user_id=command.user_id,
            role_id=command.role_id,
            assigned_by=command.assigned_by_user_id,
        )

        self._event_bus.publish(
            RoleAssigned(
                tenant_id=command.tenant_id,
                user_id=command.user_id,
                role_id=command.role_id,
                role_code=role.name,
                occurred_at=datetime.now(timezone.utc),
            )
        )

        return user_role
