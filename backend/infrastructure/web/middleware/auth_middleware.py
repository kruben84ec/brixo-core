from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

import jwt
from infrastructure.env.settings import get_settings
from infrastructure.redis_client import get_redis

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
settings = get_settings()


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            settings.jwt.public_key,
            algorithms=[settings.jwt.algorithm],
        )

        user_id = payload.get("sub")
        tenant_id = payload.get("tenant")

        if not user_id or not tenant_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        # 🔥 Validar sesión viva en Redis
        redis = await get_redis()
        session = await redis.get(f"session:{token}")

        if not session:
            raise HTTPException(status_code=401, detail="Session expired")

        return {
            "user_id": user_id,
            "tenant_id": tenant_id,
        }

    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
