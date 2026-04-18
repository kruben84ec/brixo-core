# ESTATUS DEL PROYECTO BRIXO — MVP

**Fecha**: 18 de abril de 2026
**Rama activa**: `feature/auth-core`
**Estado general**: 🟡 **Backend 75% — Frontend pendiente — MVP al 58%**

> Análisis basado en comparación directa entre ROADMAP.md y código fuente real.

---

## PROGRESO GENERAL

```text
FASE 1  Infraestructura        █████████░   90%
FASE 2  Data Access Layer      ██████████  100%
FASE 3  Casos de uso           ██████████  100%
FASE 4  Controladores / Rutas  █████░░░░░   55%
FASE 5  Frontend               █░░░░░░░░░    5%
FASE 6  QA e Integración       ░░░░░░░░░░    0%
────────────────────────────────────────────────
TOTAL MVP                      █████░░░░░   58%
```

---

## FASE 1 — Infraestructura 🟡 90%

### Completado

| Tarea (ROADMAP) | Estado |
| --- | --- |
| Agregar Redis a docker-compose | ✅ |
| Completar script SQL (8 tablas + seed) | ✅ |
| Completar settings.py (Pydantic BaseSettings) | ✅ |
| Completar main.py con lifespan, routers, pool | ✅ |

### Pendiente

| Tarea | Bloqueante | Por qué importa |
| --- | --- | --- |
| `class Tenat` → `Tenant` en `domain/contracts.py` | No | Cualquier `from domain.contracts import Tenant` falla con `ImportError` en el futuro |
| Validación `curl http://localhost:8000/health` | No | El endpoint `/health` no existe y JWT middleware lo bloquearía si existiera — imposible verificar que el stack levanta sin un token |

---

## FASE 2 — Data Access Layer ✅ 100%

Todos los repositorios implementados con puerto ABC + adaptador SQL.

| Repositorio | Puerto | Adaptador SQL |
| --- | --- | --- |
| Auth | `AuthRepository` | `AuthRepositorySQL` |
| Product | `ProductRepository` | `ProductRepositorySQL` |
| InventoryMovement | `InventoryMovementRepository` | `InventoryMovementRepositorySQL` |
| AuditLog | `AuditLogRepository` | `AuditLogRepositorySQL` |
| User | `UserRepository` | `UserRepositorySQL` |
| Tenant | `TenantRepository` | `TenantRepositorySQL` |
| Role | `RoleRepository` | `RoleRepositorySQL` |
| Access | `AccessRepository` (ABC corregido) | `AccessRepositorySQL` |

---

## FASE 3 — Casos de uso ✅ 100% (7 de 7)

### Use cases completados

| Use Case | Archivo |
| --- | --- |
| `LoginUser` | `application/services/auth/login_user.py` |
| `CreateProductUseCase` | `application/use_cases/create_product.py` |
| `RegisterInventoryMovementUseCase` | `application/use_cases/register_inventory_movement.py` |
| `GetProductStockUseCase` | `application/use_cases/get_product_stock.py` |
| `CreateUserUseCase` | `application/use_cases/create_user.py` |
| `AssignRoleToUserUseCase` | `application/use_cases/assign_role_to_user.py` |
| `GetAuditLogByTenantUseCase` | `application/use_cases/get_audit_log_by_tenant.py` |

### Cambios de esta sesión

- `CreateUserUseCase`: valida email único por tenant, hashea contraseña con bcrypt, publica `UserCreated`
- `AssignRoleToUserUseCase`: valida que usuario y rol pertenecen al mismo tenant, publica `RoleAssigned` (evento ya existía en `domain/events/base.py`)
- `GetAuditLogByTenantUseCase`: query read-only, límite configurable entre 1 y 1000
- `domain/events/user.py`: nuevo archivo con `UserCreated`
- `application/handlers.py`: `handle_user_logged_in` ahora persiste el `LogEntry` en BD vía `AuditLogRepository` (se usó patrón closure para inyectar el repo)
- `main.py`: inyecta `AuditLogRepositorySQL`, `UserRepositorySQL`, `RoleRepositorySQL`; pasa `audit_log_repo` a `register_handlers`

---

## FASE 4 — Controladores y Rutas 🔴 55%

### Rutas completadas

| Componente | Rutas activas |
| --- | --- |
| ProductController | `GET /api/products/`, `POST /api/products/`, `GET /api/products/{id}` |
| InventoryController | `POST /api/products/{id}/movements`, `GET /api/products/{id}/movements` |
| AuthController (parcial) | `POST /api/auth/login` |
| AccessController | `GET /me/access` |
| Audit log en handlers | `handle_user_logged_in` persiste en BD ✅ |

