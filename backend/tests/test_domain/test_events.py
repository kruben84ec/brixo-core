"""
Tests para domain/events/
Valida que los eventos de dominio se creen correctamente.
"""

import pytest
from uuid import uuid4
from datetime import datetime, timezone

from domain.events.auth import UserLoggedIn, UserLoginFailed, UserLoggedOut, UserAuthenticated
from domain.events.user import UserCreated


class TestUserLoggedInEvent:
    """Tests para el evento UserLoggedIn."""

    def test_user_logged_in_creation(self):
        """Debe crear evento UserLoggedIn válido."""
        tenant_id = str(uuid4())
        user_id = str(uuid4())
        now = datetime.now(timezone.utc)

        event = UserLoggedIn(
            tenant_id=tenant_id,
            user_id=user_id,
            occurred_at=now
        )

        assert event.tenant_id == tenant_id
        assert event.user_id == user_id
        assert event.occurred_at == now

    def test_user_logged_in_immutable(self):
        """Evento debe ser inmutable (frozen dataclass)."""
        event = UserLoggedIn(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            occurred_at=datetime.now(timezone.utc)
        )

        with pytest.raises(AttributeError):
            event.user_id = str(uuid4())


class TestUserLoginFailedEvent:
    """Tests para el evento UserLoginFailed."""

    def test_user_login_failed_creation(self):
        """Debe crear evento UserLoginFailed válido."""
        tenant_id = str(uuid4())
        username = "test@example.com"
        now = datetime.now(timezone.utc)

        event = UserLoginFailed(
            tenant_id=tenant_id,
            username=username,
            occurred_at=now
        )

        assert event.tenant_id == tenant_id
        assert event.username == username
        assert event.occurred_at == now

    def test_user_login_failed_no_tenant(self):
        """Debe permitir tenant_id nulo (usuario desconocido)."""
        event = UserLoginFailed(
            tenant_id=None,
            username="unknown@example.com",
            occurred_at=datetime.now(timezone.utc)
        )

        assert event.tenant_id is None
        assert event.username == "unknown@example.com"

    def test_user_login_failed_immutable(self):
        """Evento debe ser inmutable."""
        event = UserLoginFailed(
            tenant_id=str(uuid4()),
            username="test@example.com",
            occurred_at=datetime.now(timezone.utc)
        )

        with pytest.raises(AttributeError):
            event.username = "modified@example.com"


class TestUserLoggedOutEvent:
    """Tests para el evento UserLoggedOut."""

    def test_user_logged_out_creation(self):
        """Debe crear evento UserLoggedOut válido."""
        tenant_id = str(uuid4())
        user_id = str(uuid4())
        now = datetime.now(timezone.utc)

        event = UserLoggedOut(
            tenant_id=tenant_id,
            user_id=user_id,
            occurred_at=now
        )

        assert event.tenant_id == tenant_id
        assert event.user_id == user_id
        assert event.occurred_at == now

    def test_user_logged_out_immutable(self):
        """Evento debe ser inmutable."""
        event = UserLoggedOut(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            occurred_at=datetime.now(timezone.utc)
        )

        with pytest.raises(AttributeError):
            event.user_id = str(uuid4())


class TestUserAuthenticatedEvent:
    """Tests para el evento UserAuthenticated."""

    def test_user_authenticated_creation(self):
        """Debe crear evento UserAuthenticated válido."""
        tenant_id = str(uuid4())
        user_id = str(uuid4())
        now = datetime.now(timezone.utc)

        event = UserAuthenticated(
            tenant_id=tenant_id,
            user_id=user_id,
            occurred_at=now
        )

        assert event.tenant_id == tenant_id
        assert event.user_id == user_id
        assert event.occurred_at == now

    def test_user_authenticated_immutable(self):
        """Evento debe ser inmutable."""
        event = UserAuthenticated(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            occurred_at=datetime.now(timezone.utc)
        )

        with pytest.raises(AttributeError):
            event.tenant_id = str(uuid4())


class TestUserCreatedEvent:
    """Tests para el evento UserCreated."""

    def test_user_created_creation(self):
        """Debe crear evento UserCreated válido."""
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

        assert event.tenant_id == tenant_id
        assert event.user_id == user_id
        assert event.email == email
        assert event.occurred_at == now

    def test_user_created_immutable(self):
        """Evento debe ser inmutable."""
        event = UserCreated(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            email="test@example.com",
            occurred_at=datetime.now(timezone.utc)
        )

        with pytest.raises(AttributeError):
            event.email = "modified@example.com"


class TestEventTimestamps:
    """Tests para timestamps de eventos."""

    def test_event_timestamp_precision(self):
        """Timestamps deben preservarse con precisión."""
        now = datetime.now(timezone.utc)

        event = UserLoggedIn(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            occurred_at=now
        )

        assert event.occurred_at == now

    def test_event_timezone_aware(self):
        """Timestamps deben ser timezone-aware."""
        now = datetime.now(timezone.utc)

        event = UserLoggedIn(
            tenant_id=str(uuid4()),
            user_id=str(uuid4()),
            occurred_at=now
        )

        assert event.occurred_at.tzinfo is not None


class TestAuthEventConsistency:
    """Tests para consistencia de eventos de autenticación."""

    def test_all_auth_events_have_tenant_id(self):
        """Todos los eventos de auth deben tener tenant_id."""
        tenant_id = str(uuid4())
        now = datetime.now(timezone.utc)

        events = [
            UserLoggedIn(tenant_id=tenant_id, user_id=str(uuid4()), occurred_at=now),
            UserLoggedOut(tenant_id=tenant_id, user_id=str(uuid4()), occurred_at=now),
            UserAuthenticated(tenant_id=tenant_id, user_id=str(uuid4()), occurred_at=now),
        ]

        for event in events:
            assert event.tenant_id == tenant_id

    def test_auth_events_capture_user_id(self):
        """Eventos de auth deben capturar user_id."""
        user_id = str(uuid4())
        now = datetime.now(timezone.utc)

        events = [
            UserLoggedIn(tenant_id=str(uuid4()), user_id=user_id, occurred_at=now),
            UserLoggedOut(tenant_id=str(uuid4()), user_id=user_id, occurred_at=now),
            UserAuthenticated(tenant_id=str(uuid4()), user_id=user_id, occurred_at=now),
        ]

        for event in events:
            assert event.user_id == user_id
