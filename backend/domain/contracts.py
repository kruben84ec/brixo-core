from enum import Enum
from dataclasses import dataclass
from typing import Optional
from uuid import UUID
from datetime import datetime

@dataclass(frozen=True)
class Tenant:
    """
    Representa a una empresa/tienda /negocio que utiliza la plataforma.
    """
    id: UUID
    name: str
    is_active: bool
    created_at: datetime
    
@dataclass(frozen=True)
class User:
    """
    Representa a un usuario dentro de la plataforma.
    """
    id: UUID
    tenant_id: UUID
    username: str
    email: str
    is_active: bool
    authority_level: 'AuthorityLevel'
    
class AuthorityLevel(Enum):
    """
    Niveles de autoridad para los usuarios.
    Solo OWNER y ADMIN pueden modificar permisos de otros.
    """
    OWNER = "OWNER"        # Dueño del negocio
    ADMIN = "ADMIN"        # Administrador delegado
    MANAGER = "MANAGER"    # Jefe de tienda
    OPERATOR = "OPERATOR"  # Cajero / empleado
    
@dataclass(frozen=True)
class Role:
    """
    Representa un rol asignable a los usuarios.
    """
    id: UUID
    tenant_id: UUID
    name: str

@dataclass(frozen=True)
class Permission:
    """
    Representa un permiso específico dentro del sistema.
    """
    code:str  # e.g. INVENTORY_WRITE, SALES_READ, ADMIN_USERS

@dataclass(frozen=True)
class UserRole:
    user_id: UUID
    role_id: UUID
    assigned_by: UUID        # User que lo asignó
    assigned_at: datetime
    

class ConnectionState(Enum):
    """
    El semáforo de resiliencia
    """
    ONLINE = "ONLINE"
    DEGRADED = "DEGRADED"     # SRI lento, red inestable
    OFFLINE = "OFFLINE"

class WritePolicy(Enum):
    """
    Define quién tiene la verdad cuando hay conflicto.
    """
    SERVER_WINS = "SERVER_WINS"
    CLIENT_WINS = "CLIENT_WINS"
    MERGE_REQUIRED = "MERGE_REQUIRED"

@dataclass(frozen=True)
class SyncEvent:
    """
    Lo que viaja por WebSockets
    """
    tenant_id: UUID
    user_id: UUID
    entity: str            # INVENTORY, USER_ROLE, SALE
    entity_id: UUID
    version: int
    occurred_at: datetime
