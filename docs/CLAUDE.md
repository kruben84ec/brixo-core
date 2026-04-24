# CLAUDE.md — Brixo Core

> Archivo raíz para Claude Code. La documentación completa está en `docs/`.

---

## Proyecto

**Brixo** — Sistema de control de inventario simple para pequeños negocios y pymes.  
**No es** un ERP ni sistema contable. **Es** control de stock: entradas, salidas, historial.

**Branch activo**: dev | **Estado**: Backend 100% ✅ — Frontend Sprint 1-2 ✅ — Sprint 3 ⭕ — MVP 78%

---

## Stack

| Capa | Tecnología |
| ---- | ---------- |
| Backend | Python 3.12, FastAPI 0.128+, Pydantic v2, psycopg2, PyJWT RS256 |
| Frontend | React 18, Vite 5, TypeScript 5, TSX |
| Infra | Docker Compose, PostgreSQL 15, Redis 7-alpine |
| Auth | JWT RS256, RBAC por permisos (snapshots Redis) |
| OS dev | Windows — usar PowerShell o Git Bash |

---

## Estructura del repositorio

```text
brixo-core/
├── backend/
│   ├── domain/          # Entidades, eventos, contratos — SIN dependencias externas
│   ├── application/     # Casos de uso, event bus, handlers
│   ├── infrastructure/  # BD, Redis, JWT, logging, settings, rutas HTTP
│   ├── adapters/        # Repositorios SQL
│   └── main.py          # Punto de entrada FastAPI
├── frontend/
│   └── src/             # React SPA — solo placeholder, Fase 5 pendiente
├── infra/
│   ├── docker-compose.yml
│   ├── docker/postgres/init.sql
│   └── env/             # Variables de entorno por servicio (no versionadas)
└── docs/                # Toda la documentación del proyecto
```

---

## Arquitectura — Hexagonal (Puertos y Adaptadores)

**Flujo de dependencias siempre hacia adentro:**

```text
Adapters → Application → Domain
               ↑
         Infrastructure
```

| Capa | Puede importar de |
| ---- | ----------------- |
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
def create_product_router(event_bus: EventBus) -> APIRouter: ...
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

## Estado actual (23 de abril de 2026)

### ✅ Backend 100% completo

**Infraestructura Docker** (Fase 1):

- `docker-compose.yml` con healthchecks en postgres y redis
- Bind mounts con hot reload en backend (uvicorn --reload + watchfiles) y frontend (Vite HMR)
- `WATCHFILES_FORCE_POLLING=1` para Windows Docker

**Data Access Layer** (Fase 2 — 8 repositorios):

- Todos los repositorios con puerto ABC + adaptador SQL real
- `AuthRepositorySQL`, `ProductRepositorySQL`, `InventoryMovementRepositorySQL`, `AuditLogRepositorySQL`, `UserRepositorySQL`, `TenantRepositorySQL`, `RoleRepositorySQL`, `AccessRepositorySQL`

**Casos de uso** (Fase 3 — 8 de 8):

- `SignUpUseCase`, `LoginUser`, `CreateProductUseCase`, `RegisterInventoryMovementUseCase`, `GetProductStockUseCase`, `CreateUserUseCase`, `AssignRoleToUserUseCase`, `GetAuditLogByTenantUseCase`

**Controladores y rutas** (Fase 4 — 100%):

- Todos los endpoints activos: auth (register + login + refresh), products, inventory, users, audit, access, health
- Swagger con metadata completa en `/docs`

**Seguridad aplicada** (Fase 4B — 100%):

- CORS habilitado para `localhost:3000`
- `require_permission(code)` — FastAPI dependency que lee snapshot Redis
- RBAC activo en todos los endpoints protegidos
- `POST /api/auth/refresh` — renueva token sin re-login

### ✅ Frontend Sprint 1-2 completos (Fase 5 — 72%)

**Stack**: React 18 + TypeScript 6.0.3 + Vite 5 + Zustand 5 + React Router DOM 7 + Axios 1.15

**Páginas reales** (`src/pages/`):
- `RegisterPage.tsx` — 4 campos, error 409 inline, llama `POST /api/auth/register`
- `LoginPage.tsx` — email + password, error 401 inline, llama `POST /api/auth/login`
- `DashboardPage.tsx` — saludo, 4 KPIs, alertas, movimientos recientes

**IMPORTANTE — estado real del Dashboard**:
- La UI está completa y renderiza correctamente
- Los datos son **simulados** (`setTimeout` + valores hardcodeados)
- No llama al API real (`GET /api/products/` ni otros endpoints)
- El botón "+ Registrar movimiento" muestra un toast "Próximamente"

**Páginas placeholder** (inline en `App.tsx`, no en `src/pages/`):
- `/inventory`, `/movements`, `/team`, `/audit` → `<div>texto - próximamente</div>`

**Componentes completos**:
- Sistema de tokens light/dark (`theme/tokens.ts`)
- Button, Input, BrixoLogo, Card, MetricCard, Badge, AlertCard, Toast, Skeleton
- AppShell responsivo (sidebar 240px desktop + bottom-nav móvil)
- authStore Zustand + interceptor JWT + refresh automático

### ⭕ Sprint 3 pendiente (para MVP completo)

```
14 → Modal + BottomSheet
15 → EmptyState
16 → InventoryPage — tabla real con datos del backend
17 → MovementModal — ENTRADA / SALIDA / AJUSTE
18 → ProductModal — nuevo producto
```

El criterio MVP del ROADMAP ("ver inventario + registrar movimiento") requiere Sprint 3.

---

## Flujo de seguridad (activo)

```text
REQUEST
  │
  ▼
CORSMiddleware               ← capa exterior — preflight OPTIONS sin auth
  │
  ▼
JWTAuthMiddleware            ← valida RS256, inyecta user_id + tenant_id
  │                             publica UserAuthenticated en EventBus
  ▼
UserAccessProjection         ← escucha UserAuthenticated
  │                             consulta roles + permisos en BD
  │                             guarda snapshot en Redis: user_access:{tenant}:{user}
  ▼
require_permission(code)     ← lee snapshot de Redis
  │                             lanza 403 si el código no está en permissions[]
  ▼
Handler / Use Case
  │
  ▼
AuditLogRepository           ← persiste cada acción relevante
```

---

## Reglas no negociables

1. **El dominio nunca importa infraestructura** — sin excepciones
2. **Nombres descriptivos** — el nombre debe explicar qué hace sin leer el cuerpo
3. **Sin comentarios obvios** — solo comentar el WHY cuando no es evidente
4. **Sin sobre-ingeniería** — 3 líneas similares > una abstracción prematura
5. **Evaluar antes de implementar** — si hay un problema arquitectural, señalarlo primero
6. **Multi-tenant siempre** — todo query debe filtrar por `tenant_id`

---

## Documentación de referencia

- `docs/ROADMAP.md` — fuente de verdad del avance por fase
- `docs/ESTATUS.md` — estado detallado actual con Docker e infraestructura
- `docs/CHECKLIST.md` — estado de tareas por fase
- `docs/ARQUITECTURA.md` — diagramas de arquitectura y módulos
- `docs/CHANGELOG.md` — historial de cambios desde el inicio
