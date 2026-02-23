from dataclasses import dataclass
from enum import Enum
from uuid import UUID 
from datetime import datetime

class LogEventType(Enum):
    AUTH = "AUTH"
    INVENTORY = "INVENTORY"
    SALE = "SALE"
    SYNC = "SYNC"
    SECURITY = "SECURITY"
    SYSTEM = "SYSTEM"

@dataclass(frozen=True)
class Actor:
    user_id: str
    tenant_id: str
    ip: str | None 

@dataclass(frozen=True)
class LogEntry:
    """
        # 1. Ningún LogEntry se edita
        # 2. Ningún LogEntry se borra
        # 3. Todo cambio de dominio genera un LogEntry
        # 4. Logs siempre usan tenant_id
        # 5. Logs sobreviven incluso si la sincronización falla
    """
    id: str
    tenant_id: str
    actor: Actor
    event_type: LogEventType
    entity: str              # INVENTORY, USER, SALE, ROLE
    entity_id: str | None
    action: str              # CREATED, UPDATED, DELETED, SYNCED
    payload: dict            # Qué cambió
    occurred_at: datetime

SYSTEM_USER_ID = str(UUID("00000000-0000-0000-0000-000000000000"))

SYSTEM_ACTOR = Actor(
    user_id=SYSTEM_USER_ID,
    tenant_id=SYSTEM_USER_ID,
    ip=None
)
