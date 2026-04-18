from contextlib import contextmanager
from typing import Generator

import psycopg2
import psycopg2.pool

from infrastructure.env.settings import get_settings
from infrastructure.logging import get_logger

logger = get_logger()
_pool: psycopg2.pool.ThreadedConnectionPool | None = None


def initialize_connection_pool() -> None:
    global _pool
    settings = get_settings()
    _pool = psycopg2.pool.ThreadedConnectionPool(
        minconn=2,
        maxconn=20,
        dsn=settings.database_url,
    )
    logger.info("Database connection pool initialized")


def get_connection_pool() -> psycopg2.pool.ThreadedConnectionPool:
    if _pool is None:
        raise RuntimeError("Pool not initialized — call initialize_connection_pool() at startup")
    return _pool


@contextmanager
def get_db_connection() -> Generator:
    pool = get_connection_pool()
    conn = pool.getconn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        pool.putconn(conn)


@contextmanager
def get_db_cursor() -> Generator:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            yield cursor
        finally:
            cursor.close()


def close_connection_pool() -> None:
    global _pool
    if _pool:
        _pool.closeall()
        _pool = None
        logger.info("Database connection pool closed")
