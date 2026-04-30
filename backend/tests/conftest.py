"""
Fixtures compartidas para todos los tests.
"""

import pytest
from uuid import uuid4
from datetime import datetime, timezone
from unittest.mock import Mock, MagicMock

from application.event_bus import EventBus
from domain.contracts import User, Tenant, Role, AuthorityLevel, Permission
from domain.logs import LogEntry, Actor, LogEventType
from infrastructure.security.passwords import hash_password


@pytest.fixture
def event_bus():
    """EventBus instance para tests."""
    return EventBus()


@pytest.fixture
def tenant_id():
    """ID de tenant para tests."""
    return str(uuid4())


@pytest.fixture
def user_id():
    """ID de usuario para tests."""
    return str(uuid4())


@pytest.fixture
def tenant(tenant_id):
    """Instancia de Tenant para tests."""
    return Tenant(
        id=tenant_id,
        name="Test Company",
        is_active=True,
        created_at=datetime.now(timezone.utc)
    )


@pytest.fixture
def user(tenant_id, user_id):
    """Instancia de User para tests."""
    return User(
        id=user_id,
        tenant_id=tenant_id,
        username="testuser",
        email="test@example.com",
        is_active=True,
        authority_level=AuthorityLevel.OPERATOR
    )


@pytest.fixture
def admin_user(tenant_id):
    """Instancia de User ADMIN para tests."""
    return User(
        id=str(uuid4()),
        tenant_id=tenant_id,
        username="admin",
        email="admin@example.com",
        is_active=True,
        authority_level=AuthorityLevel.ADMIN
    )


@pytest.fixture
def role(tenant_id):
    """Instancia de Role para tests."""
    return Role(
        id=str(uuid4()),
        tenant_id=tenant_id,
        name="Manager"
    )


@pytest.fixture
def permission():
    """Instancia de Permission para tests."""
    return Permission(code="INVENTORY_WRITE")


@pytest.fixture
def log_entry(tenant_id, user_id):
    """Instancia de LogEntry para tests."""
    return LogEntry(
        id=str(uuid4()),
        tenant_id=tenant_id,
        actor=Actor(user_id=user_id, tenant_id=tenant_id, ip="127.0.0.1"),
        event_type=LogEventType.AUTH,
        entity="USER",
        entity_id=user_id,
        action="LOGIN",
        payload={"test": "data"},
        occurred_at=datetime.now(timezone.utc)
    )


@pytest.fixture
def mock_auth_repository():
    """Mock de AuthRepository."""
    mock = Mock()
    mock.get_user_by_email = Mock()
    mock.create_user = Mock()
    mock.get_user_by_id = Mock()
    return mock


@pytest.fixture
def mock_audit_log_repository():
    """Mock de AuditLogRepository."""
    mock = Mock()
    mock.save_log_entry = Mock()
    mock.get_logs_by_tenant = Mock(return_value=[])
    return mock


@pytest.fixture
def mock_user_repository():
    """Mock de UserRepository."""
    mock = Mock()
    mock.create = Mock()
    mock.get_by_id = Mock()
    mock.get_by_email = Mock()
    mock.get_all_by_tenant = Mock()
    return mock


@pytest.fixture
def mock_access_repository():
    """Mock de AccessRepository."""
    mock = Mock()
    mock.assign_role = Mock()
    mock.revoke_role = Mock()
    mock.get_user_roles = Mock(return_value=[])
    return mock


@pytest.fixture
def valid_password():
    """Password hasheado válido para tests."""
    plain = "TestPassword123!"
    return hash_password(plain), plain


@pytest.fixture
def jwt_token_payload(tenant_id, user_id):
    """Payload típico de JWT para tests."""
    return {
        "sub": user_id,
        "tenant_id": tenant_id,
        "email": "test@example.com",
        "authority_level": "OPERATOR",
        "exp": datetime.now(timezone.utc).timestamp() + 3600
    }
