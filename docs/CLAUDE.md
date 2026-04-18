# CLAUDE.md — Brixo Core

> Archivo raíz para Claude Code. La documentación completa está en `docs/`.

---

## Proyecto

**Brixo** — Sistema de control de inventario simple para pequeños negocios y pymes.  
**No es** un ERP ni sistema contable. **Es** control de stock: entradas, salidas, historial.

**Versión**: 4.5.0 | **Branch activo**: dev | **Estado**: MVP en desarrollo (~10%)

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.12, FastAPI 0.128+, Pydantic v2, psycopg2, PyJWT RS256 |
| Frontend | React 18, Vite 5, JavaScript (JSX) |
| Infra | Docker Compose, PostgreSQL 15, Redis 7-alpine |
| OS dev | Windows — usar PowerShell o Git Bash |

---

## Estructura del repositorio

```
brixo-core/
├── backend/
│   ├── domain/          # Entidades, eventos, contratos — SIN dependencias externas
│   ├── application/     # Casos de uso, event bus, handlers
│   ├── infrastructure/  # BD, Redis, JWT, logging, settings
│   ├── adapters/        # Controladores HTTP, repositorios SQL, middlewares
│   ├── mappers/         # Domain ↔ DTO
│   └── main.py          # Punto de entrada FastAPI
├── frontend/
│   └── src/             # React SPA (actualmente vacío)
├── infra/
│   ├── docker-compose.yml
│   ├── docker/postgres/init.sql
│   └── env/             # Variables de entorno por servicio
└── docs/                # Toda la documentación del proyecto
```

---

## Arquitectura — Hexagonal (Puertos y Adaptadores)

**Flujo de dependencias siempre hacia adentro:**

```
Adapters → Application → Domain
               ↑
         Infrastructure
```

| Capa | Puede importar de |
|------|-------------------|
| Domain | Nadie |
| Application | Solo Domain |
| Infrastructure | Domain + Application |
| Adapters | Todas las capas |

```python
# ❌ MAL — dominio importa infraestructura
from infrastructure.database import db_session

# ✅ BIEN — interfaz en application, implementación en infrastructure
class ProductRepository(ABC):
    @abstractmethod
    def get_by_id(self, product_id: UUID) -> Product: ...
```

---

## Convenciones de código

### Nombres de funciones — específicos y descriptivos

```python
# ❌ MAL
def get_data(): ...
def process(): ...

# ✅ BIEN
def get_product_current_stock(product_id: UUID) -> int: ...
def register_inventory_entry(product_id: UUID, quantity: int, actor: Actor) -> InventoryMovement: ...
```

### Casos de uso — siempre clase con `execute()`

```python
class RegisterInventoryEntryUseCase:
    def __init__(self, product_repo: ProductRepository, event_bus: EventBus): ...
    def execute(self, command: RegisterInventoryEntryCommand) -> InventoryMovement: ...
```

### Entidades de dominio — dataclasses inmutables

```python
@dataclass(frozen=True)
class Product:
    id: UUID
    tenant_id: UUID
    name: str
    current_stock: int
```

### Routers FastAPI — factory functions

```python
def create_product_router(product_use_cases: ProductUseCases) -> APIRouter: ...
```

---

## Comandos frecuentes

```bash
# Levantar todos los servicios
cd infra && docker-compose up -d

# Ver logs del backend
docker logs -f brixo-backend

# Verificar que levantó
curl http://localhost:8000/health

# Acceso directo a la BD
docker exec -it brixo-postgres psql -U brixo_user -d brixo

# Swagger UI
start http://localhost:8000/docs

# Frontend
start http://localhost:3000
```

---

## Estado actual — branch `feature/auth-core`

### ✅ Implementado y funcional

- `domain/` — contracts, events, logs, auth (95%)
- `application/event_bus.py` — pub/sub con manejo de errores
- `application/handlers.py` — UserLoggedIn, UserLoginFailed, UserAuthenticated
- `application/services/auth/login_user.py` — LoginUser use case completo
- `infrastructure/env/settings.py` — Pydantic BaseSettings completo (JWT, Redis, Logging)
- `infrastructure/security/jwt_service.py` — JWTService RS256 (generate + decode)
- `infrastructure/security/jwt_middleware.py` — JWTAuthMiddleware completo
- `infrastructure/projections/user_access_projection.py` — snapshot de acceso en Redis
- `infrastructure/api/routes/auth.py` — POST /auth/login
- `infrastructure/api/routes/access.py` — GET /me/access
- `main.py` — FastAPI app instanciada, middleware, routers, EventBus integrado
- Docker Compose — PostgreSQL + Redis + Backend + Frontend configurados

### ⚠️ Stubs (arquitectura lista, sin BD real)

- `infrastructure/persistence/auth_repository_sql.py` — mock hardcodeado, solo acepta `admin@brixo.local`
- `infrastructure/persistence/access_repository_impl.py` — roles/permisos hardcodeados

### ❌ Pendiente (en orden de prioridad)

1. Script SQL completo — solo existe tabla `products`, faltan: `tenants`, `users`, `roles`, `user_roles`, `inventory_movements`, `audit_logs`, `permissions`
2. Repositorios reales con psycopg2 — reemplazar los stubs
3. Endpoints de productos: `GET/POST /api/products`, `GET /api/products/{id}`
4. Endpoints de inventario: `POST /api/inventory/movements`, `GET /api/inventory/stock/{id}`
5. Endpoints de usuarios y auditoría
6. Frontend — solo placeholder (`<h1>Brixo</h1>`)
7. Typo: `class Tenat` → `class Tenant` en `domain/contracts.py`

---

## Reglas no negociables

1. **El dominio nunca importa infraestructura** — sin excepciones
2. **Nombres descriptivos** — el nombre debe explicar qué hace sin leer el cuerpo
3. **Sin comentarios obvios** — solo comentar el WHY cuando no es evidente
4. **Sin sobre-ingeniería** — 3 líneas similares > una abstracción prematura
5. **Evaluar antes de implementar** — si hay un problema arquitectural, señalarlo primero
6. **Multi-tenant siempre** — todo query debe filtrar por `tenant_id`

---

## Para la próxima sesión

Consulta `docs/PRIMEROS_PASOS.md` para los pasos 1-7 con código listo para copiar.  
Consulta `docs/CHECKLIST.md` para el estado de tareas por fase.