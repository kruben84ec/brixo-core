from typing import List
from application.ports.access_repository import AccessRepository

class AccessRepositoryImpl(AccessRepository):
    
    async def get_roles_by_user(self, user_id: str, tenant_id: str) -> List[str]:
        return ["ADMIN", "USER"]
    
    async def get_permissions_by_roles(self, role_id: List[str], tenant_id: str) -> List[str]:
        if "ADMIN" in role_id:
            return [
                "inventory.read", 
                "inventory.write", 
                "sales.create",
            ]
        elif "USER" in role_id:
            return ["inventory.read"]
        else:
            return []
    