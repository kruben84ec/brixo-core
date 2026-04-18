from fastapi import APIRouter
from infrastructure.database import get_db_cursor

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check():
    try:
        with get_db_cursor() as cursor:
            cursor.execute("SELECT 1")
        return {"status": "ok", "db": "ok"}
    except Exception:
        return {"status": "ok", "db": "unavailable"}
