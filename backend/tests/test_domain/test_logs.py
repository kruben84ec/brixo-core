"""
Tests para domain/logs.py
Valida que los modelos de auditoría sean correctos.
"""

import pytest
from uuid import uuid4, UUID
from datetime import datetime, timezone

from domain.logs import Actor, LogEntry, LogEventType, SYSTEM_USER_ID, SYSTEM_ACTOR


class TestLogEventType:
    """Tests para la enumeración LogEventType."""

    def test_log_event_types(self):
        """Debe tener todos los tipos de evento."""
        assert LogEventType.AUTH.value == "AUTH"
        assert LogEventType.INVENTORY.value == "INVENTORY"
        assert LogEventType.SALE.value == "SALE"
        assert LogEventType.SYNC.value == "SYNC"
        assert LogEventType.SECURITY.value == "SECURITY"
        assert LogEventType.SYSTEM.value == "SYSTEM"

    def test_log_event_type_count(self):
        """Debe tener exactamente 6 tipos."""
        types = list(LogEventType)
        assert len(types) == 6


class TestActor:
    """Tests para la entidad Actor."""

    def test_actor_creation(self):
        """Debe crear un Actor válido."""
        user_id = str(uuid4())
        tenant_id = str(uuid4())
        ip = "192.168.1.100"

        actor = Actor(
            user_id=user_id,
            tenant_id=tenant_id,
            ip=ip
        )

        assert actor.user_id == user_id
        assert actor.tenant_id == tenant_id
        assert actor.ip == ip

    def test_actor_no_ip(self):
        """Actor puede tener IP nula."""
        actor = Actor(
            user_id=str(uuid4()),
            tenant_id=str(uuid4()),
            ip=None
        )

        assert actor.ip is None

    def test_actor_immutable(self):
        """Actor debe ser inmutable (frozen dataclass)."""
        actor = Actor(
            user_id=str(uuid4()),
            tenant_id=str(uuid4()),
            ip="127.0.0.1"
        )

        with pytest.raises(AttributeError):
            actor.ip = "192.168.1.1"

    def test_actor_various_ips(self):
        """Actor debe aceptar diferentes formatos de IP."""
        ips = [
            "127.0.0.1",
            "192.168.0.1",
            "10.0.0.1",
            "255.255.255.255",
            "::1",  # IPv6
            "2001:db8::1",  # IPv6
        ]

        for ip in ips:
            actor = Actor(
                user_id=str(uuid4()),
                tenant_id=str(uuid4()),
                ip=ip
            )
            assert actor.ip == ip


class TestLogEntry:
    """Tests para la entidad LogEntry."""

    def test_log_entry_creation(self):
        """Debe crear un LogEntry válido."""
        entry_id = str(uuid4())
        tenant_id = str(uuid4())
        user_id = str(uuid4())
        entity_id = str(uuid4())
        now = datetime.now(timezone.utc)

        actor = Actor(user_id=user_id, tenant_id=tenant_id, ip="127.0.0.1")

        log_entry = LogEntry(
            id=entry_id,
            tenant_id=tenant_id,
            actor=actor,
            event_type=LogEventType.AUTH,
            entity="USER",
            entity_id=entity_id,
            action="CREATED",
            payload={"email": "user@example.com"},
            occurred_at=now
        )

        assert log_entry.id == entry_id
        assert log_entry.tenant_id == tenant_id
        assert log_entry.actor == actor
        assert log_entry.event_type == LogEventType.AUTH
        assert log_entry.entity == "USER"
        assert log_entry.entity_id == entity_id
        assert log_entry.action == "CREATED"
        assert log_entry.payload["email"] == "user@example.com"
        assert log_entry.occurred_at == now

    def test_log_entry_immutable(self):
        """LogEntry debe ser inmutable."""
        log_entry = LogEntry(
            id=str(uuid4()),
            tenant_id=str(uuid4()),
            actor=Actor(user_id=str(uuid4()), tenant_id=str(uuid4()), ip=None),
            event_type=LogEventType.AUTH,
            entity="USER",
            entity_id=str(uuid4()),
            action="CREATED",
            payload={},
            occurred_at=datetime.now(timezone.utc)
        )

        with pytest.raises(AttributeError):
            log_entry.entity = "MODIFIED"

    def test_log_entry_no_entity_id(self):
        """LogEntry puede tener entity_id nulo."""
        log_entry = LogEntry(
            id=str(uuid4()),
            tenant_id=str(uuid4()),
            actor=Actor(user_id=str(uuid4()), tenant_id=str(uuid4()), ip=None),
            event_type=LogEventType.SYSTEM,
            entity="SYSTEM",
            entity_id=None,
            action="STARTUP",
            payload={},
            occurred_at=datetime.now(timezone.utc)
        )

        assert log_entry.entity_id is None

    def test_log_entry_various_events(self):
        """LogEntry debe funcionar con diferentes tipos de evento."""
        tenant_id = str(uuid4())
        actor = Actor(user_id=str(uuid4()), tenant_id=tenant_id, ip=None)

        event_types = [
            (LogEventType.AUTH, "USER", "LOGIN"),
            (LogEventType.INVENTORY, "PRODUCT", "CREATED"),
            (LogEventType.SALE, "SALE", "REGISTERED"),
            (LogEventType.SYNC, "INVENTORY", "SYNCED"),
            (LogEventType.SECURITY, "USER", "PASSWORD_CHANGED"),
            (LogEventType.SYSTEM, "SYSTEM", "STARTUP"),
        ]

        for event_type, entity, action in event_types:
            log_entry = LogEntry(
                id=str(uuid4()),
                tenant_id=tenant_id,
                actor=actor,
                event_type=event_type,
                entity=entity,
                entity_id=str(uuid4()),
                action=action,
                payload={},
                occurred_at=datetime.now(timezone.utc)
            )

            assert log_entry.event_type == event_type
            assert log_entry.entity == entity
            assert log_entry.action == action

    def test_log_entry_payload_various_data(self):
        """LogEntry payload debe soportar diversos datos."""
        tenant_id = str(uuid4())
        actor = Actor(user_id=str(uuid4()), tenant_id=tenant_id, ip=None)

        payloads = [
            {},
            {"user_id": "123"},
            {"email": "user@example.com", "username": "john"},
            {"product_id": "456", "quantity": 10, "price": 99.99},
            {"nested": {"key": "value", "array": [1, 2, 3]}},
        ]

        for payload in payloads:
            log_entry = LogEntry(
                id=str(uuid4()),
                tenant_id=tenant_id,
                actor=actor,
                event_type=LogEventType.SYSTEM,
                entity="TEST",
                entity_id=None,
                action="TEST",
                payload=payload,
                occurred_at=datetime.now(timezone.utc)
            )

            assert log_entry.payload == payload


