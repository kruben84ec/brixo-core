from uuid import uuid4, UUID
from datetime import datetime, timezone
from domain.events.auth import UserLoggedIn, UserLoginFailed
from application.event_bus import EventBus
from domain.logs import LogEntry, LogEventType, Actor, SYSTEM_ACTOR
from infrastructure.logging import get_logger

logger = get_logger()


def handle_user_logged_in(event: UserLoggedIn):
    logger.info(
        "User logged in",
        extra={
            "tenant_id": str(event.tenant_id),
            "user_id": str(event.user_id)
        }
    )
    
    actor = Actor(
        user_id=str(event.user_id),
        tenant_id=str(event.tenant_id),
        ip=None
    )
    
    domain_log = LogEntry(
        id=str(uuid4()),
        tenant_id=str(event.tenant_id),
        actor=actor,
        event_type=LogEventType.AUTH,
        entity="USER",
        entity_id=str(event.user_id),
        action="LOGIN",
        payload={"user_id": str(event.user_id)},
        occurred_at=event.occurred_at
    )

    
def handle_user_login_failed(event: UserLoginFailed):
    logger.warning(
        "Login failed",
        extra={
            "tenant_id": str(event.tenant_id) if event.tenant_id else None,
            "username": event.username,
        },
    )


def register_handlers(event_bus: EventBus):
    """Registra todos los handlers de eventos del dominio"""
    event_bus.subscribe(UserLoggedIn, handle_user_logged_in)
    event_bus.subscribe(UserLoginFailed, handle_user_login_failed)

