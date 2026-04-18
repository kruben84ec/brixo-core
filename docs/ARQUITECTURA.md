# ARQUITECTURA DE BRIXO — ESTADO ACTUAL

**Actualizado**: 18 de abril de 2026
**Branch activo**: dev (mergeado desde feature/auth-core)
**Referencia de progreso**: ver `ROADMAP.md` y `ESTATUS.md`

---

## VISTA ACTUAL (18 de abril de 2026)

```
┌─────────────────────────────────────────────────────────────┐
│               BRIXO MVP — ESTADO ACTUAL (58%)               │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│   FRONTEND (REACT)       │
│  ⚠️  MINIMO              │
│  - App.jsx: placeholder  │
│  - Sin componentes       │
│  - Sin routing           │
│  - Sin API client        │
└──────────────┬───────────┘
               │
               │ ❌ CORS no configurado (Fase 4B pendiente)
               │
┌──────────────▼───────────────────────────────────────────────┐
│               FASTAPI BACKEND (PYTHON)                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ main.py — FastAPI app funcional                         │
│     ├─ JWTAuthMiddleware activo                              │
│     ├─ Lifespan con pool + routers                          │
│     ├─ EventBus integrado                                    │
│     └─ ❌ CORS no configurado aún                           │
│                                                              │
│  ✅ CONTROLADORES / RUTAS (Fase 4 — 90%)                    │
│     ├─ POST /api/auth/login ✅                               │
│     ├─ GET  /api/products/, POST /api/products/ ✅          │
│     ├─ GET  /api/products/{id} ✅                            │
│     ├─ POST/GET /api/products/{id}/movements ✅             │
│     ├─ GET/POST /api/users/ ✅                               │
│     ├─ GET /api/audit/?limit=N ✅                            │
│     ├─ GET /me/access ✅                                     │
│     ├─ ❌ POST /api/users/{id}/roles (pendiente)            │
│     ├─ ❌ GET /health (pendiente)                           │
│     └─ ❌ POST /api/auth/refresh (Fase 4B)                  │
│                                                              │
│  ✅ CASOS DE USO (Fase 3 — 100%)                            │
│     ├─ LoginUser ✅                                          │
│     ├─ CreateProductUseCase ✅                               │
│     ├─ RegisterInventoryMovementUseCase ✅                   │
│     ├─ GetProductStockUseCase ✅                             │
│     ├─ CreateUserUseCase ✅                                  │
│     ├─ AssignRoleToUserUseCase ✅                            │
│     └─ GetAuditLogByTenantUseCase ✅                         │
│                                                              │
│  ✅ DATA ACCESS LAYER (Fase 2 — 100%)                       │
│     ├─ AuthRepository / AuthRepositorySQL ✅                 │
│     ├─ ProductRepository / ProductRepositorySQL ✅          │
│     ├─ InventoryMovementRepository / SQL ✅                  │
│     ├─ AuditLogRepository / SQL ✅                           │
│     ├─ UserRepository / SQL ✅                               │
│     ├─ TenantRepository / SQL ✅                             │
│     ├─ RoleRepository / SQL ✅                               │
│     └─ AccessRepository / SQL ✅                             │
│                                                              │
│  ✅ DOMINIO (95%)                                            │
│     ├─ contracts.py ⚠️ (typo Tenat → Tenant pendiente)     │
│     ├─ events/ (paquete) ✅                                  │
│     ├─ auth.py ✅                                            │
│     └─ logs.py ✅                                            │
│                                                              │
│  ✅ INFRAESTRUCTURA                                          │
│     ├─ settings.py (Pydantic BaseSettings) ✅               │
│     ├─ jwt_service.py (RS256) ✅                             │
│     ├─ jwt_middleware.py ✅                                   │
│     ├─ user_access_projection.py (Redis snapshot) ✅        │
│     ├─ redis_client.py ✅                                    │
│     └─ logging.py ✅                                         │
│                                                              │
│  ❌ SEGURIDAD APLICADA (Fase 4B — 0%)                       │
│     ├─ CORS en main.py (pendiente)                          │
│     ├─ require_permission(code) dependency (pendiente)      │
│     └─ RBAC no verifica permisos en endpoints               │
│                                                              │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ ✅ BD completa — 8 tablas + seed
               │
┌──────────────▼──────────────────────────────────────────────┐
│              INFRAESTRUCTURA (Docker)                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ PostgreSQL 15                                            │
│     ├─ tenants ✅                                            │
│     ├─ users ✅                                              │
│     ├─ roles ✅                                              │
│     ├─ user_roles ✅                                         │
│     ├─ products ✅                                           │
│     ├─ inventory_movements ✅                                │
│     ├─ audit_logs ✅                                         │
│     └─ permissions ✅                                        │
│                                                              │
│  ✅ Redis 7-alpine                                           │
│     ├─ En docker-compose ✅                                  │
│     └─ Snapshot user_access:{tenant}:{user} ✅              │
│                                                              │
│  ✅ docker-compose.yml                                       │
│     ├─ Bind mount ./data/postgres ✅                         │
│     ├─ Env files ./env:/app/env:ro ✅                        │
│     └─ Los 4 servicios configurados ✅                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## VISTA FINAL (objetivo del MVP)

```
┌─────────────────────────────────────────────────────────────┐
│              BRIXO MVP — COMPLETAMENTE FUNCIONAL             │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│   FRONTEND (REACT + VITE)    │ ← Fase 5 pendiente
│  ├─ LoginPage                │
│  ├─ ProductListPage          │
│  ├─ DashboardPage            │
│  ├─ AuditLogPage             │
│  ├─ ProductFormModal         │
│  ├─ MovementFormModal        │
│  ├─ API Service (axios)      │
│  ├─ Zustand authStore        │
│  └─ Routing + rutas privadas │
└──────────────┬───────────────┘
               │ CORS habilitado
               │
