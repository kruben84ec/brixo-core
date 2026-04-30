"""
Tests para domain/contracts.py
Valida la creación y propiedades de entidades de dominio.
"""

import pytest
from datetime import datetime, timezone
from uuid import uuid4

from domain.contracts import (
    Tenant,
    User,
    Role,
    Permission,
    UserRole,
    AuthorityLevel,
    ConnectionState,
    WritePolicy,
    SyncEvent,
)


class TestTenant:
    """Tests para la entidad Tenant."""

    def test_tenant_creation(self):
        """Debe crear un Tenant válido."""
        tenant_id = uuid4()
        now = datetime.now(timezone.utc)

        tenant = Tenant(
            id=tenant_id,
            name="Acme Corp",
            is_active=True,
            created_at=now
        )

        assert tenant.id == tenant_id
        assert tenant.name == "Acme Corp"
        assert tenant.is_active is True
        assert tenant.created_at == now

    def test_tenant_immutable(self):
        """Tenant debe ser inmutable (frozen dataclass)."""
        tenant = Tenant(
            id=uuid4(),
            name="Test",
            is_active=True,
            created_at=datetime.now(timezone.utc)
        )

        with pytest.raises(AttributeError):
            tenant.name = "Modified"

    def test_tenant_inactive(self):
        """Debe permitir crear un Tenant inactivo."""
        tenant = Tenant(
            id=uuid4(),
            name="Inactive",
            is_active=False,
            created_at=datetime.now(timezone.utc)
        )
        assert tenant.is_active is False


class TestUser:
    """Tests para la entidad User."""

    def test_user_creation(self):
        """Debe crear un User válido."""
        user_id = uuid4()
        tenant_id = uuid4()

        user = User(
            id=user_id,
            tenant_id=tenant_id,
            username="john_doe",
            email="john@example.com",
            is_active=True,
            authority_level=AuthorityLevel.OPERATOR
        )

        assert user.id == user_id
        assert user.tenant_id == tenant_id
        assert user.username == "john_doe"
        assert user.email == "john@example.com"
        assert user.is_active is True
        assert user.authority_level == AuthorityLevel.OPERATOR

    def test_user_immutable(self):
        """User debe ser inmutable."""
        user = User(
            id=uuid4(),
            tenant_id=uuid4(),
            username="test",
            email="test@test.com",
            is_active=True,
            authority_level=AuthorityLevel.OPERATOR
        )

        with pytest.raises(AttributeError):
            user.email = "modified@test.com"

    def test_user_authority_levels(self):
        """Debe soportar todos los niveles de autoridad."""
        tenant_id = uuid4()

        for level in AuthorityLevel:
            user = User(
                id=uuid4(),
                tenant_id=tenant_id,
                username=f"user_{level.value}",
                email=f"user_{level.value}@test.com",
                is_active=True,
                authority_level=level
            )
            assert user.authority_level == level

    def test_user_inactive(self):
        """Debe permitir crear un User inactivo."""
        user = User(
            id=uuid4(),
            tenant_id=uuid4(),
            username="inactive",
            email="inactive@test.com",
            is_active=False,
            authority_level=AuthorityLevel.OPERATOR
        )
        assert user.is_active is False


class TestRole:
    """Tests para la entidad Role."""

    def test_role_creation(self):
        """Debe crear un Role válido."""
        role_id = uuid4()
        tenant_id = uuid4()

        role = Role(
            id=role_id,
            tenant_id=tenant_id,
            name="Manager"
        )

        assert role.id == role_id
        assert role.tenant_id == tenant_id
        assert role.name == "Manager"

    def test_role_immutable(self):
        """Role debe ser inmutable."""
        role = Role(
            id=uuid4(),
            tenant_id=uuid4(),
            name="Test"
        )

        with pytest.raises(AttributeError):
            role.name = "Modified"


