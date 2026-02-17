# backend/application/services/auth/login_user.py

from datetime import datetime, timezone
from application.event_bus import EventBus
from application.ports.auth_repository import AuthRepository
from domain.events.auth import UserLoggedIn, UserLoginFailed
from infrastructure.security.passwords import verify_password


class LoginUser:
    def __init__(
        self,
        auth_repository: AuthRepository,
        event_bus: EventBus,
    ):
        self.auth_repository = auth_repository
        self.event_bus = event_bus

    def execute(self, email: str, password: str):
        user = self.auth_repository.get_user_by_email(email)
        


        if not user or not verify_password(password, user.password_hash):
            self.event_bus.publish(
                UserLoginFailed(
                    tenant_id=user.tenant_id if user else None,
                    username=email,
                    occurred_at=datetime.now(timezone.utc)
                )
            )
            raise ValueError("Invalid credentials")

        self.event_bus.publish(
            UserLoggedIn(
                tenant_id=user.tenant_id,
                user_id=user.id,
                occurred_at=datetime.now(timezone.utc)
            )
        )

        return user
