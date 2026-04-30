"""
Tests para application/handlers.py
Valida que los event handlers registren logs y auditoría correctamente.
"""

import pytest
from uuid import uuid4
from datetime import datetime, timezone
from unittest.mock import Mock, call

from application.event_bus import EventBus
from application.handlers import register_handlers
from domain.events.auth import UserLoggedIn, UserLoginFailed
from domain.events.user import UserCreated


class TestHandlerRegistration:
    """Tests para el registro de handlers."""

    def test_register_handlers(self, event_bus, mock_audit_log_repository):
        """Debe registrar todos los handlers en el event bus."""
        register_handlers(event_bus, mock_audit_log_repository)

        # Verificar que los tipos de evento tienen handlers registrados
        assert UserLoggedIn in event_bus._handlers
        assert UserLoginFailed in event_bus._handlers
        assert UserCreated in event_bus._handlers

    def test_register_handlers_count(self, event_bus, mock_audit_log_repository):
        """Debe registrar el número correcto de handlers."""
        register_handlers(event_bus, mock_audit_log_repository)

        total_handlers = sum(
            len(handlers) for handlers in event_bus._handlers.values()
        )

        # UserLoggedIn, UserLoginFailed, UserCreated
        assert total_handlers == 3


class TestUserLoggedInHandler:
    """Tests para el handler de UserLoggedIn."""

    def test_handle_user_logged_in_creates_log(
        self, event_bus, mock_audit_log_repository
    ):
        """Debe crear una LogEntry cuando usuario inicia sesión."""
        register_handlers(event_bus, mock_audit_log_repository)

        tenant_id = str(uuid4())
        user_id = str(uuid4())
        now = datetime.now(timezone.utc)

        event = UserLoggedIn(
            tenant_id=tenant_id,
            user_id=user_id,
            occurred_at=now
        )

        event_bus.publish(event)

        # Verificar que se guardó una entrada de auditoría
        mock_audit_log_repository.save_log_entry.assert_called_once()

        # Obtener el LogEntry guardado
        log_entry = mock_audit_log_repository.save_log_entry.call_args[0][0]

        assert log_entry.tenant_id == tenant_id
        assert log_entry.entity_id == user_id
        assert log_entry.action == "LOGIN"
        assert log_entry.entity == "USER"

    def test_logged_in_log_entry_has_actor(
        self, event_bus, mock_audit_log_repository
    ):
        """La LogEntry debe contener información del actor."""
        register_handlers(event_bus, mock_audit_log_repository)

        tenant_id = str(uuid4())
        user_id = str(uuid4())

        event = UserLoggedIn(
            tenant_id=tenant_id,
            user_id=user_id,
            occurred_at=datetime.now(timezone.utc)
        )

        event_bus.publish(event)

        log_entry = mock_audit_log_repository.save_log_entry.call_args[0][0]

        assert log_entry.actor.user_id == user_id
        assert log_entry.actor.tenant_id == tenant_id


class TestUserLoginFailedHandler:
    """Tests para el handler de UserLoginFailed."""

    def test_handle_user_login_failed(self, event_bus):
        """Debe manejar evento de login fallido sin errores."""
        register_handlers(event_bus, Mock())

        event = UserLoginFailed(
            tenant_id=str(uuid4()),
            username="test@example.com",
            occurred_at=datetime.now(timezone.utc)
        )

        # No debe lanzar excepción
        event_bus.publish(event)

    def test_handle_user_login_failed_without_tenant(self, event_bus):
        """Debe manejar login fallido sin tenant_id."""
        register_handlers(event_bus, Mock())

        event = UserLoginFailed(
            tenant_id=None,
            username="test@example.com",
            occurred_at=datetime.now(timezone.utc)
        )

        # No debe lanzar excepción
        event_bus.publish(event)


class TestUserCreatedHandler:
    """Tests para el handler de UserCreated."""

    def test_handle_user_created_creates_log(
        self, event_bus, mock_audit_log_repository
    ):
        """Debe crear una LogEntry cuando usuario es creado."""
        register_handlers(event_bus, mock_audit_log_repository)

        tenant_id = str(uuid4())
        user_id = str(uuid4())
        email = "newuser@example.com"
        now = datetime.now(timezone.utc)

        event = UserCreated(
            tenant_id=tenant_id,
            user_id=user_id,
            email=email,
            occurred_at=now
        )

        event_bus.publish(event)

        # Verificar que se guardó una entrada de auditoría
        mock_audit_log_repository.save_log_entry.assert_called_once()

        log_entry = mock_audit_log_repository.save_log_entry.call_args[0][0]

        assert log_entry.tenant_id == tenant_id
        assert log_entry.entity_id == user_id
        assert log_entry.action == "CREATED"
        assert log_entry.entity == "USER"
        assert log_entry.payload["email"] == email

    def test_user_created_log_has_email(
        self, event_bus, mock_audit_log_repository
    ):
        """El payload de UserCreated debe contener email."""
        register_handlers(event_bus, mock_audit_log_repository)

        email = "test@example.com"

        event = UserCreated(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            email=email,
            occurred_at=datetime.now(timezone.utc)
        )

        event_bus.publish(event)

        log_entry = mock_audit_log_repository.save_log_entry.call_args[0][0]

        assert "email" in log_entry.payload
        assert log_entry.payload["email"] == email


class TestMultipleHandlerExecution:
    """Tests para la ejecución de múltiples handlers."""

    def test_multiple_events_execution(
        self, event_bus, mock_audit_log_repository
    ):
        """Debe manejar múltiples eventos correctamente."""
        register_handlers(event_bus, mock_audit_log_repository)

        tenant_id = str(uuid4())

        # Publicar múltiples eventos
        events = [
            UserLoggedIn(
                tenant_id=tenant_id,
                user_id=str(uuid4()),
                occurred_at=datetime.now(timezone.utc)
            ),
            UserCreated(
                tenant_id=tenant_id,
                user_id=str(uuid4()),
                email="test@example.com",
                occurred_at=datetime.now(timezone.utc)
            ),
            UserLoginFailed(
                tenant_id=tenant_id,
                username="test@example.com",
                occurred_at=datetime.now(timezone.utc)
            ),
        ]

        for event in events:
            event_bus.publish(event)

        # Deben haberse guardado dos LogEntry (UserLoggedIn y UserCreated)
        assert mock_audit_log_repository.save_log_entry.call_count == 2
