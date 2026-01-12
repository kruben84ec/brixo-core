from uuid import uuid4
from datetime import datetime, timezone

from backend.application.event_bus import EventBus
from backend.domain.events import InventoryChanged, RoleAssigned, SaleRegistered
from backend.domain.logs import LogEntry, LogEventType, SYSTEM_ACTOR
from backend.infrastructure.logging import get_logger
logger = get_logger()

def handle_inventory_changed(event: InventoryChanged):
    logger.info(
        "Inventory changed",
        extra={
            "tenant_id": str(event.tenant_id),
            "product_id": str(event.product_id),
            "delta": event.delta
        }
    )

    domain_log = LogEntry(
        id=uuid4(),
        tenant_id=event.tenant_id,
        actor=SYSTEM_ACTOR,  # Se resolverá por contexto (API, POS, sync)
        event_type=LogEventType.INVENTORY,
        entity="PRODUCT",
        entity_id=event.product_id,
        action="STOCK_CHANGED",
        payload={"delta": event.delta},
        occurred_at=event.occurred_at
    )

def handle_role_assigned(event: RoleAssigned):
    logger.info(
        "Role assigned",
        extra={
            "tenant_id": str(event.tenant_id),
            "user_id": str(event.user_id),
            "role_id": str(event.role_id)
        }
    )

    domain_log = LogEntry(
        id=uuid4(),
        tenant_id=event.tenant_id,
        actor=SYSTEM_ACTOR,
        event_type=LogEventType.AUTH,
        entity="USER_ROLE",
        entity_id=event.user_id,
        action="ROLE_ASSIGNED",
        payload={"role_id": str(event.role_id)},
        occurred_at=event.occurred_at
    )

def handle_sale_registered(event: SaleRegistered):
    logger.info(
        "Sale registered",
        extra={
            "tenant_id": str(event.tenant_id),
            "sale_id": str(event.sale_id),
            "total": event.total
        }
    )

    domain_log = LogEntry(
        id=uuid4(),
        tenant_id=event.tenant_id,
        actor=SYSTEM_ACTOR,
        event_type=LogEventType.SALE,
        entity="SALE",
        entity_id=event.sale_id,
        action="SALE_CREATED",
        payload={"total": event.total},
        occurred_at=event.occurred_at
    )

def register_handlers(event_bus: EventBus):
    event_bus.subscribe(InventoryChanged, handle_inventory_changed)
    event_bus.subscribe(RoleAssigned, handle_role_assigned)
    event_bus.subscribe(SaleRegistered, handle_sale_registered)
