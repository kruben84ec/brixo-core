# ARQUITECTURA DE BRIXO

**Actualizado**: 18 de abril de 2026  
**Branch activo**: `dev`  
**Progreso MVP**: 80% — ver [ROADMAP.md](ROADMAP.md) y [ESTATUS.md](ESTATUS.md)

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

## Vista de módulos — Estado actual (80% MVP)

```text
┌─────────────────────────────────────────────────────────────┐
│               BRIXO MVP — ESTADO ACTUAL (80%)               │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│   FRONTEND (REACT)       │
│  ⚠️  EN CURSO            │
│  - App.jsx: placeholder  │
│  - Sin componentes       │
│  - Sin routing           │
│  - Sin API client        │
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
| `frontend/src/` | ⭕ 5% | Solo placeholder — Fase 5 pendiente |
