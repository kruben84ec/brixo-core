# ESTATUS DEL PROYECTO BRIXO — MVP

**Fecha**: 19 de abril de 2026  
**Rama activa**: `dev`  
**Estado general**: Backend 100% + SaaS Auth + Bugs críticos resueltos — Próximo: Fase 5 Frontend (TypeScript + Landing Page) — MVP al 83%

---

## Informe ejecutivo — Sesión 4 (19 abr 2026)

### Qué se logró

Se consolidó el backend con correcciones críticas de runtime y se completó el flujo de registro SaaS:

**Flujo de registro SaaS — nuevo:**

- `POST /api/auth/register` — endpoint público que crea tenant + usuario OWNER en una sola operación
- `SignUpUseCase` — caso de uso dedicado que orquesta creación de tenant y usuario
- El usuario recibe el JWT al registrarse — no necesita hacer login por separado
- El formulario requiere solo 4 campos: empresa, nombre, email, contraseña

**Bugs críticos de runtime — 5 resueltos:**

- `DATABASE_URL` ausente en `backend.env` → `psycopg2.connect(None)` fallaba en arranque
- `JWT_ACCESS_TOKEN_EXP_MINUTES=480 # 8 hours` → comentario inline rompía parsing de Pydantic como int
- `logging.env` vacío → nivel de log indeterminado (ahora `LOGGING_LEVEL=INFO`)
- `email-validator` ausente en `requirements.txt` → `EmailStr` lanzaba `ModuleNotFoundError`
- `"name"` como clave en `extra={}` del logger → `KeyError` en `LogRecord` (3 repositorios afectados: tenant, product, role)

**Manejo de excepciones — refactorización:**

- Login ahora lanza `UnauthorizedError` (BrixoException, 401) en lugar de `ValueError` — elimina dependencia del `try/except` en el route
- `TenantRepositorySQL` captura `UniqueViolation` de psycopg2 y eleva `ConflictError` (409) con mensaje legible al usuario
- `verify_password` ahora es seguro contra cualquier excepción de bcrypt — retorna `False` en lugar de propagar

### Qué se espera a continuación

**Fase 5 — Frontend** (~6 horas). El backend está completamente funcional y validado. CORS activo, registro SaaS operativo, todos los errores retornan JSON consistente. El frontend puede arrancar ahora mismo.

---

## Progreso general

```text
FASE 1   Infraestructura          ██████████  100%   ← cerrada
FASE 2   Data Access Layer        ██████████  100%   ← cerrada
FASE 3   Casos de uso             ██████████  100%   ← cerrada
FASE 4   Controladores / Rutas    ██████████  100%   ← cerrada
FASE 4B  Seguridad aplicada       ██████████  100%   ← cerrada
FASE 4C  Observabilidad           ██████████  100%   ← cerrada
FASE 4D  SaaS Auth + Bugs         ██████████  100%   ← cerrada (nueva)
FASE 5   Frontend                 █░░░░░░░░░    5%   ← PROXIMA
FASE 6   QA + Hardening           ░░░░░░░░░░    0%   ← bloqueada por 5
────────────────────────────────────────────────────
TOTAL MVP                         ████████░░   83%
```

---

## Próximas acciones

