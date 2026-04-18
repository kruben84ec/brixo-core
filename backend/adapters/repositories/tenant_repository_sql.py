from application.ports.tenant_repository import TenantData, TenantRepository
from infrastructure.database import get_db_cursor
from infrastructure.logging import get_logger

logger = get_logger()


class TenantRepositorySQL(TenantRepository):

    def get_tenant_by_id(self, tenant_id: str) -> TenantData | None:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, name, is_active, created_at
                FROM tenants
                WHERE id = %s
                """,
                (tenant_id,),
            )
            row = cursor.fetchone()
        return self._row_to_tenant(row) if row else None

    def create_tenant(self, name: str) -> TenantData:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO tenants (name)
                VALUES (%s)
                RETURNING id, name, is_active, created_at
                """,
                (name,),
            )
            row = cursor.fetchone()
        logger.info("Tenant created", extra={"name": name})
        return self._row_to_tenant(row)

    def list_active_tenants(self) -> list[TenantData]:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, name, is_active, created_at
                FROM tenants
                WHERE is_active = TRUE
                ORDER BY name
                """
            )
            rows = cursor.fetchall()
        return [self._row_to_tenant(row) for row in rows]

    @staticmethod
    def _row_to_tenant(row: tuple) -> TenantData:
        return TenantData(
            id=str(row[0]),
            name=row[1],
            is_active=row[2],
            created_at=row[3],
        )