class TestPermission:
    """Tests para la entidad Permission."""

    def test_permission_creation(self):
        """Debe crear una Permission válida."""
        permission = Permission(code="INVENTORY_WRITE")
        assert permission.code == "INVENTORY_WRITE"

    def test_permission_immutable(self):
        """Permission debe ser inmutable."""
        permission = Permission(code="INVENTORY_WRITE")

        with pytest.raises(AttributeError):
            permission.code = "MODIFIED"

    def test_permission_various_codes(self):
        """Debe soportar diferentes códigos de permiso."""
        codes = [
            "INVENTORY_WRITE",
            "INVENTORY_READ",
            "SALES_WRITE",
            "ADMIN_USERS",
            "REPORTS_READ"
        ]

        for code in codes:
            permission = Permission(code=code)
            assert permission.code == code


class TestUserRole:
    """Tests para la entidad UserRole."""

    def test_user_role_creation(self):
        """Debe crear una relación UserRole válida."""
        user_id = uuid4()
        role_id = uuid4()
        assigned_by = uuid4()
        now = datetime.now(timezone.utc)

        user_role = UserRole(
            user_id=user_id,
            role_id=role_id,
            assigned_by=assigned_by,
            assigned_at=now
        )

        assert user_role.user_id == user_id
        assert user_role.role_id == role_id
        assert user_role.assigned_by == assigned_by
        assert user_role.assigned_at == now

    def test_user_role_immutable(self):
        """UserRole debe ser inmutable."""
        user_role = UserRole(
            user_id=uuid4(),
            role_id=uuid4(),
            assigned_by=uuid4(),
            assigned_at=datetime.now(timezone.utc)
        )

        with pytest.raises(AttributeError):
            user_role.user_id = uuid4()


class TestAuthority:
    """Tests para la jerarquía de autoridades."""

    def test_authority_level_enum(self):
        """Debe tener los 4 niveles de autoridad."""
        assert AuthorityLevel.OWNER.value == "OWNER"
        assert AuthorityLevel.ADMIN.value == "ADMIN"
        assert AuthorityLevel.MANAGER.value == "MANAGER"
        assert AuthorityLevel.OPERATOR.value == "OPERATOR"


class TestConnectionState:
    """Tests para estados de conexión."""

    def test_connection_states(self):
        """Debe tener los 3 estados de conexión."""
        assert ConnectionState.ONLINE.value == "ONLINE"
        assert ConnectionState.DEGRADED.value == "DEGRADED"
        assert ConnectionState.OFFLINE.value == "OFFLINE"


class TestWritePolicy:
    """Tests para políticas de escritura."""

    def test_write_policies(self):
        """Debe tener las 3 políticas de escritura."""
        assert WritePolicy.SERVER_WINS.value == "SERVER_WINS"
        assert WritePolicy.CLIENT_WINS.value == "CLIENT_WINS"
        assert WritePolicy.MERGE_REQUIRED.value == "MERGE_REQUIRED"


class TestSyncEvent:
    """Tests para eventos de sincronización."""

    def test_sync_event_creation(self):
        """Debe crear un SyncEvent válido."""
        tenant_id = uuid4()
        user_id = uuid4()
        entity_id = uuid4()
        now = datetime.now(timezone.utc)

        event = SyncEvent(
            tenant_id=tenant_id,
            user_id=user_id,
            entity="INVENTORY",
            entity_id=entity_id,
            version=1,
            occurred_at=now
        )

        assert event.tenant_id == tenant_id
        assert event.user_id == user_id
        assert event.entity == "INVENTORY"
        assert event.entity_id == entity_id
        assert event.version == 1
        assert event.occurred_at == now

    def test_sync_event_immutable(self):
        """SyncEvent debe ser inmutable."""
        event = SyncEvent(
            tenant_id=uuid4(),
            user_id=uuid4(),
            entity="INVENTORY",
            entity_id=uuid4(),
            version=1,
            occurred_at=datetime.now(timezone.utc)
        )

        with pytest.raises(AttributeError):
            event.version = 2