class TestSystemConstants:
    """Tests para constantes de sistema."""

    def test_system_user_id(self):
        """SYSTEM_USER_ID debe ser el UUID null."""
        assert SYSTEM_USER_ID == "00000000-0000-0000-0000-000000000000"

    def test_system_user_id_is_valid_uuid(self):
        """SYSTEM_USER_ID debe ser un UUID válido."""
        uuid_obj = UUID(SYSTEM_USER_ID)
        assert uuid_obj.version == 0  # Nil UUID

    def test_system_actor(self):
        """SYSTEM_ACTOR debe ser un Actor válido."""
        assert SYSTEM_ACTOR.user_id == SYSTEM_USER_ID
        assert SYSTEM_ACTOR.tenant_id == SYSTEM_USER_ID
        assert SYSTEM_ACTOR.ip is None

    def test_system_actor_immutable(self):
        """SYSTEM_ACTOR debe ser inmutable."""
        with pytest.raises(AttributeError):
            SYSTEM_ACTOR.ip = "192.168.1.1"


class TestLogAuditRequirements:
    """Tests para los requisitos de auditoría."""

    def test_log_entry_immutability_requirement(self):
        """Logs deben ser inmutables (no editable)."""
        log_entry = LogEntry(
            id=str(uuid4()),
            tenant_id=str(uuid4()),
            actor=Actor(user_id=str(uuid4()), tenant_id=str(uuid4()), ip=None),
            event_type=LogEventType.AUTH,
            entity="USER",
            entity_id=str(uuid4()),
            action="CREATED",
            payload={},
            occurred_at=datetime.now(timezone.utc)
        )

        # No debe permitir modificación
        with pytest.raises(AttributeError):
            log_entry.id = str(uuid4())

    def test_log_entry_tenant_isolation(self):
        """Logs deben incluir tenant_id para aislamiento."""
        tenant1_id = str(uuid4())
        tenant2_id = str(uuid4())

        log1 = LogEntry(
            id=str(uuid4()),
            tenant_id=tenant1_id,
            actor=Actor(user_id=str(uuid4()), tenant_id=tenant1_id, ip=None),
            event_type=LogEventType.AUTH,
            entity="USER",
            entity_id=str(uuid4()),
            action="LOGIN",
            payload={},
            occurred_at=datetime.now(timezone.utc)
        )

        log2 = LogEntry(
            id=str(uuid4()),
            tenant_id=tenant2_id,
            actor=Actor(user_id=str(uuid4()), tenant_id=tenant2_id, ip=None),
            event_type=LogEventType.AUTH,
            entity="USER",
            entity_id=str(uuid4()),
            action="LOGIN",
            payload={},
            occurred_at=datetime.now(timezone.utc)
        )

        # Logs de diferentes tenants deben ser distinguibles
        assert log1.tenant_id != log2.tenant_id
        assert log1.tenant_id == tenant1_id
        assert log2.tenant_id == tenant2_id
