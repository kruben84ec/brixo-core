# 🔨 GUÍA PRÁCTICA - PRIMEROS PASOS INMEDIATOS

## 🎯 OBJETIVO DE HOY
Hacer que el backend **levante correctamente** con una BD funcional.  
**Tiempo estimado**: 2-3 horas

---

## PASO 1: Arreglar docker-compose.yml (15 min)

### Qué falta
Redis service está definido pero **NO** en `docker-compose.yml`

### Solución
Agregar esto ANTES del cierre de `services:` en `infra/docker-compose.yml`:

```yaml
  redis:
    image: redis:7-alpine
    container_name: brixo-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  backend:
    # ... (resto de config)
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
```

Y agregar al final del archivo en `volumes:`:
```yaml
volumes:
  postgres_data:
  redis_data:
```

---

## PASO 2: Completar Script SQL (1 hora)

### Archivo a editar
`infra/docker/postgres/init.sql`

### Reemplazar todo con esto:

```sql
-- ===========================================
-- BRIXO - Database initialization script
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- 1. TENANTS TABLE (Empresas/Negocios)
-- ===========================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tenants_active ON tenants(is_active);

-- ===========================================
-- 2. USERS TABLE (Usuarios)
-- ===========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    authority_level VARCHAR(50) NOT NULL DEFAULT 'OPERATOR',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, username),
    UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active);

-- ===========================================
-- 3. ROLES TABLE (Roles asignables)
-- ===========================================
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

CREATE INDEX idx_roles_tenant ON roles(tenant_id);

-- ===========================================
-- 4. USER_ROLES TABLE (Asignación de roles)
-- ===========================================
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- ===========================================
-- 5. PRODUCTS TABLE (Productos/Artículos)
-- ===========================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    current_stock INTEGER NOT NULL DEFAULT 0,
    minimum_stock INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_stock ON products(current_stock);

-- ===========================================
-- 6. INVENTORY_MOVEMENTS TABLE (Entradas/Salidas)
-- ===========================================
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL, -- 'ENTRADA', 'SALIDA', 'AJUSTE'
    quantity INTEGER NOT NULL,
    reason TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_movements_tenant ON inventory_movements(tenant_id);
CREATE INDEX idx_movements_product ON inventory_movements(product_id);
CREATE INDEX idx_movements_date ON inventory_movements(created_at);

-- ===========================================
-- 7. AUDIT_LOGS TABLE (Historial/Auditoría)
-- ===========================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES users(id),
    actor_ip VARCHAR(45), -- IPv4 o IPv6
    event_type VARCHAR(50) NOT NULL, -- 'AUTH', 'INVENTORY', 'USER', 'ROLE'
    entity VARCHAR(50) NOT NULL, -- 'PRODUCT', 'USER', 'ROLE', etc
    entity_id UUID,
    action VARCHAR(50) NOT NULL, -- 'CREATED', 'UPDATED', 'DELETED'
    payload JSONB,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_date ON audit_logs(occurred_at);
CREATE INDEX idx_audit_entity ON audit_logs(entity_id);

-- ===========================================
-- 8. PERMISSIONS TABLE (Permisos)
-- ===========================================
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

CREATE INDEX idx_permissions_tenant ON permissions(tenant_id);

-- ===========================================
-- SAMPLE DATA (Demo)
-- ===========================================

-- Insertar tenant de prueba
INSERT INTO tenants (name) VALUES ('Demo Store') ON CONFLICT DO NOTHING;
SELECT setval('pg_get_serial_sequence', (SELECT MAX(id) FROM products), false);

-- Obtener ID del tenant insertado (para usar en los inserts)
WITH demo_tenant AS (
    SELECT id FROM tenants WHERE name = 'Demo Store' LIMIT 1
)
INSERT INTO users (
    tenant_id,
    username,
    email,
    password_hash,
    authority_level
)
SELECT
    id,
    'admin',
    'admin@demo.local',
    '$2b$12$dummyhash', -- Será reemplazado por contraseña real
    'OWNER'
FROM demo_tenant
ON CONFLICT DO NOTHING;

-- Insertar productos de prueba
WITH demo_tenant AS (
    SELECT id FROM tenants WHERE name = 'Demo Store' LIMIT 1
)
INSERT INTO products (tenant_id, name, description, current_stock, minimum_stock)
SELECT
    id,
    'Coca Cola 500ml',
    'Bebida refrescante',
    25,
    5
FROM demo_tenant
ON CONFLICT DO NOTHING;

WITH demo_tenant AS (
    SELECT id FROM tenants WHERE name = 'Demo Store' LIMIT 1
)
INSERT INTO products (tenant_id, name, description, current_stock, minimum_stock)
SELECT
    id,
    'Pan de molde',
    'Pan integral',
    10,
    3
FROM demo_tenant
ON CONFLICT DO NOTHING;

WITH demo_tenant AS (
    SELECT id FROM tenants WHERE name = 'Demo Store' LIMIT 1
)
INSERT INTO products (tenant_id, name, description, current_stock, minimum_stock)
SELECT
    id,
    'Leche entera',
    'Leche de vaca',
    15,
    5
FROM demo_tenant
ON CONFLICT DO NOTHING;
```

