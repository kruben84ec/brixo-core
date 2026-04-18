from application.ports.auth_repository import AuthRepository
from domain.entities.user import User
from infrastructure.database import get_db_cursor
from infrastructure.logging import get_logger
from infrastructure.security.passwords import verify_password

logger = get_logger()


class AuthRepositorySQL(AuthRepository):

    def get_user_by_email(self, email: str) -> User | None:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, tenant_id, email, password_hash, is_active
                FROM users
                WHERE email = %s AND is_active = TRUE
                LIMIT 1
                """,
                (email,),
            )
            row = cursor.fetchone()

        if not row:
            logger.info("User not found by email", extra={"email": email})
            return None

        return User(
            id=str(row[0]),
            tenant_id=str(row[1]),
            email=row[2],
            password_hash=row[3],
            is_active=row[4],
        )
