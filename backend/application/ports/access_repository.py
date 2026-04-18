from abc import ABC, abstractmethod


class AccessRepository(ABC):

    @abstractmethod
    async def get_roles_by_user(self, user_id: str, tenant_id: str) -> list[str]:
        pass

    @abstractmethod
    async def get_permissions_by_roles(self, role_id: list[str], tenant_id: str) -> list[str]:
        pass
