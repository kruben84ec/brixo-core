# ESTATUS DEL PROYECTO BRIXO — MVP

**Fecha**: 18 de abril de 2026
**Rama activa**: `feature/auth-core`
**Estado general**: 🟡 **Backend 88% — Frontend pendiente — MVP al 68%**

> Análisis basado en comparación directa entre ROADMAP.md y código fuente real.

---

## PROGRESO GENERAL

```text
FASE 1  Infraestructura        █████████░   90%
FASE 2  Data Access Layer      ██████████  100%
FASE 3  Casos de uso           ██████████  100%
FASE 4  Controladores / Rutas  █████████░   90%
FASE 5  Frontend               █░░░░░░░░░    5%
FASE 6  QA e Integración       ░░░░░░░░░░    0%
────────────────────────────────────────────────
TOTAL MVP                      ██████░░░░   68%
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
| Volumen postgres externo (bind mount `./data/postgres`) | ✅ |
| Env files montados en backend (`./env:/app/env:ro`) | ✅ |

### Pendiente

| Tarea | Bloqueante | Por qué importa |
| --- | --- | --- |
| `class Tenat` → `Tenant` en `domain/contracts.py` | No | `ImportError` al usar la entidad en código nuevo |
| Validación `curl http://localhost:8000/health` | No | El endpoint `/health` no existe — imposible verificar que el stack levanta |

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

## FASE 4 — Controladores y Rutas 🟡 90%

### Rutas activas

| Componente | Rutas |
| --- | --- |
| `AuthController` | `POST /api/auth/login` — `LoginRequest(email, password)` con Pydantic |
| `ProductController` | `GET /api/products/`, `POST /api/products/`, `GET /api/products/{id}` |
| `InventoryController` | `POST /api/products/{id}/movements`, `GET /api/products/{id}/movements` |
| `UserController` | `GET /api/users/`, `POST /api/users/` |
| `AuditController` | `GET /api/audit/?limit=100` |
| `AccessController` | `GET /me/access` |
| `PUBLIC_PATHS` middleware | `/docs`, `/redoc`, `/openapi.json`, `/health`, `/api/auth/login` |
| Audit log en handlers | `handle_user_logged_in` persiste `LogEntry` en BD |

### Rutas pendientes

| Tarea | Por qué importa |
| --- | --- |
| `AuthController` completo (registro, refresh token) | Hoy crear usuario requiere endpoint `/api/users/` pero sin rol asignado el acceso es limitado |
| `AssignRoleController` (`POST /api/users/{id}/roles`) | `AssignRoleToUserUseCase` existe pero no tiene endpoint HTTP |

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
| `LoginPage` | Puerta de entrada |
| `ProductListPage` | Vista principal del MVP |
| `ProductFormModal` | Sin él no se pueden crear productos desde la UI |
| `MovementFormModal` | Sin él no se pueden registrar entradas/salidas |
| `DashboardPage` | Resumen de stock con alertas de mínimo |
| `AuditLogPage` | Historial de cambios |
| Routing y layout | Sin `react-router-dom` configurado, no hay navegación |

---

## FASE 6 — QA e Integración ⛔ 0% — BLOQUEADA POR FASE 5

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
| 3 | Directorio `acccess/` (triple c) | `application/services/` | Confusión al navegar |
| 4 | `asssign_role.py` vacío (triple s) | `application/services/` | Dead code |
| 5 | `aut_service.py` huérfano | `application/auth/` | Diseño paralelo abandonado |
| 6 | `domain/events.py` duplicado del paquete `domain/events/` | `domain/` | Ambigüedad en imports |

---

## ORDEN DE EJECUCIÓN RECOMENDADO

```text
PRÓXIMO (completar Fase 4)
├─ POST /api/users/{id}/roles — expone AssignRoleToUserUseCase (30 min)
└─ GET /health — endpoint sin autenticación para healthcheck (10 min)

PRÓXIMAS 2 SEMANAS (Fase 5)
├─ npm install axios react-router-dom zustand + api.js + authStore (1 día)
├─ LoginPage + ProductListPage + MovementFormModal (2 días)
└─ DashboardPage + AuditLogPage + routing (2 días)

CIERRE (Fase 6)
└─ Testing manual + fixes + documentación (1 día)
```

---

**Documento actualizado**: 18 de abril de 2026
**Próxima revisión**: Al iniciar Fase 5 (Frontend)
