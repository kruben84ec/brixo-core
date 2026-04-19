from typing import Dict

from application.ports.access_repository import AccessRepository
from infrastructure.logging import get_logger

logger = get_logger()


class AccessService:
    def __init__(self, access_repository: AccessRepository):
        self.access_repository = access_repository

    async def get_user_access(self, user_id: str, tenant_id: str) -> Dict:
        roles = await self.access_repository.get_roles_by_user(user_id, tenant_id)
        permissions = await self.access_repository.get_permissions_by_roles(
            role_id=roles, tenant_id=tenant_id
        )
        logger.info(
            "user_access_loaded",
            extra={"user_id": user_id, "tenant_id": tenant_id, "roles_count": len(roles)},
        )
        return {"roles": roles, "permissions": permissions}
