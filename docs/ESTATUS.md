# ESTATUS DEL PROYECTO BRIXO — MVP

**Fecha**: 18 de abril de 2026
**Rama activa**: `dev`
**Estado general**: Backend 95% funcional — Fases 1 y 4 cerradas — Fase 4B (RBAC) es el próximo paso — MVP al 63%

> El porcentaje bajó de 68% a 58% porque el roadmap fue actualizado para incluir la Fase 4B
> (RBAC enforcement, CORS, refresh token). El trabajo estaba pendiente antes, simplemente
> no estaba en el plan. El avance real del backend no retrocedió.

---

## PROGRESO GENERAL

```text
FASE 1   Infraestructura          ██████████  100%   ← cerrada
FASE 2   Data Access Layer        ██████████  100%   ← cerrada
FASE 3   Casos de uso             ██████████  100%   ← cerrada
FASE 4   Controladores / Rutas    ██████████  100%   ← cerrada
FASE 4B  Seguridad aplicada       ░░░░░░░░░░    0%   ← PROXIMA
FASE 5   Frontend                 █░░░░░░░░░    5%   ← bloqueada por 4B
FASE 6   QA + Hardening           ░░░░░░░░░░    0%   ← bloqueada por 5
────────────────────────────────────────────────────
TOTAL MVP                         ██████░░░░   63%
```

---

## PROXIMAS ACCIONES (orden de prioridad)

```text
✅ F1  Typo Tenat → Tenant en domain/contracts.py
✅ F1  GET /health sin autenticacion
✅ F4  POST /api/users/{id}/roles

1. F4B CORS en main.py                                        10 min   ← frontend no puede llamar a la API sin esto
2. F4B require_permission(code) dependency para FastAPI        45 min   ← RBAC real en endpoints
3. F4B Aplicar require_permission en endpoints críticos        30 min   ← cierra la brecha de autorización
4. F4B POST /api/auth/refresh                                 45 min   ← usuario no se desloguea a las 8h
--- después de completar Fase 4B arrancar Fase 5 ---
5. F5  Setup React + api.js + authStore + LoginPage            1 día
6. F5  ProductListPage + modales de producto y movimiento      2 días
7. F5  DashboardPage + AuditLogPage + routing                  2 días
8. F6  Testing manual + rate limiting + docs + deploy          1 día
```

---

## FASE 1 — Infraestructura 90%

### Completado

| Tarea | Estado |
| --- | --- |
| Redis en docker-compose | ✅ |
| Script SQL completo (8 tablas + seed) | ✅ |
| settings.py con Pydantic BaseSettings | ✅ |
| main.py con lifespan, pool y routers | ✅ |
| Volumen postgres externo — bind mount `./data/postgres` | ✅ |
| Env files montados en contenedor — `./env:/app/env:ro` | ✅ |

### Pendiente

| Tarea | Tiempo | Riesgo si no se resuelve |
| --- | --- | --- |
| `class Tenat` → `Tenant` en `domain/contracts.py:8` | 10 min | `ImportError` en cualquier código nuevo que importe la entidad |
| `GET /health` — endpoint sin autenticación | 10 min | Imposible verificar que el stack levanta; Docker healthcheck también lo necesita |

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

## FASE 4 — Controladores y Rutas 90%

### Rutas activas

| Componente | Rutas |
| --- | --- |
| `AuthController` | `POST /api/auth/login` — validado con Pydantic `LoginRequest` |
| `ProductController` | `GET /api/products/`, `POST /api/products/`, `GET /api/products/{id}` |
| `InventoryController` | `POST /api/products/{id}/movements`, `GET /api/products/{id}/movements` |
| `UserController` | `GET /api/users/`, `POST /api/users/` |
| `AuditController` | `GET /api/audit/?limit=N` |
| `AccessController` | `GET /me/access` — lee snapshot de Redis |
| Middleware | `PUBLIC_PATHS`: `/docs /redoc /openapi.json /health /api/auth/login` |
| Audit trail | `handle_user_logged_in` persiste `LogEntry` en BD en cada login |

