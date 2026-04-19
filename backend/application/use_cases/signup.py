from dataclasses import dataclass
from datetime import datetime, timezone

from application.event_bus import EventBus
from application.ports.tenant_repository import TenantRepository
from application.ports.user_repository import UserRepository
from domain.events.user import UserCreated
from infrastructure.security.passwords import hash_password


@dataclass(frozen=True)
class SignUpCommand:
    company_name: str
    username: str
    email: str
    password: str


@dataclass(frozen=True)
class SignUpResult:
    user_id: str
    tenant_id: str
    username: str
    email: str
    authority_level: str


class SignUpUseCase:
    def __init__(
        self,
        tenant_repo: TenantRepository,
        user_repo: UserRepository,
        event_bus: EventBus,
    ):
        self._tenant_repo = tenant_repo
        self._user_repo = user_repo
        self._event_bus = event_bus

    def execute(self, command: SignUpCommand) -> SignUpResult:
        if not command.company_name or not command.company_name.strip():
            raise ValueError("El nombre de la empresa no puede estar vacío")
        if not command.username or not command.username.strip():
            raise ValueError("El nombre de usuario no puede estar vacío")
        if not command.email or "@" not in command.email:
            raise ValueError("Email inválido")
        if len(command.password) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")

        tenant = self._tenant_repo.create_tenant(command.company_name.strip())

        user = self._user_repo.create_user(
            tenant_id=tenant.id,
            username=command.username.strip(),
            email=command.email.lower().strip(),
            password_hash=hash_password(command.password),
            authority_level="OWNER",
        )

        self._event_bus.publish(
            UserCreated(
                tenant_id=tenant.id,
                user_id=user.id,
                email=user.email,
                occurred_at=datetime.now(timezone.utc),
            )
        )

        return SignUpResult(
            user_id=user.id,
            tenant_id=tenant.id,
            username=user.username,
            email=user.email,
            authority_level=user.authority_level,
        )
