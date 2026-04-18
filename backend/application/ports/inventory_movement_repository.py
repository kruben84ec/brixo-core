from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class InventoryMovement:
    id: str
    tenant_id: str
    product_id: str
    movement_type: str  # ENTRADA | SALIDA | AJUSTE
    quantity: int
    reason: str | None
    created_by: str
    created_at: datetime


class InventoryMovementRepository(ABC):

    @abstractmethod
    def register_inventory_movement(
        self,
        tenant_id: str,
        product_id: str,
        movement_type: str,
        quantity: int,
        reason: str | None,
        created_by: str,
    ) -> InventoryMovement:
        pass

    @abstractmethod
    def list_movements_by_product(self, product_id: str) -> list[InventoryMovement]:
        pass
