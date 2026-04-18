# Guía para AI Coding Agents - Brixo Core

## Contexto del Proyecto
**Brixo** es un sistema de control de inventario simple para pequeños negocios. Arquitectura **hexagonal** con backend FastAPI/Python, frontend React/Vite, PostgreSQL + Redis en Docker.

---

## Arquitectura - Capas Críticas

El proyecto organiza el backend en **4 capas** (ver `backend/`):

### 1. **Domain** (`backend/domain/`)
- **Responsabilidad**: Lógica de negocio pura, agnóstica de tecnología
- **Componentes clave**:
  - `contracts.py`: Entidades `User`, `Tenant`, `Role`, `Permission` como `@dataclass(frozen=True)`
  - `events/`: Eventos de dominio (`UserLoggedIn`, `InventoryChanged`, `RoleAssigned`)
  - `logs.py`: Modelo de auditoría con `LogEntry`, `Actor`, `LogEventType`
- **Patrón**: Todas las entidades son **inmutables** (frozen dataclasses)

### 2. **Application** (`backend/application/`)
- **Responsabilidad**: Casos de uso, coordinación de eventos
- **Componentes clave**:
  - `event_bus.py`: Publish/Subscribe sincrónico. Handlers se registran por tipo de evento.
  - `handlers.py`: Handlers de eventos. Registro en `init_app()` de main.py
  - `services/auth/login_user.py`: Caso de uso que publica eventos `UserLoggedIn`
- **Patrón**: Inyección de dependencias vía argumentos de función

### 3. **Infrastructure** (`backend/infrastructure/`)
- **Responsabilidad**: HTTP routes, persistencia, seguridad, logging
- **Estructura**:
  - `api/routes/`: Routers FastAPI (auth.py, access.py). **Cada router recibe `event_bus` inyectado**
  - `persistence/`: SQL repositories (AuthRepositorySQL muestra el patrón)
  - `security/`: JWT (RS256), middlewares, contraseñas
  - `env/settings.py`: Configuración Pydantic con sub-configs (JWTSettings, etc.)
- **Patrón**: Routers son **factories** que retornan APIRouter inyectando event_bus

### 4. **Adapters** (`backend/adapters/`)
- **Actualmente vacío** - Reservado para transformaciones DTO/responses

---

## Flujo de Solicitud (Request Flow)

```
1. HTTP POST /auth/login → api/routes/auth.py
2. LoginUser use case consulta AuthRepositorySQL
3. Evento UserLoggedIn publicado en event_bus
4. handler_user_logged_in consumidor e registra LogEntry
5. Response retorna JWT token
```

**Convención crítica**: Instancia de `event_bus` se crea en `main.py:init_app()` y se inyecta en:
- Routers: `get_auth_router(event_bus)`
- Middlewares: `JWTAuthMiddleware(event_bus=event_bus)`
- Proyecciones: `UserAccessProjection(event_bus)`

---

## Multi-tenancy - Patrón Omnipresente

**CADA operación debe ser tenant-aware**:
- `User` tiene `tenant_id: UUID` (`contracts.py`)
- `DomainEvent` base incluye `tenant_id: UUID`
- JWT token codifica usuario + `tenant_id` (Ver `JWTService.generate()`)
- Validación en middleware: Extraer `tenant_id` del token en `JWTAuthMiddleware`

**Ejemplo**: Una auditoría de login DEBE incluir `tenant_id` en `LogEntry.tenant_id`

---

## Autorización - Authority Levels

Define 4 niveles jerárquicos en `domain/contracts.py:AuthorityLevel`:
- `OWNER`: Control total del negocio
- `ADMIN`: Delegado administrativo
- `MANAGER`: Jefe de tienda
- `OPERATOR`: Empleado/cajero

**Validación**: Middleware `JWTAuthMiddleware` debe extraer del JWT y validar permisos contra rutas

---

## Patrones de Código Obligatorios

### Agregar Nuevo Evento
```python
# backend/domain/events/inventory.py
@dataclass(frozen=True)
class ProductMovementRegistered(DomainEvent):
    product_id: UUID
    movement_type: str  # 'IN', 'OUT', 'CORRECTION'
    quantity: int
    tenant_id: UUID
    occurred_at: datetime
```

