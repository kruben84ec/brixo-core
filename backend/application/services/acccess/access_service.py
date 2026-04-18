from typing import List, Dict
from application.ports.access_repository import AccessRepository
from infrastructure.logging import get_logger

logger = get_logger()

class AccessService:
    def __init__(self, access_repository: AccessRepository):
        self.access_repository = access_repository

    async def get_user_access(self, user_id: str, tenant_id: str) -> Dict:
        logger.info(f"Obteniendo roles para el usuario {user_id} en el tenant {tenant_id}")
        roles = await self.access_repository.get_roles_by_user(user_id, tenant_id)
        permissions = await self.access_repository.get_permissions_by_roles(role_id=roles, tenant_id=tenant_id)
        logger.info(f"Roles obtenidos para el usuario {user_id}: {roles}")
        
        return {
            "roles": roles,
            "permissions": permissions
        }

