from application.ports.inventory_movement_repository import (
    InventoryMovement,
    InventoryMovementRepository,
)
from infrastructure.database import get_db_cursor
from infrastructure.logging import get_logger

logger = get_logger()


class InventoryMovementRepositorySQL(InventoryMovementRepository):

    def register_inventory_movement(
        self,
        tenant_id: str,
        product_id: str,
        movement_type: str,
        quantity: int,
        reason: str | None,
        created_by: str,
    ) -> InventoryMovement:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO inventory_movements
                    (tenant_id, product_id, movement_type, quantity, reason, created_by)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, tenant_id, product_id, movement_type, quantity, reason,
                          created_by, created_at
                """,
                (tenant_id, product_id, movement_type, quantity, reason, created_by),
            )
            row = cursor.fetchone()

        logger.info(
            "Inventory movement registered",
            extra={"product_id": product_id, "type": movement_type, "quantity": quantity},
        )
        return self._row_to_movement(row)

    def list_movements_by_product(self, product_id: str) -> list[InventoryMovement]:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, tenant_id, product_id, movement_type, quantity, reason,
                       created_by, created_at
                FROM inventory_movements
                WHERE product_id = %s
                ORDER BY created_at DESC
                """,
                (product_id,),
            )
            rows = cursor.fetchall()

        return [self._row_to_movement(row) for row in rows]

    @staticmethod
    def _row_to_movement(row: tuple) -> InventoryMovement:
        return InventoryMovement(
            id=str(row[0]),
            tenant_id=str(row[1]),
            product_id=str(row[2]),
            movement_type=row[3],
            quantity=row[4],
            reason=row[5],
            created_by=str(row[6]),
            created_at=row[7],
        )