```text
FASE 5 — Frontend (~6h total)
1. F5  npm install axios react-router-dom zustand         15 min
2. F5  src/services/api.js — cliente axios + interceptor  30 min
3. F5  authStore Zustand — token, usuario, logout         30 min
4. F5  RegisterPage — formulario SaaS (4 campos)          50 min
5. F5  LoginPage                                          50 min
6. F5  ProductListPage + ProductFormModal                100 min
7. F5  MovementFormModal                                  50 min
8. F5  DashboardPage + AuditLogPage                       85 min
9. F5  Routing + layout + rutas privadas                  35 min
10. F5 Estilos básicos                                    40 min

FASE 6 — QA + Hardening (~4h 25min total)
11. F6 Testing manual flujo completo                      45 min
12. F6 Rate limiting POST /api/auth/login (Redis, 429)    30 min
13. F6 Cabeceras de seguridad HTTP (middleware)           30 min
14. F6 request_id en HTTPLoggingMiddleware                30 min
15. F6 docker-compose.prod.yml + README final             60 min
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
| `SignUpUseCase` | `application/use_cases/signup.py` |
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
| `AuthController` | `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/register` |
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
| `PUBLIC_PATHS` — login y register sin token | `infrastructure/security/jwt_middleware.py` | ✅ |

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

---

## Fase 4D — SaaS Auth + Correcciones de Runtime 100% ← NUEVA

| Tarea | Archivo | Estado |
|-------|---------|--------|
| `POST /api/auth/register` — registro SaaS público (tenant + OWNER) | `routes/auth.py` | ✅ |
| `SignUpUseCase` — crea tenant y usuario en secuencia | `use_cases/signup.py` | ✅ |
| `DATABASE_URL` en `backend.env` | `infra/env/backend.env` | ✅ |
| `JWT_ACCESS_TOKEN_EXP_MINUTES` sin comentario inline | `infra/env/jwt.env` | ✅ |
| `LOGGING_LEVEL=INFO` en `logging.env` | `infra/env/logging.env` | ✅ |
| `email-validator` en `requirements.txt` | `backend/requirements.txt` | ✅ |
| `"name"` → `"tenant_name"/"product_name"/"role_name"` en `extra={}` | 3 repositorios SQL | ✅ |
| Login usa `UnauthorizedError` (BrixoException 401) — no `ValueError` | `services/auth/login_user.py` | ✅ |
| `TenantRepositorySQL` captura `UniqueViolation` → `ConflictError` 409 | `adapters/tenant_repository_sql.py` | ✅ |
| `verify_password` seguro contra cualquier excepción de bcrypt | `infrastructure/security/passwords.py` | ✅ |

### Endpoints públicos (sin token)

| Endpoint | Descripción |
|----------|-------------|
| `POST /api/auth/login` | Autenticación con email + password |
| `POST /api/auth/register` | Registro SaaS: crea empresa + usuario OWNER |
| `GET /health` | Estado del servicio |
| `GET /docs` | Swagger UI |

---

## Fase 5 — Frontend 5%

Solo existe `<h1>Brixo</h1>` en `frontend/src/App.tsx`.  
El backend está completamente listo — puede arrancar ahora.

**Stack confirmado**: React 18 + Vite 5 + **TypeScript 5** + Zustand + React Router + Axios

| Tarea | Tiempo | Estado |
|-------|--------|--------|
| Setup TypeScript: `tsconfig.json`, aliases `@/`, tipos base | 20 min | ⭕ |
| `npm install` — axios, react-router-dom, zustand + @types | 15 min | ⭕ |
| `src/theme/tokens.ts` + `ThemeProvider.tsx` + `useTheme` hook | 30 min | ⭕ |
| `BrixoLogo.tsx` — 3 variantes + favicon assets | 20 min | ⭕ |
| Componentes primitivos: `Button`, `Input`, `Badge` (TSX) | 40 min | ⭕ |
| Componentes feedback: `Card`, `Toast`, `Skeleton`, `EmptyState` | 40 min | ⭕ |
| Componentes overlay: `Modal`, `BottomSheet` | 30 min | ⭕ |
| `src/services/api.ts` — axios con interceptor JWT y refresh | 30 min | ⭕ |
| `authStore.ts` (Zustand) — token, usuario, logout, permisos | 30 min | ⭕ |
| Layout + navegación: `AppShell`, sidebar, bottom-nav, rutas privadas | 40 min | ⭕ |
| `LandingPage.tsx` — página promocional pública de Brixo | 60 min | ⭕ |
| `LoginPage.tsx` + `RegisterPage.tsx` | 60 min | ⭕ |
| `DashboardPage.tsx` — segunda pantalla post-login, KPIs + alertas | 50 min | ⭕ |
| `InventoryPage.tsx` — tabla desktop + cards móvil | 50 min | ⭕ |
| `MovementModal.tsx` — ENTRADA / SALIDA / AJUSTE | 50 min | ⭕ |
| `ProductModal.tsx` — alta de producto con validación | 40 min | ⭕ |
| `AuditPage.tsx` + `TeamPage.tsx` | 50 min | ⭕ |
| Vistas por rol + accesibilidad WCAG 2.1 AA | 40 min | ⭕ |
| Build, ErrorBoundary, optimización producción | 30 min | ⭕ |

**Flujo de navegación**:
- `/` → `LandingPage` (pública) — si ya está autenticado, redirige a `/dashboard`
- `/login` → `LoginPage` — si ya está autenticado, redirige a `/dashboard`
- `/register` → `RegisterPage`
- `/dashboard` → segunda pantalla principal post-login (ruta privada)
- `/inventory`, `/movements`, `/team`, `/audit` → rutas privadas

**Validación**: landing → registro → login → dashboard → crear producto → registrar movimiento → ver auditoría

---

## Fase 6 — QA + Hardening 0%

Bloqueada por Fase 5.

| Tarea | Tipo | Tiempo | Estado |
|-------|------|--------|--------|
| Testing manual flujo completo | QA | 45 min | ⭕ |
| Fix de bugs encontrados | Dev | 60 min | ⭕ |
| Rate limiting en `POST /api/auth/login` — máx. 5 intentos / 60s por IP | Seguridad | 30 min | ⭕ |
| Validar TTL Redis snapshot y expiración del token | Seguridad | 20 min | ⭕ |
| Cabeceras de seguridad HTTP (`X-Content-Type-Options`, `X-Frame-Options`) | Seguridad | 30 min | ⭕ |
| `request_id` en `HTTPLoggingMiddleware` + header `X-Request-ID` | Observabilidad | 30 min | ⭕ |
| `docker-compose.prod.yml` con variables de entorno seguras | Infra | 30 min | ⭕ |

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
| 7 | `DATABASE_URL` ausente | Agregada en `infra/env/backend.env` con hostname Docker |
| 8 | `email-validator` ausente | Agregado en `requirements.txt` |
| 9 | Comentario inline en `jwt.env` | Eliminado — Pydantic parseaba int como string |
| 10 | `"name"` en `extra={}` del logger | Renombrado a `tenant_name`, `product_name`, `role_name` |
| 11 | `ValueError` en login → 500 | Reemplazado por `UnauthorizedError` (BrixoException 401) |
| 12 | `UniqueViolation` de tenant → 500 | Capturado en repo → `ConflictError` 409 con mensaje claro |

---

**Documento actualizado**: 19 de abril de 2026 (sesión 4)  
**Próxima revisión**: Al completar Fase 5 Frontend
