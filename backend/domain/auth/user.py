from dataclasses import dataclass
from uuid import  UUID

@dataclass
class User:
    id: UUID
    tenant_id: UUID
    email:str
    password_hash:str
    is_activate:bool