### Pendiente y por qué importa

| Tarea | Por qué es crítico |
| --- | --- |
| `LoginRequest(BaseModel)` con `email: EmailStr` y `password: str` | Hoy `payload["email"]` lanza `KeyError` → HTTP 500 si el cliente omite cualquier campo |
| `PUBLIC_PATHS` en `jwt_middleware.py` | Swagger UI (`/docs`), `/redoc` y `/openapi.json` exigen token actualmente |
| `UserController` (`GET /api/users/`, `POST /api/users/`) | Sin él no se puede crear usuarios desde la API. Depende de `CreateUserUseCase` |
| `AuditController` (`GET /api/audit/`) | Sin él el historial es inaccesible aunque está en BD. Depende de `GetAuditLogByTenantUseCase` |
| `AuthController` completo (registro, refresh) | Hoy solo existe login |

---

## FASE 5 — Frontend 🔴 5% — BLOQUEANTE PRINCIPAL

**Es el único bloqueante real del MVP.** El backend está operativo pero invisible para el usuario final.

### Estado actual

Solo existe `<h1>Brixo</h1>` en `frontend/src/App.jsx`. No hay dependencias instaladas.

### Pendiente (por orden de implementación)

| Tarea | Por qué importa |
| --- | --- |
| Instalar `axios`, `react-router-dom`, `zustand` | Sin estas librerías no se puede construir ningún componente funcional |
| `src/services/api.js` — cliente axios con interceptor JWT | Es el puente entre frontend y backend |
| `authStore` (Zustand) — token, usuario, logout | Estado global de sesión |
| `LoginPage` | Puerta de entrada. Sin login, el usuario no puede acceder a nada |
| `ProductListPage` | Vista principal del MVP |
| `ProductFormModal` | Sin él no se pueden crear productos desde la UI |
| `MovementFormModal` | Sin él no se pueden registrar entradas/salidas |
| `DashboardPage` | Resumen de stock con alertas de mínimo |
| `AuditLogPage` | Historial de cambios |
| Routing y layout | Sin `react-router-dom` configurado, no hay navegación entre páginas |

---

## FASE 6 — QA e Integración ⛔ 0% — BLOQUEADA POR FASE 5

No se puede iniciar hasta tener frontend funcional. Las tareas del ROADMAP son:

| Tarea | Tiempo estimado |
| --- | --- |
| Testing manual flujo completo (login → producto → movimiento → auditoría) | 45 min |
| Fix de bugs encontrados | 60 min |
| Documentación API (README actualizado) | 30 min |
| Instrucciones de deploy | 20 min |

---

## DEUDA TÉCNICA ACTIVA

| # | Ítem | Archivo | Riesgo si no se resuelve |
| --- | --- | --- | --- |
| 1 | `class Tenat` → `Tenant` | `domain/contracts.py:8` | `ImportError` al usar la entidad en código nuevo |
| 2 | `ocurred_at` → `occurred_at` | `domain/events/base.py` | Inconsistencia con eventos hermanos |
| 3 | Directorio `acccess/` (triple c) | `application/services/` | Confusión al navegar o referenciar el módulo |
| 4 | `asssign_role.py` vacío (triple s) | `application/services/` | Dead code, genera ruido en la base de código |
| 5 | `aut_service.py` huérfano | `application/auth/` | Diseño paralelo abandonado |
| 6 | `domain/events.py` duplicado del paquete `domain/events/` | `domain/` | Ambigüedad en `from domain.events import ...` |

---

## ORDEN DE EJECUCIÓN RECOMENDADO

```text
PRÓXIMO (Fase 4 restante)
├─ LoginRequest Pydantic en auth router (15 min) — evita crashes en producción
├─ PUBLIC_PATHS en middleware (20 min) — desbloquea Swagger para desarrollo
├─ UserController (GET /api/users/, POST /api/users/) (1.5 h)
├─ AuditController (GET /api/audit/) (45 min)
└─ AuthController completo (registro, refresh) (1 h)

PRÓXIMAS 2 SEMANAS (Fase 5)
├─ Setup + LoginPage + api.js + authStore (1 día)
├─ ProductListPage + MovementFormModal (2 días)
├─ DashboardPage + AuditLogPage + routing (2 días)

CIERRE (Fase 6)
└─ Testing manual + fixes + documentación (1 día)
```

---

**Documento actualizado**: 18 de abril de 2026
**Próxima revisión**: Al completar las correcciones de Fase 4
