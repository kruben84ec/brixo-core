# CHECKLIST — Estado Real del Proyecto

**Actualizado**: 18 de abril de 2026
**Branch**: dev (mergeado desde feature/auth-core)
**Referencia**: ROADMAP.md es la fuente de verdad sobre el avance por fase

> Los ítems completados reflejan el estado verificado en ROADMAP.md (18-abr-2026).
> Los ítems pendientes están ordenados por prioridad de desbloqueo.

---

## LEYENDA

- ✅ **Hecho** — implementado y funcional
- ⭕ **Pendiente** — no implementado aún
- ⚠️ **Parcial / Bug conocido** — existe pero tiene un problema documentado

---

## FASE 1 — Infraestructura (90%)

| Ítem | Estado | Notas |
|------|--------|-------|
| Redis en docker-compose | ✅ | |
| Script SQL completo (8 tablas + seed) | ✅ | |
| `settings.py` con Pydantic BaseSettings | ✅ | |
| `main.py` con lifespan + pool + routers | ✅ | |
| Volumen postgres externo (`./data/postgres`) | ✅ | |
| Env files montados (`./env:/app/env:ro`) | ✅ | |
| Corregir typo `class Tenat` → `Tenant` | ⭕ | `domain/contracts.py:8` — bloqueante futuro |
| `GET /health` sin autenticación | ⭕ | Docker healthcheck lo necesita |

---

## FASE 2 — Data Access Layer (100%)

| Repositorio | Puerto | Adaptador SQL | Estado |
|-------------|--------|---------------|--------|
| Auth | `AuthRepository` | `AuthRepositorySQL` | ✅ |
| Product | `ProductRepository` | `ProductRepositorySQL` | ✅ |
| InventoryMovement | `InventoryMovementRepository` | `InventoryMovementRepositorySQL` | ✅ |
| AuditLog | `AuditLogRepository` | `AuditLogRepositorySQL` | ✅ |
| User | `UserRepository` | `UserRepositorySQL` | ✅ |
| Tenant | `TenantRepository` | `TenantRepositorySQL` | ✅ |
| Role | `RoleRepository` | `RoleRepositorySQL` | ✅ |
| Access | `AccessRepository` | `AccessRepositorySQL` | ✅ |

---

## FASE 3 — Casos de Uso (100%)

| Use Case | Archivo | Estado |
|----------|---------|--------|
| `LoginUser` | `application/services/auth/login_user.py` | ✅ |
| `CreateProductUseCase` | `application/use_cases/create_product.py` | ✅ |
| `RegisterInventoryMovementUseCase` | `application/use_cases/register_inventory_movement.py` | ✅ |
| `GetProductStockUseCase` | `application/use_cases/get_product_stock.py` | ✅ |
| `CreateUserUseCase` | `application/use_cases/create_user.py` | ✅ |
| `AssignRoleToUserUseCase` | `application/use_cases/assign_role_to_user.py` | ✅ |
| `GetAuditLogByTenantUseCase` | `application/use_cases/get_audit_log_by_tenant.py` | ✅ |

---

## FASE 4 — Controladores y Rutas (90%)

| Ítem | Rutas | Estado |
|------|-------|--------|
| `AuthController` + `LoginRequest` Pydantic | `POST /api/auth/login` | ✅ |
| `ProductController` | `GET/POST /api/products/`, `GET /api/products/{id}` | ✅ |
| `InventoryController` | `POST/GET /api/products/{id}/movements` | ✅ |
| `UserController` | `GET/POST /api/users/` | ✅ |
| `AuditController` | `GET /api/audit/?limit=N` | ✅ |
| `AccessController` + Redis snapshot | `GET /me/access` | ✅ |
| `PUBLIC_PATHS` en `JWTAuthMiddleware` | `/docs /redoc /openapi.json /health /api/auth/login` | ✅ |
| Audit trail en handlers — persiste login en BD | — | ✅ |
| `POST /api/users/{id}/roles` | `POST /api/users/{id}/roles` | ⭕ |

---

## FASE 4B — Seguridad Aplicada (0%) — BRECHA CRITICA

> El RBAC está modelado (tablas + Redis) pero ningún endpoint verifica permisos.
> Esta fase debe completarse **antes** de arrancar el frontend.

