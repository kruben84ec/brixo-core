# ESTATUS DEL PROYECTO BRIXO — MVP

**Fecha**: 18 de abril de 2026  
**Rama activa**: `dev`  
**Estado general**: Backend 100% completo + Observabilidad activa — Próximo: Fase 5 Frontend — MVP al 80%

---

## INFORME EJECUTIVO — Sesión 3 (18 abr 2026)

### Qué se logró

Se incorporó al backend una **capa de observabilidad y manejo de excepciones** que no existía. El backend ahora tiene visibilidad operacional completa y un contrato de error consistente para el frontend:

- **Logging a archivo**: los logs JSON estructurados se graban en `backend/logs/app.log` con rotación automática (10 MB × 5 archivos) y son visibles en tiempo real desde Docker sin configuración adicional.
- **Middleware HTTP**: cada request registra `method`, `path`, `status_code`, `duration_ms`, `user_id` y `tenant_id`. Permite detectar endpoints lentos, errores 4xx/5xx y patrones de uso por tenant.
- **Capa de excepciones de dominio**: jerarquía tipada (`NotFoundError`, `ForbiddenError`, `ConflictError`, etc.) que separa el mensaje al usuario del detalle técnico al log. El frontend siempre recibe un JSON limpio con `error` + `message`; el stack trace completo va al log y nunca se expone.
- **Catch-all global**: cualquier excepción no prevista retorna `500 INTERNAL_ERROR` al cliente y registra el traceback completo en el log técnico.

### Qué se espera a continuación

**Fase 5 — Frontend** es el próximo bloque de trabajo (~6h). El backend está listo para ser consumido: CORS activo, tokens renovables, RBAC funcional, errores con formato consistente. El frontend recibirá mensajes legibles en lugar de 500 genéricos, lo que facilita el desarrollo y el debugging de la UI.

---

## PROGRESO GENERAL

```text
FASE 1   Infraestructura          ██████████  100%   ← cerrada
FASE 2   Data Access Layer        ██████████  100%   ← cerrada
FASE 3   Casos de uso             ██████████  100%   ← cerrada
FASE 4   Controladores / Rutas    ██████████  100%   ← cerrada
FASE 4B  Seguridad aplicada       ██████████  100%   ← cerrada
FASE 4C  Observabilidad           ██████████  100%   ← cerrada ← NUEVO
FASE 5   Frontend                 █░░░░░░░░░    5%   ← PROXIMA
FASE 6   QA + Hardening           ░░░░░░░░░░    0%   ← bloqueada por 5
────────────────────────────────────────────────────────────────
TOTAL MVP                         ████████░░   80%
```

---

## PROXIMAS ACCIONES

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