### Registrar Handler
```python
# backend/application/handlers.py
def handle_product_movement(event: ProductMovementRegistered):
    logger.info("Product moved", extra={"product_id": str(event.product_id)})
    # Crear LogEntry, actualizar caché Redis, etc.

# En register_handlers()
event_bus.subscribe(ProductMovementRegistered, handle_product_movement)
```

### Agregar Nuevo Router
```python
# backend/infrastructure/api/routes/products.py
def get_products_router(event_bus: EventBus) -> APIRouter:
    router = APIRouter()
    
    @router.post("/movements")
    async def register_movement(payload: dict, authorization: str = Header(None)):
        # JWTMiddleware valida y carga user_id, tenant_id en context
        event = ProductMovementRegistered(...)
        event_bus.publish(event)
        return {"status": "ok"}
    
    return router

# En main.py init_app()
products_router = get_products_router(event_bus)
app.include_router(products_router, prefix="/products", tags=["products"])
```

---

## Dependencias Externas Clave

| Librería | Uso | Nota |
|----------|-----|------|
| **FastAPI 0.128.0** | Framework HTTP | Uso de routers y middlewares |
| **Pydantic 2.12.5** | Validación/Settings | Subclases en settings.py |
| **PyJWT 2.10.1** | Tokens | RS256 con claves en env/ |
| **psycopg2** | Conexión PostgreSQL | En `persistence/*.py` |
| **redis 7.1.0** | Caché/Sesiones | Cliente en `infrastructure/redis_client.py` |

---

## Convenciones No Obvias

1. **Logging Estructurado**: Usa `infrastructure/logging.py`. Logs en JSON con contexto tenant_id, user_id, etc.
   ```python
   logger.info("User action", extra={"tenant_id": str(tenant_id), "action": "LOGIN"})
   ```

2. **Imports Relativos**: Usa rutas relativas desde `backend/`. Ej: `from domain.contracts import User`

3. **Frozen Dataclasses**: Domain entities son inmutables (evita mutaciones accidentales de valores de negocio)

4. **Event Bus Sincrónico**: Publicación de eventos es **bloqueante**. Los handlers corren secuencialmente.

5. **Docker Compose**: Redis y PostgreSQL DEBEN estar corriendo. `docker-compose.yml` en `infra/`:
   ```bash
   docker-compose -f infra/docker-compose.yml up -d
   ```

6. **Variables de Entorno**: Cargadas desde `ENV_DIR` (default `backend/infrastructure/env/`):
   - `backend.env`: DB, API config
   - `jwt.env`: Claves privada/pública RS256
   - `redis.env`: Host/puerto Redis

---

## Checklist para Nuevas Features

- [ ] ¿Hay evento de dominio en `domain/events/`?
- [ ] ¿Event tiene `tenant_id`, `occurred_at`?
- [ ] ¿Handler registrado en `application/handlers.py`?
- [ ] ¿Router tiene inyección de `event_bus`?
- [ ] ¿Validación de `tenant_id` del JWT en middleware?
- [ ] ¿LogEntry creado con actor (user_id, tenant_id)?
- [ ] ¿Imports usan rutas relativas desde `backend/`?

---

## Referencias Clave de Archivos

- **Punto de entrada**: [backend/main.py](backend/main.py) - Inicialización de app
- **Event bus**: [backend/application/event_bus.py](backend/application/event_bus.py) - Publish/Subscribe
- **Modelos**: [backend/domain/contracts.py](backend/domain/contracts.py) - User, Tenant, Role, etc.
- **Auth**: [backend/infrastructure/api/routes/auth.py](backend/infrastructure/api/routes/auth.py) - Ejemplo de router
- **Ejemplo handler**: [backend/application/handlers.py](backend/application/handlers.py) - Patrones de handlers

---

## Errores Comunes a Evitar

❌ **NO hacer**: Importar desde path absoluto. Usar `from infrastructure.api...`  
✅ **SÍ hacer**: `from backend.infrastructure.api...` o relativas desde `backend/`

❌ **NO hacer**: Omitir `tenant_id` en eventos o logs  
✅ **SÍ hacer**: SIEMPRE incluir tenant_id en DomainEvent

❌ **NO hacer**: Modificar entidades de dominio después de crearlas  
✅ **SÍ hacer**: Usar frozen dataclasses para inmutabilidad

❌ **NO hacer**: Pasar event_bus implícitamente vía globals  
✅ **SÍ hacer**: Inyectarlo explícitamente en constructores/factories
