from dataclasses import dataclass
from uuid import UUID
from datetime import datetime

from backend.domain.events import DomainEvent

@dataclass
class UserLoggedIn(DomainEvent):
    tenant_id: UUID
    user_id: UUID
    ocurred_at: datetime