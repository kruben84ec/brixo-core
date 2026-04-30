# ARQUITECTURA DE BRIXO — Patrón Hexagonal

**Actualizado**: 29 de abril de 2026  
**Patrón**: Hexagonal (Puertos y Adaptadores)  
**Principio rector**: Las dependencias apuntan siempre hacia el dominio

---

## Principio Rector

**Las dependencias apuntan siempre hacia el dominio. El dominio no conoce ni infraestructura ni adaptadores.**

```text
Adapters → Application → Domain
               ↑
         Infrastructure
```

---

## Matriz de Importación (Regla No Negociable)

| Capa | Puede importar de | Prohibido |
|------|-------------------|-----------|
| **Domain** | Nadie | Infrastructure, Application, Adapters |
| **Application** | Solo Domain | Infrastructure, Adapters |
| **Infrastructure** | Domain + Application | Adapters |
| **Adapters** | Todas las capas | (ninguno) |

### Ejemplos

```python
# ❌ MAL — dominio importa infraestructura
from infrastructure.database import db_session

class Product:
    db_session = db_session  # ❌ VIOLACIÓN

# ✅ BIEN — interfaz en application, implementación en infrastructure
class ProductRepository(ABC):
    @abstractmethod
    def get_by_id(self, product_id: UUID) -> Product: ...

# Implementación en adapters
class ProductRepositorySQL(ProductRepository):
    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool
```

---

## Estructura del Proyecto

```text
backend/
├── domain/                          # ❌ CERO dependencias externas
│   ├── contracts.py                 # Tenant, User, Role, Permission (dataclasses)
│   ├── exceptions.py                # BrixoException jerarquía tipada
│   ├── logs.py                      # LogEntry, Actor, LogEventType (inmutables)
│   └── events/                      # DomainEvent, UserAuthenticated, UserLoggedIn
│       ├── base.py
│       ├── auth.py
│       ├── user.py
│       └── __init__.py
│
├── application/                     # Solo Domain
│   ├── event_bus.py                 # EventBus pub/sub
│   ├── handlers.py                  # Event handlers → persist audit log
│   ├── use_cases/
│   │   ├── signup.py               # SignUpUseCase
│   │   ├── create_product.py
│   │   ├── register_inventory_movement.py
│   │   ├── get_product_stock.py
│   │   ├── create_user.py
│   │   ├── assign_role_to_user.py
│   │   └── get_audit_log_by_tenant.py
│   └── services/
│       ├── auth/
│       │   └── login_user.py        # LoginUser use case
│       └── access/
│           └── user_access_projection.py  # Escucha UserAuthenticated
│
├── infrastructure/                  # Domain + Application
│   ├── settings.py                  # Pydantic BaseSettings (config)
│   ├── logging.py                   # JSON logger + RotatingFileHandler
│   ├── jwt_service.py               # RS256, token generation/validation
│   ├── jwt_middleware.py            # JWTAuthMiddleware (inyecta user_id+tenant_id)
│   ├── permissions.py               # require_permission(code) FastAPI dependency
│   ├── api/
│   │   ├── middleware/
│   │   │   └── http_logging.py      # HTTPLoggingMiddleware
│   │   ├── exception_handlers.py    # 4 handlers globales
│   │   └── routes/
│   │       ├── auth.py              # POST /api/auth/*
│   │       ├── products.py          # GET/POST /api/products/*
│   │       ├── users.py             # GET/POST /api/users/*
│   │       ├── audit.py             # GET /api/audit/*
│   │       ├── access.py            # GET /me/access
│   │       └── health.py            # GET /health
│   ├── projections/
│   │   └── user_access_projection.py # Snapshot Redis: user_access:{tenant}:{user}
│   └── security/
│       └── passwords.py             # bcrypt verify_password
│
├── adapters/                        # Todas las capas
│   └── repositories/
│       ├── auth_repository_sql.py
│       ├── product_repository_sql.py
│       ├── inventory_movement_repository_sql.py
│       ├── audit_log_repository_sql.py
│       ├── user_repository_sql.py
│       ├── tenant_repository_sql.py
│       ├── role_repository_sql.py
│       └── access_repository_sql.py
│
└── main.py                          # FastAPI app, middlewares, routers
```

