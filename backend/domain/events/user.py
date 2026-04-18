from dataclasses import dataclass
from datetime import datetime

from domain.events.base import DomainEvent


@dataclass(frozen=True)
class UserCreated(DomainEvent):
    tenant_id: str
    user_id: str
    email: str
    occurred_at: datetime