FASE 6 — QA + Hardening (~5h 15min total)
10. F6 Testing manual flujo completo                      45 min
11. F6 Rate limiting POST /api/auth/login (Redis, 429)    30 min
12. F6 Cabeceras de seguridad HTTP (middleware)           30 min
13. F6 Manejo seguro de errores prod (BACKEND_ENVIRONMENT) 20 min  ← parcialmente cubierto por catch-all
14. F6 Protección CSRF — validar esquema Bearer + CORS    20 min
15. F6 request_id en HTTPLoggingMiddleware + header X-Request-ID  30 min
16. F6 docker-compose.prod.yml + README final             60 min
```

---

## FASE 1 — Infraestructura 100%

| Tarea | Estado |
| --- | --- |
| Redis en docker-compose | ✅ |
| Script SQL completo (8 tablas + seed) | ✅ |
| `settings.py` con Pydantic BaseSettings | ✅ |
| `main.py` con lifespan, pool y routers | ✅ |
| Volumen postgres externo — bind mount `./data/postgres` | ✅ |
| Env files montados en contenedor — `./env:/app/env:ro` | ✅ |
| Corregir typo `class Tenat` → `Tenant` | ✅ |
| `GET /health` — endpoint sin autenticación | ✅ |
| Healthchecks en postgres y redis | ✅ |
| Hot reload backend con watchfiles + bind mount | ✅ |
| Hot reload frontend con Vite HMR + bind mount | ✅ |

---

## FASE 2 — Data Access Layer 100%

Todos los repositorios implementados con puerto ABC + adaptador SQL real.

| Repositorio | Puerto | Adaptador SQL |
| --- | --- | --- |
| Auth | `AuthRepository` | `AuthRepositorySQL` |
| Product | `ProductRepository` | `ProductRepositorySQL` |
| InventoryMovement | `InventoryMovementRepository` | `InventoryMovementRepositorySQL` |
| AuditLog | `AuditLogRepository` | `AuditLogRepositorySQL` |
| User | `UserRepository` | `UserRepositorySQL` |
| Tenant | `TenantRepository` | `TenantRepositorySQL` |
| Role | `RoleRepository` | `RoleRepositorySQL` |
| Access | `AccessRepository` | `AccessRepositorySQL` |

---

## FASE 3 — Casos de uso 100% (7 de 7)

| Use Case | Archivo |
| --- | --- |
| `LoginUser` | `application/services/auth/login_user.py` |
| `CreateProductUseCase` | `application/use_cases/create_product.py` |
| `RegisterInventoryMovementUseCase` | `application/use_cases/register_inventory_movement.py` |
| `GetProductStockUseCase` | `application/use_cases/get_product_stock.py` |
| `CreateUserUseCase` | `application/use_cases/create_user.py` |
| `AssignRoleToUserUseCase` | `application/use_cases/assign_role_to_user.py` |
| `GetAuditLogByTenantUseCase` | `application/use_cases/get_audit_log_by_tenant.py` |

---

## FASE 4 — Controladores y Rutas 100%

| Componente | Rutas |
| --- | --- |
| `AuthController` | `POST /api/auth/login`, `POST /api/auth/refresh` |
| `ProductController` | `GET /api/products/`, `POST /api/products/`, `GET /api/products/{id}` |
| `InventoryController` | `POST /api/products/{id}/movements`, `GET /api/products/{id}/movements` |
| `UserController` | `GET /api/users/`, `POST /api/users/`, `POST /api/users/{id}/roles` |
| `AuditController` | `GET /api/audit/?limit=N` |
| `AccessController` | `GET /me/access` — lee snapshot de Redis |
| `HealthController` | `GET /health` — sin autenticación |
| Middleware | `PUBLIC_PATHS`: `/docs /redoc /openapi.json /health /api/auth/login` |

---

## FASE 4B — Seguridad aplicada 100%

| Tarea | Archivo | Estado |
| --- | --- | --- |
| CORS en `main.py` — permite llamadas desde `:3000` | `backend/main.py` | ✅ |
| `require_permission(code)` — FastAPI dependency | `infrastructure/security/permissions.py` | ✅ |
| RBAC aplicado en endpoints de lectura y escritura | `routes/products.py`, `routes/users.py`, `routes/audit.py` | ✅ |
| `POST /api/auth/refresh` — renueva token sin re-login | `infrastructure/api/routes/auth.py` | ✅ |

### Permisos activos por endpoint

| Endpoint | Permiso |
| --- | --- |
| `GET /api/products/` | `INVENTORY_READ` |
| `POST /api/products/` | `INVENTORY_WRITE` |
| `POST /api/products/{id}/movements` | `INVENTORY_WRITE` |
| `GET /api/users/` | `USERS_READ` |
| `POST /api/users/` | `USERS_WRITE` |
| `POST /api/users/{id}/roles` | `ROLES_WRITE` |
| `GET /api/audit/` | `AUDIT_READ` |

---

## FASE 4C — Observabilidad y Manejo de Excepciones 100% ← NUEVO

### Componentes implementados

| Componente | Archivo | Estado |
| --- | --- | --- |
| Logger JSON con `RotatingFileHandler` (stdout + archivo) | `infrastructure/logging.py` | ✅ |
| `HTTPLoggingMiddleware` — registra cada request HTTP | `infrastructure/api/middleware/http_logging.py` | ✅ |
| Jerarquía de excepciones de dominio tipadas | `domain/exceptions.py` | ✅ |
| `brixo_exception_handler` — dominio → JSON limpio + log ERROR | `infrastructure/api/exception_handlers.py` | ✅ |
| `http_exception_handler` — HTTPException → JSON + log WARNING | `infrastructure/api/exception_handlers.py` | ✅ |
| `validation_exception_handler` — Pydantic → campos con error | `infrastructure/api/exception_handlers.py` | ✅ |
| `unhandled_exception_handler` — catch-all → 500 + traceback al log | `infrastructure/api/exception_handlers.py` | ✅ |
| Logs persistidos en `backend/logs/app.log` vía bind mount Docker | `infra/docker-compose.yml` | ✅ |

### Flujo de logging completo

```text
REQUEST
  │
  ▼
CORSMiddleware
  │
  ▼
HTTPLoggingMiddleware      ← registra method/path/status/duration/user_id/tenant_id
  │
  ▼
JWTAuthMiddleware
  │
  ▼