---

## Flujo de Autenticación Completo

```
REQUEST
  │
  ▼
CORSMiddleware              ← capa exterior — preflight OPTIONS sin auth
  │
  ▼
HTTPLoggingMiddleware       ← registra method/path/status/duration
  │
  ▼
JWTAuthMiddleware           ← valida RS256, inyecta user_id + tenant_id en request.state
  │                            publica UserAuthenticated en EventBus
  ▼
UserAccessProjection        ← escucha UserAuthenticated
  │                            consulta roles + permisos en BD
  │                            guarda snapshot en Redis: user_access:{tenant}:{user}
  ▼
require_permission(code)    ← read-only: lee snapshot de Redis
  │                            lanza 403 Forbidden si código falta
  ▼
Handler / Route / Use Case  ← lógica de negocio pura (domain + application)
  │
  ▼
Exception Handlers          ← separan error de usuario de detalle técnico
  │
  ▼
Response                    ← JSON limpio: { error, message }
  │
  ▼
AuditLogRepository          ← persiste acciones relevantes en BD (handlers)
```

---

## Jerarquía de Excepciones

```
BrixoException (domain/exceptions.py)
├── NotFoundError                 → HTTP 404 NOT_FOUND
├── UnauthorizedError             → HTTP 401 UNAUTHORIZED
├── ForbiddenError                → HTTP 403 FORBIDDEN
├── ConflictError                 → HTTP 409 CONFLICT
├── DomainValidationError         → HTTP 422 UNPROCESSABLE_ENTITY
└── InternalError                 → HTTP 500 INTERNAL_SERVER_ERROR
```

**Ventaja**: Exception handler en infrastructure captura por tipo, separa mensaje público de detalle técnico.

```python
# En application/use_cases
class CreateProductUseCase:
    def execute(self, command: CreateProductCommand) -> Product:
        existing = self._repo.find_by_sku(command.sku, command.tenant_id)
        if existing:
            raise ConflictError(
                message="Ya existe un producto con ese SKU.",
                detail=f"SKU={command.sku!r} en tenant={command.tenant_id}"
            )

# Exception handler en infrastructure/api/exception_handlers.py
@app.exception_handler(BrixoException)
async def brixo_exception_handler(request, exc):
    logger.error(f"{exc.__class__.__name__}: {exc.detail}")  # al log
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.error_code, "message": exc.message}  # al cliente
    )
```

---

## Patrones Clave

### 1. Casos de Uso — Siempre Clase con `execute()`

```python
class CreateProductUseCase:
    def __init__(self, product_repo: ProductRepository, event_bus: EventBus):
        self._repo = product_repo
        self._bus = event_bus

    def execute(self, command: CreateProductCommand) -> Product:
        # Validaciones de negocio
        if not command.name.strip():
            raise DomainValidationError("El nombre no puede estar vacío")
        
        # Crear entidad de dominio
        product = Product(
            id=uuid4(),
            tenant_id=command.tenant_id,
            name=command.name,
            sku=command.sku,
            current_stock=0
        )
        
        # Persistir
        self._repo.save(product)
        
        # Publicar evento
        self._bus.publish(ProductCreated(product_id=product.id, tenant_id=product.tenant_id))
        
        return product
```

### 2. Entidades de Dominio — Dataclasses Inmutables

```python
@dataclass(frozen=True)
class Product:
    id: UUID
    tenant_id: UUID
    name: str
    sku: str
    current_stock: int
    created_at: datetime = field(default_factory=datetime.utcnow)
```

**Ventaja**: Imposible modificar. Cambios siempre pasan por use cases que pueden publicar eventos.

### 3. Repositorios — Patrón ABC + Adaptador SQL

