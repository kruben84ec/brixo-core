from datetime import datetime, timedelta, timezone
from typing import Dict, Any
import jwt
from cryptography.hazmat.primitives.serialization import load_pem_private_key, load_pem_public_key
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPrivateKey, RSAPublicKey

from infrastructure.env.settings import get_settings

settings = get_settings()
ALGORITHM = settings.jwt.algorithm


class JWTService:
    def __init__(self, private_key: str, public_key: str, ttl_minutes: int):
        loaded_private = load_pem_private_key(
            private_key.replace("\\n", "\n").encode("utf-8"),
            password=None
        )
        loaded_public = load_pem_public_key(
            public_key.replace("\\n", "\n").encode("utf-8")
        )

        # Cast explícito para que Pylance entienda el tipo correcto
        assert isinstance(loaded_private, RSAPrivateKey), "La clave privada debe ser RSA"
        assert isinstance(loaded_public, RSAPublicKey), "La clave pública debe ser RSA"

        self.private_key: RSAPrivateKey = loaded_private
        self.public_key: RSAPublicKey = loaded_public
        self.ttl = ttl_minutes

    def generate(self, user_id: str, tenant_id: str) -> str:
        payload = {
            "sub": user_id,
            "tenant": tenant_id,
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(minutes=self.ttl),
        }
        return jwt.encode(payload, self.private_key, algorithm=ALGORITHM)

    def decode(self, token: str) -> Dict[str, Any]:
        
        try:
            
        
            return jwt.decode(
                token,
                self.public_key,
                algorithms=[ALGORITHM],
                options={"require": ["exp", "sub", "tenant"]},
            )
        except jwt.ExpiredSignatureError:
            raise ValueError("Token expired")