from uuid import uuid4
from datetime import datetime, timezone

from application.event_bus import EventBus
from application.ports.audit_log_repository import AuditLogRepository
from domain.events.auth import UserLoggedIn, UserLoginFailed
from domain.events.user import UserCreated
from domain.logs import Actor, LogEntry, LogEventType
from infrastructure.logging import get_logger

logger = get_logger()


def _make_handle_user_logged_in(audit_log_repo: AuditLogRepository):
    def handle(event: UserLoggedIn):
        logger.info(
            "User logged in",
            extra={"tenant_id": str(event.tenant_id), "user_id": str(event.user_id)},
        )
        log_entry = LogEntry(
            id=str(uuid4()),
            tenant_id=str(event.tenant_id),
            actor=Actor(user_id=str(event.user_id), tenant_id=str(event.tenant_id), ip=None),
            event_type=LogEventType.AUTH,
            entity="USER",
            entity_id=str(event.user_id),
            action="LOGIN",
            payload={"user_id": str(event.user_id)},
            occurred_at=event.occurred_at,
        )
        audit_log_repo.save_log_entry(log_entry)

    handle.__name__ = "handle_user_logged_in"
    return handle


def _make_handle_user_created(audit_log_repo: AuditLogRepository):
    def handle(event: UserCreated):
        logger.info(
            "User created",
            extra={"tenant_id": str(event.tenant_id), "user_id": str(event.user_id)},
        )
        log_entry = LogEntry(
            id=str(uuid4()),
            tenant_id=str(event.tenant_id),
            actor=Actor(user_id=str(event.user_id), tenant_id=str(event.tenant_id), ip=None),
            event_type=LogEventType.AUTH,
            entity="USER",
            entity_id=str(event.user_id),
            action="CREATED",
            payload={"user_id": str(event.user_id), "email": event.email},
            occurred_at=event.occurred_at,
        )
        audit_log_repo.save_log_entry(log_entry)

    handle.__name__ = "handle_user_created"
    return handle


def handle_user_login_failed(event: UserLoginFailed):
    logger.warning(
        "Login failed",
        extra={
            "tenant_id": str(event.tenant_id) if event.tenant_id else None,
            "username": event.username,
        },
    )


def register_handlers(event_bus: EventBus, audit_log_repo: AuditLogRepository):
    event_bus.subscribe(UserLoggedIn, _make_handle_user_logged_in(audit_log_repo))
    event_bus.subscribe(UserCreated, _make_handle_user_created(audit_log_repo))
    event_bus.subscribe(UserLoginFailed, handle_user_login_failed)