```python
# application/contracts (abstract)
class ProductRepository(ABC):
    @abstractmethod
    async def find_by_id(self, product_id: UUID, tenant_id: UUID) -> Optional[Product]:
        pass
    
    @abstractmethod
    async def find_by_sku(self, sku: str, tenant_id: UUID) -> Optional[Product]:
        pass
    
    @abstractmethod
    async def save(self, product: Product) -> None:
        pass

# adapters/repositories/product_repository_sql.py
class ProductRepositorySQL(ProductRepository):
    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool
    
    async def find_by_id(self, product_id: UUID, tenant_id: UUID) -> Optional[Product]:
        row = await self.pool.fetchrow(
            "SELECT * FROM products WHERE id = $1 AND tenant_id = $2",
            product_id, tenant_id
        )
        return self._row_to_product(row) if row else None
    
    async def save(self, product: Product) -> None:
        await self.pool.execute(
            """INSERT INTO products (id, tenant_id, name, sku, current_stock)
               VALUES ($1, $2, $3, $4, $5)""",
            product.id, product.tenant_id, product.name, product.sku, product.current_stock
        )
```

### 4. Event Bus — Pub/Sub Simple

```python
# application/event_bus.py
class EventBus:
    def __init__(self):
        self._handlers: dict[type, list[Callable]] = {}
    
    def subscribe(self, event_type: type, handler: Callable):
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)
    
    def publish(self, event: DomainEvent):
        handlers = self._handlers.get(type(event), [])
        for handler in handlers:
            try:
                handler(event)
            except Exception as e:
                logger.error(f"Handler error: {e}")

# En main.py
event_bus = EventBus()
event_bus.subscribe(UserLoggedIn, lambda e: audit_handler(e))
event_bus.subscribe(UserAuthenticated, lambda e: access_projection(e))
```

### 5. Routers FastAPI — Factory Functions

```python
def create_product_router(
    create_product_uc: CreateProductUseCase,
    get_product_uc: GetProductStockUseCase
) -> APIRouter:
    router = APIRouter(prefix="/api/products", tags=["products"])
    
    @router.post("/", response_model=ProductResponse, status_code=201)
    async def create_product(
        cmd: CreateProductCommand,
        current_user: UserClaim = Depends(get_current_user),
        permission: Permission = Depends(require_permission("INVENTORY_WRITE"))
    ):
        product = create_product_uc.execute(cmd.with_tenant(current_user.tenant_id))
        return ProductResponse.from_domain(product)
    
    return router
```

---

## Multi-Tenant Always

**REGLA**: Todo query debe filtrar `tenant_id`. No hay excepciones.

```python
# ❌ MAL
SELECT * FROM products WHERE id = $1

# ✅ BIEN
SELECT * FROM products WHERE id = $1 AND tenant_id = $2

# ❌ MAL — no filtro en use case
class GetProductStockUseCase:
    def execute(self, product_id: UUID) -> int:
        product = self._repo.find_by_id(product_id)  # ← sin tenant_id

# ✅ BIEN
class GetProductStockUseCase:
    def execute(self, product_id: UUID, tenant_id: UUID) -> int:
        product = self._repo.find_by_id(product_id, tenant_id)
```

**Razón**: Seguridad. Un bug en filtrado de tenant es un breach de datos.

---

## Logging de Negocio vs Técnico

```python
# Técnico (infrastructure/logging.py) — JSON a archivo
logger.error("Database connection failed", extra={
    "service": "brixo-backend",
    "module": "product_repository",
    "error_code": "DB_CONNECTION_ERROR"
})

# Negocio (domain/logs.py + handlers) — Audit trail en BD
audit_log = LogEntry(
    event_type=LogEventType.PRODUCT_CREATED,
    actor=Actor(user_id=user_id, tenant_id=tenant_id),
    details="Product created: SKU=XYZ"
)
audit_log_repo.save(audit_log)
```

---

## Convenciones de Nombres

