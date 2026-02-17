from datetime import datetime, timedelta, timezone
from typing import Dict, Any
import jwt

from infrastructure.env.settings import get_settings

settings = get_settings()
ALGORITHM = settings.jwt.algorithm


class JWTService:
    def __init__(self, secret: str, ttl_minutes: int):
        self.secret = secret
        self.ttl = ttl_minutes

    def generate(self, user_id: str, tenant_id: str) -> str:
        payload = {
            "sub": user_id,
            "tenant": tenant_id,
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(minutes=self.ttl),
        }

        return jwt.encode(payload, self.secret, algorithm=ALGORITHM)

    def decode(self, token: str) -> Dict[str, Any]:
        """
        Decodifica y valida un JWT.
        Lanza excepción si el token es inválido o expiró.
        """
        return jwt.decode(
            token,
            self.secret,
            algorithms=[ALGORITHM],
            options={"require": ["exp", "sub", "tenant"]},
        )
