# ARQUITECTURA DE BRIXO

**Actualizado**: 28 de abril de 2026  
**Branch activo**: `dev`  
**Progreso MVP**: 100% ✅ — Backend completo, Frontend Sprint 1-3, UI Polish — ver [ROADMAP.md](ROADMAP.md) y [ESTATUS.md](ESTATUS.md)

---

## Principio rector

**Las dependencias apuntan siempre hacia el dominio.** El dominio no conoce ni infraestructura ni adaptadores. Esta regla no es negociable y es la que hace posible conectar agentes de IA o cambiar la base de datos sin tocar la lógica de negocio.

```text
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

---

## Vista de módulos — Estado actual (100% MVP)

```text
┌─────────────────────────────────────────────────────────────┐
│               BRIXO MVP — ESTADO ACTUAL (100%)              │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│   FRONTEND (REACT)       │
│  ✅ COMPLETO (Sprint 1-3) │
│  + UI Polish (28 abr)    │
│  - App.tsx: routing real │
│  - Componentes completos │
│  - API client funcional  │
│  - 18/18 tareas finales  │
└──────────────┬───────────┘
               │ ✅ CORS habilitado
               │
┌──────────────▼───────────────────────────────────────────────┐
│               FASTAPI BACKEND (PYTHON 3.12)                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  main.py — FastAPI app                                       │
│    ├─ CORSMiddleware          (localhost:3000)               │
│    ├─ HTTPLoggingMiddleware   (method/path/status/duration)  │
│    ├─ JWTAuthMiddleware       (RS256, PUBLIC_PATHS)          │
│    ├─ Exception Handlers      (dominio, HTTP, validación)    │
│    └─ EventBus + Lifespan                                    │
│                                                              │
│  CONTROLADORES / RUTAS (Fase 4 — 100%)                      │
│    ├─ POST /api/auth/login + refresh                         │
│    ├─ GET/POST /api/products/ + movimientos                  │
│    ├─ GET/POST /api/users/ + asignación de roles             │
│    ├─ GET /api/audit/?limit=N                                │
│    ├─ GET /me/access                                         │
│    └─ GET /health (sin autenticación)                        │
│                                                              │
│  SEGURIDAD (Fase 4B — 100%)                                  │
│    ├─ require_permission(code) — lee snapshot Redis          │
│    └─ RBAC activo en todos los endpoints protegidos          │
│                                                              │
│  OBSERVABILIDAD (Fase 4C — 100%)                             │
│    ├─ infrastructure/logging.py — JSON a stdout + archivo    │
│    ├─ infrastructure/api/middleware/http_logging.py          │
│    ├─ infrastructure/api/exception_handlers.py               │
│    └─ domain/exceptions.py — jerarquía tipada               │
│                                                              │
│  CASOS DE USO (Fase 3 — 100%)                               │
│    ├─ LoginUser                                              │
│    ├─ CreateProductUseCase                                   │
│    ├─ RegisterInventoryMovementUseCase                       │
│    ├─ GetProductStockUseCase                                 │
│    ├─ CreateUserUseCase                                      │
│    ├─ AssignRoleToUserUseCase                                │
│    └─ GetAuditLogByTenantUseCase                             │
│                                                              │
│  DATA ACCESS LAYER (Fase 2 — 100%)                          │
│    ├─ AuthRepository / AuthRepositorySQL                     │
│    ├─ ProductRepository / ProductRepositorySQL               │
│    ├─ InventoryMovementRepository / SQL                      │
│    ├─ AuditLogRepository / SQL                               │
│    ├─ UserRepository / SQL                                   │
│    ├─ TenantRepository / SQL                                 │
│    ├─ RoleRepository / SQL                                   │
│    └─ AccessRepository / SQL                                 │
│                                                              │
│  DOMINIO (100%)                                              │
│    ├─ contracts.py (Tenant, User, Role, Permission)          │
│    ├─ exceptions.py (jerarquía BrixoException)               │
│    ├─ logs.py (LogEntry, Actor, LogEventType)                │
│    └─ events/ (paquete — auth, user, base)                   │
│                                                              │
└──────────────┬──────────────────────────────────────────────┘
               │ BD completa — 8 tablas + seed
               │
