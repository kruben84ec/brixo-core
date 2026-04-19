from application.ports.role_repository import RoleData, RoleRepository, UserRoleData
from infrastructure.database import get_db_cursor
from infrastructure.logging import get_logger

logger = get_logger()


class RoleRepositorySQL(RoleRepository):

    def get_role_by_id(self, role_id: str) -> RoleData | None:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, tenant_id, name, description, created_at
                FROM roles
                WHERE id = %s
                """,
                (role_id,),
            )
            row = cursor.fetchone()
        return self._row_to_role(row) if row else None

    def list_roles_by_tenant(self, tenant_id: str) -> list[RoleData]:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, tenant_id, name, description, created_at
                FROM roles
                WHERE tenant_id = %s
                ORDER BY name
                """,
                (tenant_id,),
            )
            rows = cursor.fetchall()
        return [self._row_to_role(row) for row in rows]

    def create_role(self, tenant_id: str, name: str, description: str | None) -> RoleData:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO roles (tenant_id, name, description)
                VALUES (%s, %s, %s)
                RETURNING id, tenant_id, name, description, created_at
                """,
                (tenant_id, name, description),
            )
            row = cursor.fetchone()
        logger.info("Role created", extra={"tenant_id": tenant_id, "role_name": name})
        return self._row_to_role(row)

    def assign_role_to_user(self, user_id: str, role_id: str, assigned_by: str) -> UserRoleData:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO user_roles (user_id, role_id, assigned_by)
                VALUES (%s, %s, %s)
                ON CONFLICT (user_id, role_id) DO NOTHING
                RETURNING id, user_id, role_id, assigned_by, assigned_at
                """,
                (user_id, role_id, assigned_by),
            )
            row = cursor.fetchone()
        if not row:
            raise ValueError(f"Role {role_id} already assigned to user {user_id}")
        logger.info("Role assigned", extra={"user_id": user_id, "role_id": role_id})
        return self._row_to_user_role(row)

    def revoke_role_from_user(self, user_id: str, role_id: str) -> None:
        with get_db_cursor() as cursor:
            cursor.execute(
                "DELETE FROM user_roles WHERE user_id = %s AND role_id = %s",
                (user_id, role_id),
            )
        logger.info("Role revoked", extra={"user_id": user_id, "role_id": role_id})

    def get_role_names_by_user(self, user_id: str, tenant_id: str) -> list[str]:
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

    def get_permission_codes_by_roles(self, role_ids: list[str], tenant_id: str) -> list[str]:
        if not role_ids:
            return []
        placeholders = ", ".join(["%s"] * len(role_ids))
        with get_db_cursor() as cursor:
            cursor.execute(
                f"""
                SELECT DISTINCT p.code
                FROM permissions p
                WHERE p.role_id IN ({placeholders}) AND p.tenant_id = %s
                ORDER BY p.code
                """,
                (*role_ids, tenant_id),
            )
            rows = cursor.fetchall()
        return [row[0] for row in rows]

    @staticmethod
    def _row_to_role(row: tuple) -> RoleData:
        return RoleData(
            id=str(row[0]),
            tenant_id=str(row[1]),
            name=row[2],
            description=row[3],
            created_at=row[4],
        )

    @staticmethod
    def _row_to_user_role(row: tuple) -> UserRoleData:
        return UserRoleData(
            id=str(row[0]),
            user_id=str(row[1]),
            role_id=str(row[2]),
            assigned_by=str(row[3]) if row[3] else None,
            assigned_at=row[4],
        )
