from dataclasses import dataclass
from datetime import datetime

from uuid import UUID
from typing import Any

from domain.contracts import Tenant  # noqa: F401


class DomainEvent:
    tenant_id: UUID
    ocurred_at: datetime

@dataclass(frozen=True)
class InventoryChanged(DomainEvent):
    product_id: UUID
    delta:int
    occurred_at: datetime

@dataclass(frozen=True)
class RoleAssigned(DomainEvent):
    tenant_id: UUID
    user_id: UUID
    role_id: UUID
    role_code: str
    occurred_at: datetime


@dataclass(frozen=True)
class RoleRevoked(DomainEvent):
    tenant_id: UUID
    user_id: UUID
    role_id: UUID
    role_code: str
    occurred_at: datetime

@dataclass(frozen=True)
class SaleRegistered(DomainEvent):
    sale_id: UUID
    total: float
    occurred_at: datetime