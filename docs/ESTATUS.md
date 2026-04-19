# ESTATUS DEL PROYECTO BRIXO — MVP

**Fecha**: 18 de abril de 2026  
**Rama activa**: `dev`  
**Estado general**: Backend 100% + Observabilidad + Deuda técnica resuelta — Próximo: Fase 5 Frontend — MVP al 80%

---

## Informe ejecutivo — Sesión 3 (18 abr 2026)

### Qué se logró

Se resolvió toda la deuda técnica acumulada y se incorporó una capa de observabilidad y manejo de excepciones completa:

**Deuda técnica — 6 ítems resueltos:**

- Typo `ocurred_at` corregido en la clase base `DomainEvent`
- Directorio `acccess/` (triple c) renombrado a `access/`, con 2 imports actualizados
- Archivo vacío `asssign_role.py` eliminado
- Archivo huérfano `aut_service.py` eliminado
- Módulo duplicado `domain/events.py` eliminado; import corregido a `domain.events.base`
- Confirmado que `infra/env/*.env` no se versiona en git

**Observabilidad — Fase 4C completada:**

- Logs JSON estructurados escritos a `backend/logs/app.log` con rotación automática y visibles desde Docker sin configuración adicional
- `HTTPLoggingMiddleware` registra cada request con `method`, `path`, `status_code`, `duration_ms`, `user_id` y `tenant_id`
- Jerarquía tipada de excepciones de dominio (`BrixoException` y subclases) que separa el mensaje al usuario del detalle técnico al log
- Catch-all global: cualquier excepción no prevista retorna `500` genérico al cliente y registra el traceback completo en el log

**Documentación — Actualización completa:**

- `README.md` reescrito con enfoque de producto y potencial de IA
- `ARQUITECTURA.md`, `CHECKLIST.md`, `CHANGELOG.md`, `ROADMAP.md` y `OBSERVABILIDAD.md` actualizados al estado real

### Qué se espera a continuación

**Fase 5 — Frontend** (~6 horas). El backend está completamente listo: CORS activo, tokens renovables, RBAC funcional, errores con formato JSON consistente. El frontend puede arrancar ahora mismo con `npm install`.

---

## Progreso general

```text
FASE 1   Infraestructura          ██████████  100%   ← cerrada
FASE 2   Data Access Layer        ██████████  100%   ← cerrada
FASE 3   Casos de uso             ██████████  100%   ← cerrada
FASE 4   Controladores / Rutas    ██████████  100%   ← cerrada
FASE 4B  Seguridad aplicada       ██████████  100%   ← cerrada
FASE 4C  Observabilidad           ██████████  100%   ← cerrada
FASE 5   Frontend                 █░░░░░░░░░    5%   ← PROXIMA
FASE 6   QA + Hardening           ░░░░░░░░░░    0%   ← bloqueada por 5
────────────────────────────────────────────────────
TOTAL MVP                         ████████░░   80%
```

---

## Próximas acciones

```text
FASE 5 — Frontend (~6h total)
1. F5  npm install axios react-router-dom zustand         15 min
2. F5  src/services/api.js — cliente axios + interceptor  30 min
3. F5  authStore Zustand — token, usuario, logout         30 min
4. F5  LoginPage                                          50 min
5. F5  ProductListPage + ProductFormModal                100 min
6. F5  MovementFormModal                                  50 min
7. F5  DashboardPage + AuditLogPage                       85 min
8. F5  Routing + layout + rutas privadas                  35 min
9. F5  Estilos básicos                                    40 min

FASE 6 — QA + Hardening (~4h 25min total)
10. F6 Testing manual flujo completo                      45 min
11. F6 Rate limiting POST /api/auth/login (Redis, 429)    30 min
12. F6 Cabeceras de seguridad HTTP (middleware)           30 min
13. F6 request_id en HTTPLoggingMiddleware                30 min
14. F6 docker-compose.prod.yml + README final             60 min
```

---

## Fase 1 — Infraestructura 100%

| Tarea | Estado |
|-------|--------|
| Redis en docker-compose | ✅ |
| Script SQL completo (8 tablas + seed) | ✅ |
| `settings.py` con Pydantic BaseSettings | ✅ |
| `main.py` con lifespan, pool y routers | ✅ |
| Volumen postgres externo — bind mount `./data/postgres` | ✅ |
| Env files montados en contenedor — `./env:/app/env:ro` | ✅ |
| `GET /health` — endpoint sin autenticación | ✅ |
| Healthchecks en postgres y redis | ✅ |
| Hot reload backend con watchfiles + bind mount | ✅ |
| Hot reload frontend con Vite HMR + bind mount | ✅ |

---

## Fase 2 — Data Access Layer 100%

| Repositorio | Puerto | Adaptador SQL |
|-------------|--------|---------------|
| Auth | `AuthRepository` | `AuthRepositorySQL` |
| Product | `ProductRepository` | `ProductRepositorySQL` |
| InventoryMovement | `InventoryMovementRepository` | `InventoryMovementRepositorySQL` |
| AuditLog | `AuditLogRepository` | `AuditLogRepositorySQL` |
| User | `UserRepository` | `UserRepositorySQL` |
| Tenant | `TenantRepository` | `TenantRepositorySQL` |
| Role | `RoleRepository` | `RoleRepositorySQL` |
| Access | `AccessRepository` | `AccessRepositorySQL` |

---

## Fase 3 — Casos de uso 100%

