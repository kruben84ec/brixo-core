from datetime import datetime, timezone

from application.ports.product_repository import Product, ProductRepository
from infrastructure.database import get_db_cursor
from infrastructure.logging import get_logger

logger = get_logger()


class ProductRepositorySQL(ProductRepository):

    def get_product_by_tenant_and_id(self, tenant_id: str, product_id: str) -> Product | None:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, tenant_id, name, description, current_stock, minimum_stock,
                       is_active, created_at
                FROM products
                WHERE tenant_id = %s AND id = %s AND is_active = TRUE
                """,
                (tenant_id, product_id),
            )
            row = cursor.fetchone()

        return self._row_to_product(row) if row else None

    def list_active_products_by_tenant(self, tenant_id: str) -> list[Product]:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, tenant_id, name, description, current_stock, minimum_stock,
                       is_active, created_at
                FROM products
                WHERE tenant_id = %s AND is_active = TRUE
                ORDER BY name
                """,
                (tenant_id,),
            )
            rows = cursor.fetchall()

        return [self._row_to_product(row) for row in rows]

    def create_product(
        self,
        tenant_id: str,
        name: str,
        description: str | None,
        initial_stock: int,
        minimum_stock: int,
    ) -> Product:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO products (tenant_id, name, description, current_stock, minimum_stock)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, tenant_id, name, description, current_stock, minimum_stock,
                          is_active, created_at
                """,
                (tenant_id, name, description, initial_stock, minimum_stock),
            )
            row = cursor.fetchone()

        logger.info("Product created", extra={"tenant_id": tenant_id, "name": name})
        return self._row_to_product(row)

    def update_product_stock(self, product_id: str, new_stock: int) -> None:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                UPDATE products
                SET current_stock = %s, updated_at = NOW()
                WHERE id = %s
                """,
                (new_stock, product_id),
            )

    @staticmethod
    def _row_to_product(row: tuple) -> Product:
        return Product(
            id=str(row[0]),
            tenant_id=str(row[1]),
            name=row[2],
            description=row[3],
            current_stock=row[4],
            minimum_stock=row[5],
            is_active=row[6],
            created_at=row[7],
        )
