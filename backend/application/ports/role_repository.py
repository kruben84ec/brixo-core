from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class RoleData:
    id: str
    tenant_id: str
    name: str
    description: str | None
    created_at: datetime


@dataclass(frozen=True)
class UserRoleData:
    id: str
    user_id: str
    role_id: str
    assigned_by: str | None
    assigned_at: datetime


class RoleRepository(ABC):

    @abstractmethod
    def get_role_by_id(self, role_id: str) -> RoleData | None:
        pass

    @abstractmethod
    def list_roles_by_tenant(self, tenant_id: str) -> list[RoleData]:
        pass

    @abstractmethod
    def create_role(self, tenant_id: str, name: str, description: str | None) -> RoleData:
        pass

    @abstractmethod
    def assign_role_to_user(self, user_id: str, role_id: str, assigned_by: str) -> UserRoleData:
        pass

    @abstractmethod
    def revoke_role_from_user(self, user_id: str, role_id: str) -> None:
        pass

    @abstractmethod
    def get_role_names_by_user(self, user_id: str, tenant_id: str) -> list[str]:
        pass

    @abstractmethod
    def get_permission_codes_by_roles(self, role_ids: list[str], tenant_id: str) -> list[str]:
        pass