### Ruta pendiente

| Tarea | Tiempo | Por qué importa |
| --- | --- | --- |
| `POST /api/users/{id}/roles` | 30 min | `AssignRoleToUserUseCase` existe pero no tiene ruta HTTP — sin esto el RBAC no se puede configurar desde la API |

---

## FASE 4B — Seguridad aplicada 0% — BRECHA CRITICA

El RBAC está modelado (tablas, repositorios, Redis projection) pero ningún endpoint verifica permisos.
Un OPERATOR autenticado puede llamar `POST /api/products/` igual que un OWNER.
Esta fase debe completarse antes de arrancar el frontend.

### Arquitectura de seguridad implementada

```text
JWT RS256 (par RSA 2048 bits)
  └─ JWTAuthMiddleware valida token en cada request
       └─ inyecta user_id + tenant_id en request.state
            └─ publica UserAuthenticated en EventBus
                 └─ UserAccessProjection escucha el evento
                      └─ consulta roles + permisos en BD
                           └─ guarda snapshot en Redis: user_access:{tenant}:{user}
                                └─ GET /me/access sirve el snapshot al cliente
```

### Lo que falta para que el RBAC sea real

| Tarea | Tiempo | Estado |
| --- | --- | --- |
| CORS en `main.py` — permite llamadas desde `:3000` | 10 min | ⭕ |
| `GET /health` (compartido con Fase 1) | 10 min | ⭕ |
| `require_permission(code)` — FastAPI dependency | 45 min | ⭕ |
| Aplicar `require_permission` en endpoints de escritura | 30 min | ⭕ |
| `POST /api/auth/refresh` — renueva token sin re-login | 45 min | ⭕ |

### Permisos a aplicar por endpoint

| Endpoint | Permiso |
| --- | --- |
| `POST /api/products/` | `INVENTORY_WRITE` |
| `POST /api/products/{id}/movements` | `INVENTORY_WRITE` |
| `GET /api/products/` | `INVENTORY_READ` |
| `POST /api/users/` | `USERS_WRITE` |
| `GET /api/users/` | `USERS_READ` |
| `POST /api/users/{id}/roles` | `ROLES_WRITE` |
| `GET /api/audit/` | `AUDIT_READ` |

---

## FASE 5 — Frontend 5%

Solo existe `<h1>Brixo</h1>` en `frontend/src/App.jsx`. No arranca antes de que Fase 4B tenga CORS activo.

| Tarea | Tiempo | Estado |
| --- | --- | --- |
| `npm install axios react-router-dom zustand` | 15 min | ⭕ |
| `src/services/api.js` — cliente axios con interceptor JWT y refresh | 30 min | ⭕ |
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

Bloqueada por Fase 5.

| Tarea | Tipo | Tiempo |
| --- | --- | --- |
| Testing manual flujo completo | QA | 45 min |
| Fix de bugs encontrados | Dev | 60 min |
| Rate limiting en `POST /api/auth/login` | Seguridad | 30 min |
| Validar TTL Redis snapshot y expiración de token | Seguridad | 20 min |
| README con instrucciones de uso | Docs | 30 min |
| `docker-compose.prod.yml` | Infra | 30 min |

---

## DEUDA TECNICA ACTIVA

| # | Ítem | Archivo | Acción |
| --- | --- | --- | --- |
| 1 | `class Tenat` → `Tenant` | `domain/contracts.py:8` | Renombrar (bloqueante futuro) |
| 2 | `ocurred_at` → `occurred_at` | `domain/events/base.py` | Renombrar |
| 3 | Directorio `acccess/` (triple c) | `application/services/` | Renombrar directorio |
| 4 | `asssign_role.py` vacío (triple s) | `application/services/` | Eliminar |
| 5 | `aut_service.py` huérfano | `application/auth/` | Eliminar |
| 6 | `domain/events.py` duplicado del paquete `domain/events/` | `domain/` | Eliminar el archivo |

---

**Documento actualizado**: 18 de abril de 2026
**Proxima revision**: Al completar Fase 4B