┌──────────────▼────────────────────────────────────────────────┐
│              FASTAPI BACKEND (PYTHON)                         │
├────────────────────────────────────────────────────────────────┤
│                                                               │
│  main.py con CORS + Auth + Logging + Lifespan + Routers      │
│                                                               │
│  RBAC activo en cada endpoint (require_permission)           │
│  POST /api/auth/refresh — tokens renovables                  │
│  GET  /health — accesible sin token                          │
│  POST /api/users/{id}/roles — asignación de roles            │
│                                                               │
│  Todo lo de la Vista Actual más arriba ✅                     │
│                                                               │
└──────────────┬────────────────────────────────────────────────┘
               │ CRUD operativo + Auditoría
               │
┌──────────────▼────────────────────────────────────────────────┐
│         BD + Infra Docker (ya funcional)                      │
│  PostgreSQL 15 + Redis 7 + docker-compose ✅                  │
└────────────────────────────────────────────────────────────────┘
```

---

## FLUJO DE SEGURIDAD (implementado)

```
REQUEST
  │
  ▼
JWTAuthMiddleware            ← valida RS256, inyecta user_id + tenant_id
  │                             publica UserAuthenticated en EventBus
  ▼
UserAccessProjection         ← escucha UserAuthenticated
  │                             consulta roles + permisos en BD
  │                             guarda snapshot en Redis: user_access:{tenant}:{user}
  ▼
require_permission(code)     ← Fase 4B PENDIENTE — leerá snapshot de Redis
  │                             lanza 403 si el código no está en permissions[]
  ▼
Handler / Use Case           ← lógica de negocio sin conocer seguridad
  │
  ▼
AuditLogRepository           ← persiste cada acción relevante en audit_logs
```

**Claims del JWT**: `sub` (user_id), `tenant` (tenant_id), `iat`, `exp`
**Algoritmo**: RS256 — par de claves RSA 2048 bits
**TTL access token**: 8 horas

---

## FLUJO DE DATOS (post-MVP)

```
┌─────────┐      ┌────────────────┐      ┌────────────────┐
│ Usuario │      │    Backend     │      │       BD       │
│ (React) │      │   (FastAPI)    │      │ (PostgreSQL)   │
└────┬────┘      └────┬───────────┘      └────┬───────────┘
     │                │                       │
     │ 1. LOGIN       │                       │
     │───────────────>│                       │
     │                │ ValidateUser          │
     │                │──────────────────────>│
     │                │<──────────────────────│
     │                │ GenerateJWT (RS256)   │
     │ 2. TOKEN       │                       │
     │<───────────────│ Snapshot → Redis      │
     │                │                       │
     │ 3. CREATE PRODUCT                      │
     │───────────────>│                       │
     │                │ require_permission    │
     │                │ (INVENTORY_WRITE)     │
     │                │ CreateProductUseCase  │
     │                │──────────────────────>│ INSERT products
     │                │ PublishEvent          │ INSERT audit_logs
     │ 4. RESPONSE    │                       │
     │<───────────────│                       │
```

---

## DEPENDENCIAS ENTRE CAPAS

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

---

## ESTADO DE MÓDULOS

| Módulo | Estado | Notas |
|--------|--------|-------|
| `domain/` | 95% | Typo `Tenat` pendiente |
| `application/event_bus` | 95% | Funcional, revisar handlers async |
| `application/handlers` | 90% | Auditoría persiste login OK |
| `application/use_cases/` | 100% | 7 de 7 implementados |
| `infrastructure/settings` | 100% | |
| `infrastructure/jwt_service` | 95% | |
| `infrastructure/jwt_middleware` | 100% | PUBLIC_PATHS configurado |
| `infrastructure/redis` | 100% | |
| `infrastructure/projection` | 100% | Snapshot en Redis |
| `infrastructure/routes/auth` | 90% | Falta POST /refresh |
| `infrastructure/routes/products` | 100% | Sin RBAC aún |
| `infrastructure/routes/users` | 90% | Falta POST /{id}/roles |
| `infrastructure/routes/inventory` | 100% | Sin RBAC aún |
| `infrastructure/routes/audit` | 100% | Sin RBAC aún |
| `adapters/repositories/` | 100% | 8 repositorios SQL |
| `main.py` | 95% | Falta CORS |
| `init.sql` | 100% | 8 tablas + seed |
| `frontend/src/` | 5% | Solo `<h1>Brixo</h1>` |
