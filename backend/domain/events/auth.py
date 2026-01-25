from dataclasses import dataclass
from uuid import UUID
from datetime import datetime
from backend.domain.events.base import DomainEvent


@dataclass(frozen=True)
class UserLoggedIn(DomainEvent):
    tenant_id: UUID
    user_id: UUID
    occurred_at: datetime


@dataclass(frozen=True)
class UserLoginFailed(DomainEvent):
    tenant_id: UUID | None
    username: str
    occurred_at: datetime


@dataclass(frozen=True)
class UserLoggedOut(DomainEvent):
    tenant_id: UUID
    user_id: UUID
    occurred_at: datetime
    
    
@dataclass(frozen=True)
class UserAuthenticated(DomainEvent):
    tenant_id: UUID
    user_id: UUID
    occurred_at: datetime
