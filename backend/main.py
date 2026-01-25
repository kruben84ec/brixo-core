from db_wait import wait_for_db
from fastapi import FastAPI
from backend.infrastructure.security.jwt_middleware import JWTAuthMiddleware

wait_for_db()

# levantar FastAPI / Flask

app = FastAPI()

app.add_middleware(JWTAuthMiddleware)