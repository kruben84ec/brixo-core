from datetime import datetime, timedelta, timezone
import  jwt

from backend.infrastructure.env.settings import get_settings
settings = get_settings()


class JWTService:
    def __init__(self, secret:str, ttl_minutes:int):
        self.secret = secret
        self.ttl = ttl_minutes
    
    def generate(self, user_id: str, tenant_id: str) -> str:
        payload = {
            "sub": user_id,
            "tenant": tenant_id,
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(minutes=self.ttl),
        }
        return jwt.encode(payload, self.secret, algorithm="HS256")