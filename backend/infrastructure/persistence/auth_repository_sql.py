# backend/infrastructure/persistence/auth_repository_sql.py

from uuid import UUID
from application.ports.auth_repository import AuthRepository
from domain.entities.user import User
from infrastructure.logging import get_logger

logger = get_logger()


class AuthRepositorySQL(AuthRepository):
    def __init__(self, session=None):
        self.session = session  # luego será SQLAlchemy session

    def get_user_by_email(self, email: str) -> User | None:
        """
        MVP stub:
        - Simula acceso a DB
        - Permite avanzar con Auth + JWT
        """

        logger.info(
            "Fetching user by email",
            extra={"email": email}
        )

        # ⚠️ MOCK TEMPORAL
        if email == "admin@brixo.local":
            return User(
                id=UUID("550e8400-e29b-41d4-a716-446655440000"),
                tenant_id=UUID("550e8400-e29b-41d4-a716-446655440001"),
                email=email,
                password_hash="$2b$12$examplehashedpassword",
                is_activate=True
            )

        return None