┌──────────────▼──────────────────────────────────────────────┐
│              INFRAESTRUCTURA (Docker Compose)                │
├──────────────────────────────────────────────────────────────┤
│  PostgreSQL 15 — 8 tablas (tenants, users, roles,           │
│                  user_roles, products, inventory_movements,  │
│                  audit_logs, permissions)                    │
│  Redis 7      — snapshot user_access:{tenant}:{user}        │
│  Bind mounts  — hot reload backend + frontend                │
│  Log file     — backend/logs/app.log (10 MB × 5 rotados)    │
└──────────────────────────────────────────────────────────────┘
```

---

## Deuda técnica identificada en audit (28 abr 2026)

Durante una auditoría profunda de código en la sesión 10, se identificaron **9 gaps** que existen en el MVP y requieren resolución en Fase 6 (QA + Hardening):

### Frontend — 5 gaps

1. **DashboardPage — movimientos recientes son datos falsos** (`frontend/src/pages/DashboardPage.tsx:L50-70`)
   - Usa `products.slice(0,5).map()` con `Math.random()` para simular movimientos
   - No llama a `GET /api/products/{id}/movements` ni a ningún endpoint real de movimientos
   - Impacto: Los "Movimientos recientes" no reflejan datos reales, pueden cambiar en cada render

2. **LoginPage + RegisterPage — IDs de usuario hard-coded a "temp"** (`LoginPage.tsx:L45`, `RegisterPage.tsx:L52`)
   - Construyen `user: { id: "temp", tenant_id: "temp", name: "..." }`
   - No llaman a `GET /api/users/me` post-login para hidratar `user_id` y `tenant_id` reales
   - Impacto: Cualquier lógica que dependa de `user.id` o `user.tenant_id` fallará silenciosamente

3. **Bug App.tsx — Rutas privadas hidratadas condicionalmente** (`App.tsx:L30`)
   - Rutas privadas renderizadas solo si `isAuthenticated === true` en el render inicial
   - `hydrate()` ocurre en `useEffect` (async) → al recargar, `isAuthenticated` es `false` al momento del primer render
   - React Router no encuentra la ruta privada y redirige a `/`
   - Impacto: Usuarios con sesión activa en localStorage pueden ser redirigidos al landing al recargar la página

4. **BottomSheet nunca activado** (`MovementModal.tsx:L15`)
   - `MovementModal` siempre recibe `isMobile={false}` (valor por defecto)
   - El componente `BottomSheet.tsx` está completamente implementado pero nunca se usa
   - Impacto: En móvil, los modales de entrada/salida no adaptan a la pantalla (abren como modal desktop)

5. **Rutas post-MVP sin páginas** (`App.tsx:L60-70`)
   - `/movements`, `/team`, `/audit` son placeholders inline sin componentes en `src/pages/`
   - Impacto: Usuarios navegan a estas rutas y ven solo texto "próximamente"

### Backend — 4 gaps

1. **`UserCreated` sin handler** (`application/handlers.py`)
   - El evento `UserCreated` se emite en `SignUpUseCase` y `CreateUserUseCase` pero no tiene handler registrado
   - Solo `UserLoggedIn` y `UserLoginFailed` se persisten en audit log
   - Impacto: Creación de usuarios y signup **no quedan auditados automáticamente**

2. **Métodos sin endpoints** (`adapters/repositories/role_repository_sql.py`)
   - `create_role()` y `revoke_role_from_user()` están implementados en el repositorio
   - No hay endpoints HTTP para estas operaciones
   - Impacto: Funcionalidad de gestión de roles existe pero es inaccesible vía API

3. **Inconsistencia JWT TTL** (`infrastructure/settings.py` + `infra/env/jwt.env`)
   - `JWTSettings` default: 480 minutos (8 horas)
   - `Settings` default: 15 minutos
   - Impacto: Tokens pueden expirar inesperadamente según cuál configuración se use

4. **Endpoint `/me/access` fuera de `/api`** (`infrastructure/routes/`)
   - Inconsistencia con el resto de la API que usa prefijo `/api`
   - Impacto: Confusión en documentación y consumidores de API

---

## Flujo de seguridad completo

```text
REQUEST
  │
  ▼
CORSMiddleware              ← outermost — preflight OPTIONS sin auth
  │
  ▼
HTTPLoggingMiddleware       ← registra method/path/status/duration
  │                            user_id y tenant_id disponibles post-JWT
  ▼
JWTAuthMiddleware           ← valida RS256, inyecta user_id + tenant_id
  │                            publica UserAuthenticated en EventBus
  ▼
UserAccessProjection        ← escucha UserAuthenticated
  │                            consulta roles + permisos en BD
  │                            guarda snapshot en Redis
  ▼
