from fastapi import APIRouter, HTTPException
from backend.infrastructure.env.settings import get_settings
from backend.infrastructure.security.jwt_service import JWTService
from backend.application.services.auth.login_user import LoginUser
from backend.infrastructure.persistence.auth_repository_sql import AuthRepositorySQL
from backend.application.event_bus import EventBus

router = APIRouter()
settings = get_settings()

event_bus = EventBus()
auth_repository = AuthRepositorySQL()
login_user_uc = LoginUser(auth_repository, event_bus)

@router.post("/login")
async def login(payload: dict):
    try:
        user = login_user_uc.execute(
            payload["email"],
            payload["password"]
        )

        jwt_service = JWTService(
            secret=settings.jwt.private_key,
            ttl_minutes=settings.jwt.access_token_exp_minutes
        )

        token = jwt_service.generate(
            user_id=str(user.id),
            tenant_id=str(user.tenant_id)
        )

        return {"access_token": token}

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
