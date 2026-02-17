from dataclasses import dataclass

from datetime import datetime
from domain.events.base import DomainEvent


@dataclass(frozen=True)
class UserLoggedIn(DomainEvent):
    tenant_id: str
    user_id: str
    occurred_at: datetime


@dataclass(frozen=True)
class UserLoginFailed(DomainEvent):
    tenant_id: str | None
    username: str
    occurred_at: datetime


@dataclass(frozen=True)
class UserLoggedOut(DomainEvent):
    tenant_id: str
    user_id: str
    occurred_at: datetime
    
    
@dataclass(frozen=True)
class UserAuthenticated(DomainEvent):
    tenant_id: str
    user_id: str
    occurred_at: datetime