---

## PASO 3: Arreglar typo en Dominio (10 min)

### Archivo: `backend/domain/contracts.py`

Cambiar:
```python
@dataclass(frozen=True)
class Tenat:  # ❌ TYPO
```

Por:
```python
@dataclass(frozen=True)
class Tenant:  # ✅ CORRECTO
```

Luego, buscar en todo el backend si hay imports de `Tenat` y actualizar:
```bash
# En Windows PowerShell:
Get-ChildItem -Path "backend" -Recurse -Include "*.py" | 
  Select-String -Pattern "Tenat" | 
  Select Path, LineNumber
```

Actualizar cualquier import encontrado.

---

## PASO 4: Completar settings.py (30 min)

### Archivo: `backend/infrastructure/env/settings.py`

Reemplazar lo que existe con:

```python
from functools import lru_cache
from typing import Optional
from pydantic import BaseModel, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# ==================== SUB-CONFIG ====================

class JWTSettings(BaseModel):
    private_key: str
    public_key: str
    algorithm: str = "RS256"
    access_token_exp_minutes: int = 480
    refresh_token_exp_days: int = 30

class RedisSettings(BaseModel):
    url: Optional[str] = "redis://redis:6379/0"
    enabled: bool = True
    cache_ttl_seconds: int = 300

class LoggingSettings(BaseModel):
    level: str = "INFO"
    service_name: str = "brixo-backend"
    json_logs: bool = True

class DatabaseSettings(BaseModel):
    url: str
    echo: bool = False
    pool_size: int = 20
    max_overflow: int = 10

# ==================== MAIN SETTINGS ====================

class Settings(BaseSettings):
    """Configuración principal de la aplicación"""
    
    # Base
    app_name: str = "Brixo API"
    app_version: str = "4.5.0"
    environment: str = "development"
    debug: bool = True
    
    # Database
    database: DatabaseSettings = DatabaseSettings(
        url="postgresql://brixo_user:brixo_pass@postgres:5432/brixo",
        echo=True
    )
    
    # Redis
    redis: RedisSettings = RedisSettings()
    
    # JWT
    jwt: JWTSettings = JWTSettings(
        private_key="-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA2Z...",  # Leer desde env
        public_key="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w..."   # Leer desde env
    )
    
    # Logging
    logging: LoggingSettings = LoggingSettings()
    
    # CORS
    cors_origins: list = ["http://localhost:3000", "http://localhost:5173"]
    
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        env_nested_delimiter="__",
        case_sensitive=False,
        extra="ignore"
    )

# ==================== SINGLETON ====================

@lru_cache()
def get_settings() -> Settings:
    """Obtener configuración (cached)"""
    return Settings()
```

---

