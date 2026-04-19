from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class TenantData:
    id: str
    name: str
    is_active: bool
    created_at: datetime


class TenantRepository(ABC):

    @abstractmethod
    def get_tenant_by_id(self, tenant_id: str) -> TenantData | None:
        pass

    @abstractmethod
    def create_tenant(self, name: str) -> TenantData:
        pass

    @abstractmethod
    def list_active_tenants(self) -> list[TenantData]:
        pass
