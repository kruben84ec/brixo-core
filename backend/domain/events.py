from dataclasses import dataclass
from datetime import datetime

from uuid import UUID
from typing import Any

from backend.domain.contracts import Tenat

@dataclass(frozen=True)
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
    user_id: UUID
    role_id: UUID
    occurred_at: datetime

@dataclass(frozen=True)
class SaleRegistered(DomainEvent):
    sale_id: UUID
    total: float
    occurred_at: datetime