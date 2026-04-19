from application.ports.user_repository import UserData, UserRepository, VALID_AUTHORITY_LEVELS
from infrastructure.database import get_db_cursor
from infrastructure.logging import get_logger

logger = get_logger()


class UserRepositorySQL(UserRepository):

    def get_user_by_id(self, user_id: str) -> UserData | None:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, tenant_id, username, email, password_hash,
                       authority_level, is_active, created_at
                FROM users
                WHERE id = %s
                """,
                (user_id,),
            )
            row = cursor.fetchone()
        return self._row_to_user(row) if row else None

    def get_user_by_email_and_tenant(self, email: str, tenant_id: str) -> UserData | None:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, tenant_id, username, email, password_hash,
                       authority_level, is_active, created_at
                FROM users
                WHERE email = %s AND tenant_id = %s AND is_active = TRUE
                LIMIT 1
                """,
                (email, tenant_id),
            )
            row = cursor.fetchone()
        return self._row_to_user(row) if row else None

    def list_users_by_tenant(self, tenant_id: str) -> list[UserData]:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, tenant_id, username, email, password_hash,
                       authority_level, is_active, created_at
                FROM users
                WHERE tenant_id = %s
                ORDER BY username
                """,
                (tenant_id,),
            )
            rows = cursor.fetchall()
        return [self._row_to_user(row) for row in rows]

    def create_user(
        self,
        tenant_id: str,
        username: str,
        email: str,
        password_hash: str,
        authority_level: str,
    ) -> UserData:
        if authority_level not in VALID_AUTHORITY_LEVELS:
            raise ValueError(f"Invalid authority level: {authority_level}")
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO users (tenant_id, username, email, password_hash, authority_level)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, tenant_id, username, email, password_hash,
                          authority_level, is_active, created_at
                """,
                (tenant_id, username, email, password_hash, authority_level),
            )
            row = cursor.fetchone()
        logger.info("User created", extra={"tenant_id": tenant_id, "email": email})
        return self._row_to_user(row)

    def deactivate_user(self, user_id: str) -> None:
        with get_db_cursor() as cursor:
            cursor.execute(
                "UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = %s",
                (user_id,),
            )

    @staticmethod
    def _row_to_user(row: tuple) -> UserData:
        return UserData(
            id=str(row[0]),
            tenant_id=str(row[1]),
            username=row[2],
            email=row[3],
            password_hash=row[4],
            authority_level=row[5],
            is_active=row[6],
            created_at=row[7],
        )
