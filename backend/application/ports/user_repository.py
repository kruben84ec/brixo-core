from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime

VALID_AUTHORITY_LEVELS = {"OWNER", "ADMIN", "MANAGER", "OPERATOR"}


@dataclass(frozen=True)
class UserData:
    id: str
    tenant_id: str
    username: str
    email: str
    password_hash: str
    authority_level: str
    is_active: bool
    created_at: datetime


class UserRepository(ABC):

    @abstractmethod
    def get_user_by_id(self, user_id: str) -> UserData | None:
        pass

    @abstractmethod
    def get_user_by_email_and_tenant(self, email: str, tenant_id: str) -> UserData | None:
        pass

    @abstractmethod
    def list_users_by_tenant(self, tenant_id: str) -> list[UserData]:
        pass

    @abstractmethod
    def create_user(
        self,
        tenant_id: str,
        username: str,
        email: str,
        password_hash: str,
        authority_level: str,
    ) -> UserData:
        pass

    @abstractmethod
    def deactivate_user(self, user_id: str) -> None:
        pass
