"""
Tests para application/services/auth/login_user.py
Valida que el login funcione correctamente y publique eventos.
"""

import pytest
from uuid import uuid4
from datetime import datetime, timezone
from unittest.mock import Mock
from dataclasses import dataclass

from application.services.auth.login_user import LoginUser
from application.event_bus import EventBus
from domain.contracts import User, AuthorityLevel
from domain.events.auth import UserLoggedIn, UserLoginFailed
from domain.exceptions import UnauthorizedError
from infrastructure.security.passwords import hash_password


@dataclass
class MockUser:
    """Mock de User para simular respuesta del repositorio."""
    id: str
    tenant_id: str
    email: str
    password_hash: str
    username: str
    is_active: bool
    authority_level: str


class TestLoginUser:
    """Tests para el caso de uso LoginUser."""

    def test_login_user_creation(self, mock_auth_repository, event_bus):
        """Debe crear una instancia de LoginUser."""
        login_user = LoginUser(mock_auth_repository, event_bus)

        assert login_user.auth_repository == mock_auth_repository
        assert login_user.event_bus == event_bus

    def test_login_user_success(self, mock_auth_repository, event_bus):
        """Debe loguearse con credenciales válidas."""
        # Setup
        email = "user@example.com"
        password = "CorrectPassword123!"
        user_id = str(uuid4())
        tenant_id = str(uuid4())

        hashed_password = hash_password(password)

        mock_user = MockUser(
            id=user_id,
            tenant_id=tenant_id,
            email=email,
            password_hash=hashed_password,
            username="testuser",
            is_active=True,
            authority_level="OPERATOR"
        )

        mock_auth_repository.get_user_by_email.return_value = mock_user

        # Crear handler para verificar evento
        handler = Mock()
        event_bus.subscribe(UserLoggedIn, handler)

        # Execute
        login_user = LoginUser(mock_auth_repository, event_bus)
        result = login_user.execute(email, password)

        # Verify
        assert result.id == user_id
        assert result.email == email
        mock_auth_repository.get_user_by_email.assert_called_once_with(email)

    def test_login_user_publishes_event(self, mock_auth_repository, event_bus):
        """Debe publicar evento UserLoggedIn al loguearse."""
        email = "user@example.com"
        password = "CorrectPassword123!"
        user_id = str(uuid4())
        tenant_id = str(uuid4())

        hashed_password = hash_password(password)

        mock_user = MockUser(
            id=user_id,
            tenant_id=tenant_id,
            email=email,
            password_hash=hashed_password,
            username="testuser",
            is_active=True,
            authority_level="OPERATOR"
        )

        mock_auth_repository.get_user_by_email.return_value = mock_user

        # Crear handler para capturar evento
        handler = Mock()
        event_bus.subscribe(UserLoggedIn, handler)

        # Execute
        login_user = LoginUser(mock_auth_repository, event_bus)
        login_user.execute(email, password)

        # Verify evento publicado
        handler.assert_called_once()
        event = handler.call_args[0][0]
        assert isinstance(event, UserLoggedIn)
        assert event.tenant_id == tenant_id
        assert event.user_id == user_id

    def test_login_user_invalid_password(self, mock_auth_repository, event_bus):
        """Debe fallar con password incorrecto."""
        email = "user@example.com"
        correct_password = "CorrectPassword123!"
        wrong_password = "WrongPassword456!"
        user_id = str(uuid4())
        tenant_id = str(uuid4())

        hashed_password = hash_password(correct_password)

        mock_user = MockUser(
            id=user_id,
            tenant_id=tenant_id,
            email=email,
            password_hash=hashed_password,
            username="testuser",
            is_active=True,
            authority_level="OPERATOR"
        )

        mock_auth_repository.get_user_by_email.return_value = mock_user

        # Execute & Verify
        login_user = LoginUser(mock_auth_repository, event_bus)

        with pytest.raises(UnauthorizedError) as exc_info:
            login_user.execute(email, wrong_password)

        assert "Credenciales inválidas" in str(exc_info.value.message)

    def test_login_user_not_found(self, mock_auth_repository, event_bus):
        """Debe fallar si usuario no existe."""
        email = "nonexistent@example.com"
        password = "AnyPassword123!"

        mock_auth_repository.get_user_by_email.return_value = None

        # Execute & Verify
        login_user = LoginUser(mock_auth_repository, event_bus)

        with pytest.raises(UnauthorizedError) as exc_info:
            login_user.execute(email, password)

        assert "Credenciales inválidas" in str(exc_info.value.message)

    def test_login_user_publishes_failure_event(self, mock_auth_repository, event_bus):
        """Debe publicar evento UserLoginFailed al fallar."""
        email = "user@example.com"
        password = "WrongPassword123!"
        user_id = str(uuid4())
        tenant_id = str(uuid4())

        correct_password = "CorrectPassword123!"
        hashed_password = hash_password(correct_password)

        mock_user = MockUser(
            id=user_id,
            tenant_id=tenant_id,
            email=email,
            password_hash=hashed_password,
            username="testuser",
            is_active=True,
            authority_level="OPERATOR"
        )

        mock_auth_repository.get_user_by_email.return_value = mock_user

        # Capturar evento de fallo
        handler = Mock()
        event_bus.subscribe(UserLoginFailed, handler)

        login_user = LoginUser(mock_auth_repository, event_bus)

        with pytest.raises(UnauthorizedError):
            login_user.execute(email, password)

        # Verificar que se publicó evento de fallo
        handler.assert_called_once()
        event = handler.call_args[0][0]
        assert isinstance(event, UserLoginFailed)
        assert event.username == email
        assert event.tenant_id == tenant_id

    def test_login_user_not_found_publishes_failure(self, mock_auth_repository, event_bus):
        """Debe publicar UserLoginFailed si usuario no existe."""
        email = "nonexistent@example.com"
        password = "AnyPassword123!"

        mock_auth_repository.get_user_by_email.return_value = None

        handler = Mock()
        event_bus.subscribe(UserLoginFailed, handler)

        login_user = LoginUser(mock_auth_repository, event_bus)

        with pytest.raises(UnauthorizedError):
            login_user.execute(email, password)

        handler.assert_called_once()
        event = handler.call_args[0][0]
        assert isinstance(event, UserLoginFailed)
        assert event.username == email
        assert event.tenant_id is None

    def test_login_user_password_verification_error(self, mock_auth_repository, event_bus):
        """Debe manejar errores en verificación de password."""
        email = "user@example.com"
        password = "SomePassword123!"
        user_id = str(uuid4())
        tenant_id = str(uuid4())

        mock_user = MockUser(
            id=user_id,
            tenant_id=tenant_id,
            email=email,
            password_hash="invalid_hash_format",
            username="testuser",
            is_active=True,
            authority_level="OPERATOR"
        )

        mock_auth_repository.get_user_by_email.return_value = mock_user

        login_user = LoginUser(mock_auth_repository, event_bus)

        # Debe fallar (ya que el hash es inválido)
        with pytest.raises(UnauthorizedError):
            login_user.execute(email, password)

    def test_login_user_returns_user_object(self, mock_auth_repository, event_bus):
        """Debe retornar el objeto User al loguearse."""
        email = "user@example.com"
        password = "CorrectPassword123!"
        user_id = str(uuid4())
        tenant_id = str(uuid4())

        hashed_password = hash_password(password)

        mock_user = MockUser(
            id=user_id,
            tenant_id=tenant_id,
            email=email,
            password_hash=hashed_password,
            username="testuser",
            is_active=True,
            authority_level="OPERATOR"
        )

        mock_auth_repository.get_user_by_email.return_value = mock_user

        login_user = LoginUser(mock_auth_repository, event_bus)
        result = login_user.execute(email, password)

        assert result == mock_user
        assert result.email == email
        assert result.id == user_id

    def test_login_user_error_has_details(self, mock_auth_repository, event_bus):
        """UnauthorizedError debe incluir detalles técnicos."""
        email = "user@example.com"
        password = "WrongPassword123!"

        correct_password = "CorrectPassword123!"
        hashed_password = hash_password(correct_password)

        mock_user = MockUser(
            id=str(uuid4()),
            tenant_id=str(uuid4()),
            email=email,
            password_hash=hashed_password,
            username="testuser",
            is_active=True,
            authority_level="OPERATOR"
        )

        mock_auth_repository.get_user_by_email.return_value = mock_user

        login_user = LoginUser(mock_auth_repository, event_bus)

        with pytest.raises(UnauthorizedError) as exc_info:
            login_user.execute(email, password)

        exc = exc_info.value
        assert exc.message == "Credenciales inválidas"
        assert "Failed login attempt" in exc.detail
        assert email in exc.detail
