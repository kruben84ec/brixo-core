FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV WATCHFILES_FORCE_POLLING=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias primero para aprovechar cache de capas
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# En dev el código llega por el volume mount (../backend:/app)
# Este COPY aplica solo en builds sin volumen (producción)
COPY backend/ .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", \
     "--reload", "--reload-dir", "/app"]
