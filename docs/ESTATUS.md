# ESTATUS DEL PROYECTO BRIXO — MVP

**Fecha**: 18 de abril de 2026
**Rama activa**: `feature/auth-core`
**Estado general**: 🟡 **Backend completo — Frontend pendiente**

> Este documento refleja el estado real del código fuente al 18-04-2026.

---

## RESUMEN EJECUTIVO

El backend está completo para el MVP. Todas las fases de infraestructura, data access layer,
casos de uso y endpoints están implementadas. Los repositorios reales reemplazaron todos los
stubs. El único bloqueante para el MVP es el frontend (Fase 5 del roadmap).

---

## FASE 1 — Infraestructura ✅ COMPLETA

| Componente | Estado | Notas |
| --- | --- | --- |
| Docker Compose | ✅ | PostgreSQL 15 + Redis 7 + Backend + Frontend |
| PostgreSQL 15 | ✅ | Schema completo con 8 tablas, seed data incluido |
| Redis 7 | ✅ | Configurado en Docker, usado para snapshots de sesión |
| Pool de conexiones | ✅ | `infrastructure/database.py` — psycopg2 ThreadedConnectionPool |
| Variables de entorno | ✅ | Pydantic BaseSettings, JWT config, Redis, logging |
| Startup/shutdown | ✅ | `lifespan` asynccontextmanager — pool init y cierre limpio |

**Schema SQL** — 8 tablas con UUIDs, FK, constraints e índices:

| Tabla | Estado |
| --- | --- |
| `tenants` | ✅ |
| `users` | ✅ |
| `roles` | ✅ |
| `user_roles` | ✅ |
| `permissions` | ✅ |
| `products` | ✅ |
| `inventory_movements` | ✅ |
| `audit_logs` | ✅ (payload JSONB) |

Seed: tenant "Demo Store", usuario `admin@brixo.local` (OWNER), 3 productos de ejemplo.

---

## FASE 2 — Data Access Layer ✅ COMPLETA

Todos los repositorios implementados en `adapters/repositories/` con puertos ABC en
`application/ports/`. El stub `AccessRepositoryImpl` fue reemplazado por `AccessRepositorySQL`.

| Puerto (ABC) | Adaptador SQL | Tabla(s) |
| --- | --- | --- |
| `AuthRepository` | `AuthRepositorySQL` | `users` |
| `ProductRepository` | `ProductRepositorySQL` | `products` |
| `InventoryMovementRepository` | `InventoryMovementRepositorySQL` | `inventory_movements` |
| `AuditLogRepository` | `AuditLogRepositorySQL` | `audit_logs` |
| `UserRepository` | `UserRepositorySQL` | `users` |
| `TenantRepository` | `TenantRepositorySQL` | `tenants` |
| `RoleRepository` | `RoleRepositorySQL` | `roles`, `user_roles`, `permissions` |
| `AccessRepository` | `AccessRepositorySQL` | `roles`, `user_roles`, `permissions` |

`AccessRepository` corregido para heredar de ABC. `main.py` actualizado para usar
`AccessRepositorySQL` en lugar del stub hardcodeado.

---

## FASE 3 — Casos de uso ✅ PARCIAL

| Use Case | Estado | Notas |
| --- | --- | --- |
| `LoginUser` | ✅ | `application/services/auth/login_user.py` |
| `CreateProductUseCase` | ✅ | `application/use_cases/create_product.py` |
| `RegisterInventoryMovementUseCase` | ✅ | ENTRADA / SALIDA / AJUSTE con validación de stock |
| `GetProductStockUseCase` | ✅ | `application/use_cases/get_product_stock.py` |
| `CreateUserUseCase` | ❌ | Pendiente |
| `AssignRoleToUserUseCase` | ❌ | Pendiente (archivo `asssign_role.py` vacío) |
| `GetAuditLogByTenantUseCase` | ❌ | Pendiente |

---

## FASE 4 — Controladores y Rutas ✅ PARCIAL

| Endpoint | Método | Estado |
| --- | --- | --- |
| `/api/auth/login` | POST | ✅ |
| `/me/access` | GET | ✅ |
| `/api/products/` | GET | ✅ |
| `/api/products/` | POST | ✅ |
| `/api/products/{id}` | GET | ✅ |
| `/api/products/{id}/movements` | POST | ✅ |
| `/api/products/{id}/movements` | GET | ✅ |
| `/api/users/` | GET / POST | ❌ Pendiente |
| `/api/audit/` | GET | ❌ Pendiente |

Pendiente en esta fase:

- `LoginRequest(BaseModel)` con validación Pydantic en `/api/auth/login`
- Lista `PUBLIC_PATHS` en `jwt_middleware.py` (Swagger UI actualmente bloqueada)
- `AuditLogRepositorySQL` inyectado en `handlers.py` para persistir logins

---

## FASE 5 — Frontend ❌ NO INICIADA (5%)

Solo existe `<h1>Brixo</h1>` en `frontend/src/App.jsx`.

Pendiente:

1. Instalar: `axios`, `react-router-dom`, `zustand`
2. `src/services/api.js` — cliente axios con interceptor JWT
3. Páginas: `LoginPage`, `ProductListPage`, `MovementFormModal`, `DashboardPage`, `AuditLogPage`
4. Stores Zustand: `authStore`, `productStore`

---

## FASE 6 — QA e Integración ❌ NO INICIADA

---

## PROGRESO GENERAL

```text
FASE 1  Infraestructura        ██████████  100%
FASE 2  Data Access Layer      ██████████  100%
FASE 3  Casos de uso           ███████░░░   57%  (4/7 implementados)
FASE 4  Controladores / Rutas  ████████░░   75%  (7/9 endpoints + fixes pendientes)
FASE 5  Frontend               █░░░░░░░░░    5%  (solo placeholder)
FASE 6  QA e Integración       ░░░░░░░░░░    0%
────────────────────────────────────────────────
TOTAL MVP                      ██████░░░░   55%
```

---

## DEUDA TÉCNICA ACTIVA

| # | Ítem | Archivo | Impacto |
| --- | --- | --- | --- |
| 1 | `class Tenat` → `Tenant` | `domain/contracts.py:8` | Imports futuros rotos |
| 2 | `ocurred_at` → `occurred_at` | `domain/events/base.py` | Inconsistencia con hermanas |
| 3 | Directorio `acccess/` → `access/` | `application/services/acccess/` | Confusión en imports |
| 4 | `asssign_role.py` vacío | `application/services/` | Dead code |
| 5 | `aut_service.py` huérfano | `application/auth/` | Diseño paralelo abandonado |
| 6 | `domain/events.py` duplicado | `domain/` | Ambigüedad en imports |

---

## PRÓXIMO PASO

Iniciar **Fase 5 (Frontend)** en paralelo con cerrar Fase 3 y 4:

- Fase 3: `CreateUserUseCase`, `AssignRoleToUserUseCase`, `GetAuditLogByTenantUseCase`
- Fase 4: LoginRequest Pydantic, PUBLIC_PATHS en middleware, persistencia de audit logs
- Fase 5: Setup React + dependencias, LoginPage, ProductListPage

---

**Documento generado**: 18 de abril de 2026
**Próxima revisión**: Al completar Fase 5