| Ítem | Archivo | Tiempo | Estado |
|------|---------|--------|--------|
| CORS en `main.py` | `backend/main.py` | 10 min | ⭕ |
| `GET /health` sin auth (compartido con Fase 1) | `routes/health.py` | 10 min | ⭕ |
| `require_permission(code)` FastAPI dependency | `infrastructure/security/permissions.py` | 45 min | ⭕ |
| Aplicar `require_permission` en endpoints críticos | `routes/products.py`, `routes/users.py` | 30 min | ⭕ |
| `POST /api/auth/refresh` | `infrastructure/api/routes/auth.py` | 45 min | ⭕ |

### Permisos requeridos por endpoint

| Endpoint | Permiso |
|----------|---------|
| `POST /api/products/` | `INVENTORY_WRITE` |
| `POST /api/products/{id}/movements` | `INVENTORY_WRITE` |
| `GET /api/products/` | `INVENTORY_READ` |
| `POST /api/users/` | `USERS_WRITE` |
| `GET /api/users/` | `USERS_READ` |
| `POST /api/users/{id}/roles` | `ROLES_WRITE` |
| `GET /api/audit/` | `AUDIT_READ` |

---

## FASE 5 — Frontend (5%)

> Solo existe `<h1>Brixo</h1>`. Bloqueado hasta que Fase 4B tenga CORS activo.

| Ítem | Tiempo | Estado |
|------|--------|--------|
| `npm install axios react-router-dom zustand` | 15 min | ⭕ |
| `src/services/api.js` — axios con interceptor JWT y refresh | 30 min | ⭕ |
| `authStore` (Zustand) — token, usuario, logout | 30 min | ⭕ |
| `LoginPage` | 50 min | ⭕ |
| `ProductListPage` | 60 min | ⭕ |
| `ProductFormModal` | 40 min | ⭕ |
| `MovementFormModal` | 50 min | ⭕ |
| `DashboardPage` — stock con alertas de mínimo | 45 min | ⭕ |
| `AuditLogPage` | 40 min | ⭕ |
| Routing + layout + rutas privadas | 35 min | ⭕ |
| Estilos básicos | 40 min | ⭕ |

---

## FASE 6 — QA + Hardening (0%)

> Bloqueada por Fase 5.

| Ítem | Tipo | Tiempo | Estado |
|------|------|--------|--------|
| Testing manual flujo completo | QA | 45 min | ⭕ |
| Fix de bugs encontrados | Dev | 60 min | ⭕ |
| Rate limiting en `POST /api/auth/login` | Seguridad | 30 min | ⭕ |
| Validar TTL Redis snapshot y expiración de token | Seguridad | 20 min | ⭕ |
| README con instrucciones de uso | Docs | 30 min | ⭕ |
| `docker-compose.prod.yml` | Infra | 30 min | ⭕ |

---

## DEUDA TECNICA ACTIVA

| # | Ítem | Archivo | Acción |
|---|------|---------|--------|
| 1 | `class Tenat` → `Tenant` | `domain/contracts.py:8` | Renombrar |
| 2 | `ocurred_at` → `occurred_at` | `domain/events/base.py` | Renombrar |
| 3 | Directorio `acccess/` (triple c) | `application/services/` | Renombrar |
| 4 | `asssign_role.py` vacío (triple s) | `application/services/` | Eliminar |
| 5 | `aut_service.py` huérfano | `application/auth/` | Eliminar |
| 6 | `domain/events.py` duplicado del paquete | `domain/` | Eliminar el archivo plano |

---

## CRITERIOS DE EXITO DEL MVP

| Criterio | Estado |
|----------|--------|
| `docker-compose up -d` levanta sin errores | ⭕ |
| `GET /health` responde 200 | ⭕ |
| `POST /api/auth/login` retorna JWT válido | ✅ |
| `GET /docs` accesible sin token | ✅ |
| Crear producto con permiso correcto | ⭕ (RBAC pendiente) |
| Registrar movimiento con permiso correcto | ⭕ (RBAC pendiente) |
| Usuario sin permiso recibe 403 | ⭕ (RBAC pendiente) |
| Token expirado se renueva con refresh | ⭕ |
| Frontend carga en `http://localhost:3000` | ⭕ |
| Flujo completo login → producto → movimiento → auditoría | ⭕ |