## PASO 5: Completar main.py BÁSICO (1 hora)

### Archivo: `backend/main.py`

Reemplazar todo con:

```python
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from db_wait import wait_for_db
from backend.infrastructure.logging import get_logger
from backend.infrastructure.env.settings import get_settings
from backend.infrastructure.redis_client import get_redis, close_redis
from backend.application.event_bus import EventBus

logger = get_logger()
settings = get_settings()

# Event Bus global
event_bus = EventBus()

# ==================== LIFECYCLE ====================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle de la aplicación"""
    
    # STARTUP
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    
    try:
        # Esperar a la BD
        wait_for_db()
        logger.info("✅ Database connected")
        
        # Conectar Redis
        redis = await get_redis()
        logger.info("✅ Redis connected")
        
        # Subscribir handlers (aquí irán cuando se implementen)
        # event_bus.subscribe(InventoryChanged, handle_inventory_changed)
        # event_bus.subscribe(RoleAssigned, handle_role_assigned)
        
        logger.info("✅ Application started successfully")
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {str(e)}")
        raise
    
    yield
    
    # SHUTDOWN
    logger.info("Shutting down...")
    await close_redis()
    logger.info("✅ Shutdown complete")


# ==================== APP CREATION ====================

app = FastAPI(
    title=settings.app_name,
    description="Sistema de control de inventario simple y eficaz",
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# ==================== MIDDLEWARE ====================

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== ROUTES ====================

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version
    }

@app.get("/", tags=["Info"])
async def root():
    """Root endpoint"""
    return {
        "message": "Brixo API - Sistema de Control de Inventario",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Aquí irán los routers cuando se creen:
# app.include_router(auth_router, prefix="/api")
# app.include_router(product_router, prefix="/api")
# app.include_router(inventory_router, prefix="/api")

# ==================== ERROR HANDLERS ====================

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Manejador genérico de excepciones"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# ==================== ENTRY POINT ====================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level=settings.logging.level.lower()
    )
```

---

## PASO 6: Verificar que todo funciona (30 min)

### Test del Setup

```bash
# 1. Navegar a infra
cd infra

# 2. Levantar servicios
docker-compose up -d

# 3. Esperar ~10 segundos

# 4. Verificar contenedores
docker ps

# Deberías ver:
# brixo-postgres ✅
# brixo-redis ✅
# brixo-backend ✅
# brixo-frontend (puede fallar ahora)

# 5. Revisar logs del backend
docker logs brixo-backend

# Debe mostrar algo como:
# ✅ Database connected
# ✅ Redis connected
# ✅ Application started successfully

# 6. Test de salud
curl http://localhost:8000/health

# Respuesta esperada:
# {"status":"healthy","app":"Brixo API","version":"4.5.0"}

# 7. Acceder a Swagger
# Abrir: http://localhost:8000/docs
```

---

## PASO 7: Próximos Pasos (Dentro de 2-3 horas)

Una vez que esto funcione:

1. **Crear Repositorios** (backend/adapters/repositories/)
   - ProductRepository
   - UserRepository
   - TenantRepository

2. **Crear DTOs** (backend/adapters/dtos/)
   - ProductDTO
   - UserDTO
   - LoginDTO

3. **Crear Controladores** (backend/adapters/http/)
   - ProductController con rutas básicas
   - AuthController con /login

4. **Conectar todo en main.py**

---

## ✅ CHECKLIST DE HOY

- [ ] Redis agregado a docker-compose.yml
- [ ] Script SQL completo en init.sql
- [ ] Typo "Tenat" → "Tenant" arreglado
- [ ] settings.py completado
- [ ] main.py levantado
- [ ] docker-compose up funciona
- [ ] Health check responde en /health
- [ ] Swagger accesible en /docs

**Después de completar esto:** El backend está listo para agregar lógica de negocio.

---

**Tiempo estimado total**: 2-3 horas  
**Nivel de dificultad**: Bajo-Medio  
**Requisito**: Tener Docker instalado y funcionando
