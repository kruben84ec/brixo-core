from dataclasses import dataclass

from application.event_bus import EventBus
from application.ports.inventory_movement_repository import (
    InventoryMovement,
    InventoryMovementRepository,
)
from application.ports.product_repository import ProductRepository


VALID_MOVEMENT_TYPES = {"ENTRADA", "SALIDA", "AJUSTE"}


@dataclass(frozen=True)
class RegisterInventoryMovementCommand:
    tenant_id: str
    product_id: str
    movement_type: str  # ENTRADA | SALIDA | AJUSTE
    quantity: int
    reason: str | None
    actor_user_id: str


class RegisterInventoryMovementUseCase:

    def __init__(
        self,
        product_repo: ProductRepository,
        movement_repo: InventoryMovementRepository,
        event_bus: EventBus,
    ):
        self._product_repo = product_repo
        self._movement_repo = movement_repo
        self._event_bus = event_bus

    def execute(self, command: RegisterInventoryMovementCommand) -> InventoryMovement:
        if command.movement_type not in VALID_MOVEMENT_TYPES:
            raise ValueError(f"Tipo de movimiento inválido: {command.movement_type}")
        if command.quantity <= 0:
            raise ValueError("La cantidad debe ser mayor a cero")

        product = self._product_repo.get_product_by_tenant_and_id(
            command.tenant_id, command.product_id
        )
        if not product:
            raise ValueError(f"Producto no encontrado: {command.product_id}")

        if command.movement_type == "SALIDA":
            if product.current_stock < command.quantity:
                raise ValueError(
                    f"Stock insuficiente: disponible={product.current_stock}, "
                    f"solicitado={command.quantity}"
                )
            new_stock = product.current_stock - command.quantity
        elif command.movement_type == "ENTRADA":
            new_stock = product.current_stock + command.quantity
        else:  # AJUSTE
            new_stock = command.quantity

        self._product_repo.update_product_stock(command.product_id, new_stock)

        return self._movement_repo.register_inventory_movement(
            tenant_id=command.tenant_id,
            product_id=command.product_id,
            movement_type=command.movement_type,
            quantity=command.quantity,
            reason=command.reason,
            created_by=command.actor_user_id,
        )
