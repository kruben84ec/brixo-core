from backend.domain.events.auth import UserLoggedIn, UserLoginFailed
from backend.infrastructure.logging import get_logger

logger = get_logger()


def handler_user_logged_in(event:UserLoggedIn):
    logger.info(
        "User logged in",
        extra={
            "tenant_id":str(event.tenant_id),
            "user_id":str(event.user_id)
        }
    )
    
def handle_user_login_failed(event: UserLoginFailed):
    logger.warning(
        "Login failed",
        extra={
            "tenant_id": str(event.tenant_id) if event.tenant_id else None,
            "username": event.username,
        },
    )