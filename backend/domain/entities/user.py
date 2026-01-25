# backend/domain/entities/user.py

from dataclasses import dataclass

@dataclass
class User:
    id: str
    tenant_id: str
    email: str
    password_hash: str
    is_active: bool