| Use Case | Archivo |
|----------|---------|
| `LoginUser` | `application/services/auth/login_user.py` |
| `CreateProductUseCase` | `application/use_cases/create_product.py` |
| `RegisterInventoryMovementUseCase` | `application/use_cases/register_inventory_movement.py` |
| `GetProductStockUseCase` | `application/use_cases/get_product_stock.py` |
| `CreateUserUseCase` | `application/use_cases/create_user.py` |
| `AssignRoleToUserUseCase` | `application/use_cases/assign_role_to_user.py` |
| `GetAuditLogByTenantUseCase` | `application/use_cases/get_audit_log_by_tenant.py` |

---

## Fase 4 — Controladores y Rutas 100%

| Componente | Rutas |
|------------|-------|
| `AuthController` | `POST /api/auth/login`, `POST /api/auth/refresh` |
| `ProductController` | `GET /api/products/`, `POST /api/products/`, `GET /api/products/{id}` |
| `InventoryController` | `POST /api/products/{id}/movements`, `GET /api/products/{id}/movements` |
| `UserController` | `GET /api/users/`, `POST /api/users/`, `POST /api/users/{id}/roles` |
| `AuditController` | `GET /api/audit/?limit=N` |
| `AccessController` | `GET /me/access` — lee snapshot de Redis |
| `HealthController` | `GET /health` — sin autenticación |

---

## Fase 4B — Seguridad aplicada 100%

| Tarea | Archivo | Estado |
|-------|---------|--------|
| CORS en `main.py` | `backend/main.py` | ✅ |
| `require_permission(code)` — FastAPI dependency | `infrastructure/security/permissions.py` | ✅ |
| RBAC aplicado en endpoints críticos | `routes/products.py`, `routes/users.py`, `routes/audit.py` | ✅ |
| `POST /api/auth/refresh` — renueva token sin re-login | `infrastructure/api/routes/auth.py` | ✅ |

---

## Fase 4C — Observabilidad y Manejo de Excepciones 100%

| Componente | Archivo | Estado |
|------------|---------|--------|
| Logger JSON con `RotatingFileHandler` | `infrastructure/logging.py` | ✅ |
| `HTTPLoggingMiddleware` | `infrastructure/api/middleware/http_logging.py` | ✅ |
| Jerarquía de excepciones de dominio | `domain/exceptions.py` | ✅ |
| Exception handlers globales (4 tipos) | `infrastructure/api/exception_handlers.py` | ✅ |
| Logs en `backend/logs/app.log` — visible en host vía bind mount | `infra/docker-compose.yml` | ✅ |

### Stack de middlewares activo

```text
CORS → HTTPLogging → JWT → Handler → ExceptionHandlers → AuditLog
```

### Logs en Docker

```text
Contenedor: /app/logs/app.log
Host:       backend/logs/app.log   ← sin docker exec, acceso directo
```

---

## Fase 5 — Frontend 5%

Solo existe `<h1>Brixo</h1>` en `frontend/src/App.jsx`.  
El backend está completamente listo — puede arrancar ahora.

| Tarea | Tiempo | Estado |
|-------|--------|--------|
| `npm install axios react-router-dom zustand` | 15 min | ⭕ |
| `src/services/api.js` — axios con interceptor JWT y refresh | 30 min | ⭕ |
| `authStore` (Zustand) — token, usuario, logout | 30 min | ⭕ |
| `LoginPage` | 50 min | ⭕ |
| `ProductListPage` | 60 min | ⭕ |
| `ProductFormModal` | 40 min | ⭕ |
| `MovementFormModal` | 50 min | ⭕ |
| `DashboardPage` | 45 min | ⭕ |
| `AuditLogPage` | 40 min | ⭕ |
| Routing + layout + rutas privadas | 35 min | ⭕ |
| Estilos básicos | 40 min | ⭕ |

---

## Fase 6 — QA + Hardening 0%

Bloqueada por Fase 5.

| Tarea | Tipo | Tiempo | Estado |
|-------|------|--------|--------|
| Testing manual flujo completo | QA | 45 min | ⭕ |
| Fix de bugs encontrados | Dev | 60 min | ⭕ |
| Rate limiting en `POST /api/auth/login` | Seguridad | 30 min | ⭕ |
| Validar TTL Redis snapshot y expiración de token | Seguridad | 20 min | ⭕ |
| Cabeceras de seguridad HTTP | Seguridad | 30 min | ⭕ |
| `request_id` en `HTTPLoggingMiddleware` | Observabilidad | 30 min | ⭕ |
| `docker-compose.prod.yml` | Infra | 30 min | ⭕ |

---

## Deuda técnica — RESUELTA ✅

| # | Ítem | Resolución |
|---|------|-----------|
| 1 | `ocurred_at` → `occurred_at` | Corregido en `domain/events/base.py` |
| 2 | Directorio `acccess/` (triple c) | Renombrado a `access/`, 2 imports actualizados |
| 3 | `asssign_role.py` vacío | Eliminado con `git rm` |
| 4 | `aut_service.py` huérfano | Eliminado con `git rm` |
| 5 | `domain/events.py` duplicado | Eliminado; import corregido a `domain.events.base` |
| 6 | `OPENAI_API_KEY` en `backend.env` | `infra/env/*.env` excluido de git en `.gitignore` |

---

**Documento actualizado**: 18 de abril de 2026 (sesión 3)  
**Próxima revisión**: Al completar Fase 5 Frontend
