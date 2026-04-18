from dataclasses import dataclass
from datetime import datetime, timezone

from application.event_bus import EventBus
from application.ports.user_repository import UserData, UserRepository, VALID_AUTHORITY_LEVELS
from domain.events.user import UserCreated
from infrastructure.security.passwords import hash_password


@dataclass(frozen=True)
class CreateUserCommand:
    tenant_id: str
    username: str
    email: str
    password: str
    authority_level: str


class CreateUserUseCase:
    def __init__(self, user_repo: UserRepository, event_bus: EventBus):
        self._user_repo = user_repo
        self._event_bus = event_bus

    def execute(self, command: CreateUserCommand) -> UserData:
        if command.authority_level not in VALID_AUTHORITY_LEVELS:
            raise ValueError(f"Nivel de autoridad inválido: {command.authority_level}")
        if not command.username or not command.username.strip():
            raise ValueError("El nombre de usuario no puede estar vacío")
        if not command.email or "@" not in command.email:
            raise ValueError("Email inválido")
        if len(command.password) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")

        existing = self._user_repo.get_user_by_email_and_tenant(command.email, command.tenant_id)
        if existing:
            raise ValueError(f"Ya existe un usuario con el email: {command.email}")

        user = self._user_repo.create_user(
            tenant_id=command.tenant_id,
            username=command.username.strip(),
            email=command.email.lower().strip(),
            password_hash=hash_password(command.password),
            authority_level=command.authority_level,
        )

        self._event_bus.publish(
            UserCreated(
                tenant_id=command.tenant_id,
                user_id=user.id,
                email=user.email,
                occurred_at=datetime.now(timezone.utc),
            )
        )

        return user