Handler / Use Case
  │  lanza BrixoException, HTTPException, ValidationError o Exception no prevista
  ▼
Exception Handlers ─────────────────────────────────────────────────────
  ├── BrixoException      → log ERROR (detail técnico) + JSON {error, message}
  ├── RequestValidationError → log WARNING + JSON {error, message, fields[]}
  ├── HTTPException       → log WARNING + JSON {error, message}
  └── Exception (catch-all) → log ERROR (traceback) + JSON 500 genérico
```

### Persistencia de logs en Docker

```text
Contenedor: /app/logs/app.log
Host:       backend/logs/app.log      ← accesible sin docker exec
            backend/logs/app.log.1    ← rotados automáticamente
            …                            (10 MB × 5 archivos)
```

Cubierto por el bind mount existente `../backend:/app`. No se necesita volumen adicional.

---

## FASE 5 — Frontend 5%

Solo existe `<h1>Brixo</h1>` en `frontend/src/App.jsx`.  
CORS activo, errores con formato consistente — puede arrancar ahora.

| Tarea | Tiempo | Estado |
| --- | --- | --- |
| `npm install axios react-router-dom zustand` | 15 min | ⭕ |
| `src/services/api.js` — axios con interceptor JWT y refresh | 30 min | ⭕ |
| `authStore` (Zustand) — token, usuario, logout | 30 min | ⭕ |
| `LoginPage` | 50 min | ⭕ |
| `ProductListPage` | 60 min | ⭕ |
| `ProductFormModal` | 40 min | ⭕ |
| `MovementFormModal` | 50 min | ⭕ |
| `DashboardPage` — stock actual con alertas de mínimo | 45 min | ⭕ |
| `AuditLogPage` | 40 min | ⭕ |
| Routing + layout + rutas privadas | 35 min | ⭕ |
| Estilos básicos | 40 min | ⭕ |

---

## FASE 6 — QA + Hardening 0%

Bloqueada por Fase 5. Algunos ítems ya tienen base gracias a Fase 4C.

| Tarea | Tipo | Tiempo | Estado |
| --- | --- | --- | --- |
| Testing manual flujo completo | QA | 45 min | ⭕ |
| Fix de bugs encontrados | Dev | 60 min | ⭕ |
| Rate limiting en `POST /api/auth/login` | Seguridad | 30 min | ⭕ |
| Validar TTL Redis snapshot y expiración de token | Seguridad | 20 min | ⭕ |
| Cabeceras de seguridad HTTP (middleware) | Seguridad | 30 min | ⭕ |
| `request_id` en `HTTPLoggingMiddleware` + header `X-Request-ID` | Observabilidad | 30 min | ⭕ |
| README con instrucciones de uso | Docs | 30 min | ⭕ |
| `docker-compose.prod.yml` | Infra | 30 min | ⭕ |

---

## INFRAESTRUCTURA DOCKER — Estado actual

### Comunicación entre contenedores

```text
[brixo-postgres :5432]  ←── backend (DNS: postgres)
[brixo-redis    :6379]  ←── backend (DNS: redis)
[brixo-backend  :8000]  ←── frontend JS en navegador (localhost:8000)
[brixo-frontend :3000]  ←── navegador del usuario (localhost:3000)
```

### Hot reload y logs por servicio

| Servicio | Mecanismo | Bind mount | Logs |
| --- | --- | --- | --- |
| Backend | uvicorn `--reload` + watchfiles | `../backend:/app` | `backend/logs/app.log` ← host |
| Frontend | Vite HMR | `../frontend:/app` | stdout |
| Base de datos | Datos persistentes | `./data/postgres:/var/lib/postgresql/data` | — |

---

## DEUDA TECNICA ACTIVA

| # | Ítem | Archivo | Acción |
| --- | --- | --- | --- |
| 1 | `ocurred_at` → `occurred_at` | `domain/events/base.py` | Renombrar atributo |
| 2 | Directorio `acccess/` (triple c) | `application/services/` | Renombrar directorio |
| 3 | `asssign_role.py` vacío | `application/services/` | Eliminar archivo |
| 4 | `aut_service.py` huérfano | `application/auth/` | Eliminar archivo |
| 5 | `domain/events.py` duplicado del paquete | `domain/` | Eliminar archivo plano |
| 6 | `OPENAI_API_KEY` en `infra/env/backend.env` | `infra/env/backend.env` | Rotar clave en OpenAI y mover a variable de entorno local no rastreada por git |

---

**Documento actualizado**: 18 de abril de 2026 (sesión 3)  
**Próxima revisión**: Al completar Fase 5 Frontend
