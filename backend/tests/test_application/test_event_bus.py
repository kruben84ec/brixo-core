"""
Tests para application/event_bus.py
Valida que el bus de eventos funcione correctamente con publishers y subscribers.
"""

import pytest
from uuid import uuid4
from datetime import datetime, timezone
from unittest.mock import Mock, call
import asyncio

from application.event_bus import EventBus
from domain.events.base import DomainEvent
from domain.events.auth import UserLoggedIn, UserLoginFailed


class TestEventBus:
    """Tests para la clase EventBus."""

    def test_event_bus_creation(self):
        """Debe crear un EventBus válido."""
        bus = EventBus()
        assert bus is not None
        assert hasattr(bus, '_handlers')

    def test_subscribe_single_handler(self, event_bus):
        """Debe registrar un handler para un evento."""
        handler = Mock()
        event_bus.subscribe(UserLoggedIn, handler)

        # Verificar que el handler está registrado
        assert UserLoggedIn in event_bus._handlers
        assert handler in event_bus._handlers[UserLoggedIn]

    def test_subscribe_multiple_handlers_same_event(self, event_bus):
        """Debe permitir múltiples handlers para el mismo evento."""
        handler1 = Mock()
        handler2 = Mock()

        event_bus.subscribe(UserLoggedIn, handler1)
        event_bus.subscribe(UserLoggedIn, handler2)

        assert len(event_bus._handlers[UserLoggedIn]) == 2
        assert handler1 in event_bus._handlers[UserLoggedIn]
        assert handler2 in event_bus._handlers[UserLoggedIn]

    def test_subscribe_handlers_different_events(self, event_bus):
        """Debe registrar handlers para diferentes eventos."""
        handler1 = Mock()
        handler2 = Mock()

        event_bus.subscribe(UserLoggedIn, handler1)
        event_bus.subscribe(UserLoginFailed, handler2)

        assert len(event_bus._handlers[UserLoggedIn]) == 1
        assert len(event_bus._handlers[UserLoginFailed]) == 1

    def test_publish_event_calls_handlers(self, event_bus):
        """Debe llamar a los handlers cuando se publica un evento."""
        handler = Mock()
        event_bus.subscribe(UserLoggedIn, handler)

        event = UserLoggedIn(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            occurred_at=datetime.now(timezone.utc)
        )

        event_bus.publish(event)

        handler.assert_called_once_with(event)

    def test_publish_calls_multiple_handlers(self, event_bus):
        """Debe llamar a múltiples handlers para un evento."""
        handler1 = Mock()
        handler2 = Mock()

        event_bus.subscribe(UserLoggedIn, handler1)
        event_bus.subscribe(UserLoggedIn, handler2)

        event = UserLoggedIn(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            occurred_at=datetime.now(timezone.utc)
        )

        event_bus.publish(event)

        handler1.assert_called_once_with(event)
        handler2.assert_called_once_with(event)

    def test_publish_only_relevant_handlers(self, event_bus):
        """Solo debe llamar a handlers del tipo de evento publicado."""
        handler_logged_in = Mock()
        handler_login_failed = Mock()

        event_bus.subscribe(UserLoggedIn, handler_logged_in)
        event_bus.subscribe(UserLoginFailed, handler_login_failed)

        event = UserLoggedIn(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            occurred_at=datetime.now(timezone.utc)
        )

        event_bus.publish(event)

        handler_logged_in.assert_called_once_with(event)
        handler_login_failed.assert_not_called()

    def test_publish_no_handlers(self, event_bus):
        """Debe publicar evento sin handlers sin errores."""
        event = UserLoggedIn(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            occurred_at=datetime.now(timezone.utc)
        )

        # No debe lanzar excepción
        event_bus.publish(event)

    def test_handler_exception_handling(self, event_bus):
        """Debe continuar con otros handlers si uno falla."""
        handler1 = Mock(side_effect=Exception("Test error"))
        handler2 = Mock()

        event_bus.subscribe(UserLoggedIn, handler1)
        event_bus.subscribe(UserLoggedIn, handler2)

        event = UserLoggedIn(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            occurred_at=datetime.now(timezone.utc)
        )

        # No debe lanzar excepción aunque handler1 falle
        event_bus.publish(event)

        handler1.assert_called_once()
        handler2.assert_called_once()

    def test_async_handler_support(self, event_bus):
        """Debe soportar handlers asincronos."""
        async def async_handler(event):
            await asyncio.sleep(0.001)
            return "done"

        event_bus.subscribe(UserLoggedIn, async_handler)

        event = UserLoggedIn(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            occurred_at=datetime.now(timezone.utc)
        )

        # No debe lanzar excepción
        event_bus.publish(event)

    def test_handler_receives_correct_event(self, event_bus):
        """El handler debe recibir exactamente el evento publicado."""
        handler = Mock()
        event_bus.subscribe(UserLoggedIn, handler)

        tenant_id = str(uuid4())
        user_id = str(uuid4())
        now = datetime.now(timezone.utc)

        event = UserLoggedIn(
            tenant_id=tenant_id,
            user_id=user_id,
            occurred_at=now
        )

        event_bus.publish(event)

        # Verificar que recibió exactamente el evento
        args, kwargs = handler.call_args
        received_event = args[0]
        assert received_event.tenant_id == tenant_id
        assert received_event.user_id == user_id
        assert received_event.occurred_at == now

    def test_event_bus_handler_ordering(self, event_bus):
        """Debe llamar handlers en el orden registrado."""
        calls = []

        def handler1(event):
            calls.append(1)

        def handler2(event):
            calls.append(2)

        def handler3(event):
            calls.append(3)

        event_bus.subscribe(UserLoggedIn, handler1)
        event_bus.subscribe(UserLoggedIn, handler2)
        event_bus.subscribe(UserLoggedIn, handler3)

        event = UserLoggedIn(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            occurred_at=datetime.now(timezone.utc)
        )

        event_bus.publish(event)

        assert calls == [1, 2, 3]
