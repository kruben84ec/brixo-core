from application.ports.access_repository import AccessRepository
from infrastructure.database import get_db_cursor


class AccessRepositorySQL(AccessRepository):

    async def get_roles_by_user(self, user_id: str, tenant_id: str) -> list[str]:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT r.name
                FROM roles r
                JOIN user_roles ur ON ur.role_id = r.id
                WHERE ur.user_id = %s AND r.tenant_id = %s
                ORDER BY r.name
                """,
                (user_id, tenant_id),
            )
            rows = cursor.fetchall()
        return [row[0] for row in rows]

    async def get_permissions_by_roles(self, role_id: list[str], tenant_id: str) -> list[str]:
        if not role_id:
            return []
        placeholders = ", ".join(["%s"] * len(role_id))
        with get_db_cursor() as cursor:
            cursor.execute(
                f"""
                SELECT DISTINCT p.code
                FROM permissions p
                WHERE p.role_id IN ({placeholders}) AND p.tenant_id = %s
                ORDER BY p.code
                """,
                (*role_id, tenant_id),
            )
            rows = cursor.fetchall()
        return [row[0] for row in rows]
