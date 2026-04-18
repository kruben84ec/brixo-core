from typing import List

class AccessRepository:
    
    async def get_roles_by_user(self, user_id:str, tenant_id:str) -> list[str]:
        raise NotImplementedError("This method should be implemented by subclasses")
    
    async def get_permissions_by_roles(self, role_id:List[str], tenant_id:str) -> list[str]:
        raise NotImplementedError("This method should be implemented by subclasses")    