require_permission(code)    ← lee snapshot de Redis
  │                            lanza 403 si el código falta
  ▼
Handler / Use Case          ← lógica de negocio sin conocer seguridad
  │   puede lanzar BrixoException (dominio) o HTTPException
  ▼
Exception Handlers          ← separan mensaje al cliente de log técnico
  │
  ▼
AuditLogRepository          ← persiste cada acción relevante en BD
```

---

## Flujo de datos — request completo

```text
┌─────────┐      ┌────────────────┐      ┌────────────────┐
│ Usuario │      │    Backend     │      │       BD       │
│ (React) │      │   (FastAPI)    │      │ (PostgreSQL)   │
└────┬────┘      └────┬───────────┘      └────┬───────────┘
     │                │                       │
     │ 1. LOGIN       │                       │
     │───────────────>│ ValidateUser          │
     │                │──────────────────────>│
     │                │<──────────────────────│
     │                │ GenerateJWT (RS256)   │
     │ 2. JWT TOKEN   │ Snapshot → Redis      │
     │<───────────────│                       │
     │                │                       │
     │ 3. POST /api/products/                 │
     │   Authorization: Bearer <token>        │
     │───────────────>│ require_permission    │
     │                │ (INVENTORY_WRITE)     │
     │                │ CreateProductUseCase  │
     │                │──────────────────────>│ INSERT products
     │                │ PublishEvent          │ INSERT audit_logs
     │ 4. 201 Created │                       │
     │<───────────────│                       │
```

---

## Jerarquía de excepciones de dominio

```text
BrixoException (base — domain/exceptions.py)
├── NotFoundError        → HTTP 404  NOT_FOUND
├── UnauthorizedError    → HTTP 401  UNAUTHORIZED
├── ForbiddenError       → HTTP 403  FORBIDDEN
├── ConflictError        → HTTP 409  CONFLICT
├── DomainValidationError→ HTTP 422  VALIDATION_ERROR
└── InternalError        → HTTP 500  INTERNAL_ERROR
```

Los exception handlers en `infrastructure/api/exception_handlers.py` interceptan estas excepciones y devuelven al cliente un JSON limpio, mientras envían el detalle técnico al log. El stack trace nunca se expone al cliente.

---

## Estado de módulos

| Módulo | Estado | Notas |
|--------|--------|-------|
| `domain/contracts.py` | ✅ 100% | |
| `domain/exceptions.py` | ✅ 100% | Jerarquía tipada — Fase 4C |
| `domain/logs.py` | ✅ 100% | LogEntry inmutable |
| `domain/events/` | ✅ 100% | Paquete limpio, archivo plano eliminado |
| `application/event_bus` | ✅ 100% | |
| `application/handlers` | ✅ 100% | Auditoría persiste login |
| `application/use_cases/` | ✅ 100% | 7 de 7 |
| `application/services/access/` | ✅ 100% | Directorio renombrado (deuda técnica resuelta) |
| `application/services/auth/` | ✅ 100% | |
| `infrastructure/settings` | ✅ 100% | Pydantic BaseSettings |
| `infrastructure/jwt_service` | ✅ 100% | RS256 |
| `infrastructure/jwt_middleware` | ✅ 100% | PUBLIC_PATHS configurado |
| `infrastructure/permissions` | ✅ 100% | require_permission activo |
| `infrastructure/logging` | ✅ 100% | JSON a stdout + RotatingFileHandler |
| `infrastructure/api/middleware/` | ✅ 100% | HTTPLoggingMiddleware — Fase 4C |
| `infrastructure/api/exception_handlers` | ✅ 100% | 4 handlers globales — Fase 4C |
| `infrastructure/projections/` | ✅ 100% | Snapshot Redis |
| `infrastructure/routes/auth` | ✅ 100% | POST /login + POST /refresh |
| `infrastructure/routes/products` | ✅ 100% | RBAC activo |
| `infrastructure/routes/users` | ✅ 100% | POST /{id}/roles + RBAC |
| `infrastructure/routes/audit` | ✅ 100% | RBAC activo |
| `infrastructure/routes/health` | ✅ 100% | Sin autenticación |
| `adapters/repositories/` | ✅ 100% | 8 repositorios SQL |
| `main.py` | ✅ 100% | Middlewares + exception handlers registrados |
| `infra/init.sql` | ✅ 100% | 8 tablas + seed |
| `frontend/src/` | ✅ 100% | Sprint 1-3 completos + UI Polish — Fase 5 completada |
