import time
import psycopg2
import os

DATABASE_URL = os.getenv("DATABASE_URL")

MAX_RETRIES = 10
RETRY_DELAY = 3  # segundos

def wait_for_db():
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            conn = psycopg2.connect(DATABASE_URL)
            conn.close()
            print("✅ Conectado a Postgres")
            return
        except Exception as e:
            print(f"⏳ Esperando Postgres ({attempt}/{MAX_RETRIES})...")
            time.sleep(RETRY_DELAY)

    raise RuntimeError("❌ No se pudo conectar a Postgres")

if __name__ == "__main__":
    wait_for_db()
    # aquí levantas la app
