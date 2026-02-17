from jose import jwt
from datetime import datetime, timedelta, timezone
from infrastructure.redis_client import get_redis
from domain.events.auth import UserLoggedIn
from infrastructure.logging import get_logger
logger = get_logger()

from infrastructure.env.settings import get_settings
settings = get_settings()

SECRET = settings.jwt.private_key
ALGORITHM = settings.jwt.algorithm
TTL = settings.jwt.access_token_exp_minutes
# Convertir minutos a segundos
class AuthService:
    
    def __init__(self, event_bus):
        self.event_bus = event_bus
    
    async def login(self, tenant_id, user_id):
        redis = await get_redis()
        
        payload = {
            "tenant": tenant_id,
            "sub": user_id,
            "exp": datetime.now(timezone.utc) + timedelta(seconds=TTL)
        }
        
        token = jwt.encode(payload, SECRET, algorithm=ALGORITHM)
        
        await redis.set(f"auth:token:{token}", str(user_id), ex=TTL)
        
        await self.event_bus.publish(
            UserLoggedIn(
                tenant_id=tenant_id,
                user_id=user_id,
                occurred_at=datetime.now(timezone.utc)
            )
        )
        
        return token
            
        