| Contexto | Patrón | Ejemplo |
|----------|--------|---------|
| **Use Case** | `{Action}{Entity}UseCase` | `CreateProductUseCase`, `RegisterInventoryMovementUseCase` |
| **Service** | `{Action}{Entity}Service` | `JWTService`, `PasswordService` |
| **Repository (interface)** | `{Entity}Repository` | `ProductRepository` |
| **Repository (impl)** | `{Entity}Repository{Tech}` | `ProductRepositorySQL` |
| **Event** | `{Entity}{Action}` | `ProductCreated`, `UserLoggedIn` |
| **Command** | `{Action}{Entity}Command` | `CreateProductCommand` |
| **Exception** | `{Reason}Error` | `NotFoundError`, `ConflictError` |
| **Function** | `{verb}_{entity}_{detail}` | `get_product_current_stock()` |

---

## Diagrama de Módulos — MVP 100%

```
┌─────────────────────────────────────────────────────┐
│ FRONTEND (React + Vite)                             │
│ ✅ Sprint 1-3 completados, UI Polish resuelto      │
└──────────────────────┬──────────────────────────────┘
                       │ CORS habilitado
                       │ JWT en Authorization header
┌──────────────────────▼──────────────────────────────┐
│ FASTAPI BACKEND                                     │
├──────────────────────────────────────────────────────┤
│ main.py                                             │
│ ├─ CORSMiddleware                                   │
│ ├─ HTTPLoggingMiddleware                           │
│ ├─ JWTAuthMiddleware (RS256)                        │
│ ├─ Exception Handlers (4 globales)                 │
│ └─ EventBus + Lifespan                              │
│                                                     │
│ RUTAS (infrastructure/api/routes/)                 │
│ ├─ POST /api/auth/register                         │
│ ├─ POST /api/auth/login                            │
│ ├─ GET/POST /api/products/*                         │
│ ├─ GET/POST /api/users/*                            │
│ ├─ GET /api/audit/                                 │
│ └─ GET /health                                      │
│                                                     │
│ CASOS DE USO (application/use_cases/)              │
│ ├─ SignUpUseCase                                    │
│ ├─ LoginUser                                        │
│ ├─ CreateProductUseCase                             │
│ ├─ RegisterInventoryMovementUseCase                │
│ ├─ GetProductStockUseCase                           │
│ ├─ CreateUserUseCase                                │
│ ├─ AssignRoleToUserUseCase                         │
│ └─ GetAuditLogByTenantUseCase                      │
│                                                     │
│ REPOSITORIOS (adapters/repositories/)              │
│ ├─ AuthRepositorySQL                               │
│ ├─ ProductRepositorySQL                             │
│ ├─ InventoryMovementRepositorySQL                  │
│ ├─ AuditLogRepositorySQL                            │
│ ├─ UserRepositorySQL                                │
│ ├─ TenantRepositorySQL                              │
│ ├─ RoleRepositorySQL                                │
│ └─ AccessRepositorySQL                              │
│                                                     │
│ DOMINIO (domain/)                                   │
│ ├─ contracts.py (Tenant, User, Product, Role)     │
│ ├─ exceptions.py (jerarquía tipada)               │
│ ├─ logs.py (LogEntry, Actor)                       │
│ └─ events/ (DomainEvent, UserAuthenticated)        │
└──────────────────────┬──────────────────────────────┘
                       │ BD: 8 tablas + seed
                       │ Cache: Redis snapshots
┌──────────────────────▼──────────────────────────────┐
│ INFRAESTRUCTURA (Docker Compose)                    │
│ ├─ PostgreSQL 15 (8 tablas)                        │
│ ├─ Redis 7 (user_access snapshots)                 │
│ └─ Logs (app.log + stdout)                         │
└──────────────────────────────────────────────────────┘
```

---

**Arquitecto del proyecto**: Equipo Brixo  
**Última actualización**: 29 de abril de 2026  
**Próximo review**: Al completar Fase 6 (QA + Hardening)
