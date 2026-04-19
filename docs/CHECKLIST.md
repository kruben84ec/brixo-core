# CHECKLIST — Estado del Proyecto Brixo

**Actualizado**: 18 de abril de 2026  
**Branch**: `dev`  
**Fuente de verdad de avance**: [ROADMAP.md](ROADMAP.md)

---

## Leyenda

- ✅ **Completado** — implementado y funcional
- ⭕ **Pendiente** — no implementado aún
- ~~tachado~~ **Resuelto** — ítem de deuda técnica eliminado

---

## Fase 1 — Infraestructura (100%) ✅

| Ítem | Estado | Archivo |
|------|--------|---------|
| Redis en docker-compose | ✅ | `infra/docker-compose.yml` |
| Script SQL completo (8 tablas + seed) | ✅ | `infra/docker/postgres/init.sql` |
| `settings.py` con Pydantic BaseSettings | ✅ | `infrastructure/env/settings.py` |
| `main.py` con lifespan + pool + routers | ✅ | `backend/main.py` |
| Volumen postgres externo (`./data/postgres`) | ✅ | |
| Env files montados (`./env:/app/env:ro`) | ✅ | |
| `GET /health` sin autenticación | ✅ | `infrastructure/api/routes/health.py` |
| Hot reload backend + frontend | ✅ | |

---

## Fase 2 — Data Access Layer (100%) ✅

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

## Fase 3 — Casos de Uso (100%) ✅

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

## Fase 4 — Controladores y Rutas (100%) ✅

| Ítem | Rutas | Estado |
|------|-------|--------|
| `AuthController` | `POST /api/auth/login` | ✅ |
| `ProductController` | `GET/POST /api/products/`, `GET /api/products/{id}` | ✅ |
| `InventoryController` | `POST/GET /api/products/{id}/movements` | ✅ |
| `UserController` | `GET/POST /api/users/`, `POST /api/users/{id}/roles` | ✅ |
| `AuditController` | `GET /api/audit/?limit=N` | ✅ |
| `AccessController` + Redis snapshot | `GET /me/access` | ✅ |
| `PUBLIC_PATHS` en `JWTAuthMiddleware` | `/docs /redoc /openapi.json /health /api/auth/login` | ✅ |
| Audit trail en handlers — persiste login en BD | — | ✅ |
| `POST /api/auth/refresh` | `POST /api/auth/refresh` | ✅ |

---

## Fase 4B — Seguridad Aplicada (100%) ✅

| Ítem | Archivo | Estado |
|------|---------|--------|
| CORS en `main.py` | `backend/main.py` | ✅ |
| `require_permission(code)` FastAPI dependency | `infrastructure/security/permissions.py` | ✅ |
| RBAC activo en endpoints críticos | `routes/products.py`, `routes/users.py`, `routes/audit.py` | ✅ |
| `POST /api/auth/refresh` | `infrastructure/api/routes/auth.py` | ✅ |

### Permisos por endpoint

| Endpoint | Permiso requerido |
|----------|-------------------|
| `POST /api/products/` | `INVENTORY_WRITE` |
| `POST /api/products/{id}/movements` | `INVENTORY_WRITE` |
| `GET /api/products/` | `INVENTORY_READ` |
| `POST /api/users/` | `USERS_WRITE` |
| `GET /api/users/` | `USERS_READ` |
| `POST /api/users/{id}/roles` | `ROLES_WRITE` |
| `GET /api/audit/` | `AUDIT_READ` |

---

## Fase 4C — Observabilidad y Manejo de Excepciones (100%) ✅

| Ítem | Archivo | Estado |
|------|---------|--------|
| Logger JSON con `RotatingFileHandler` | `infrastructure/logging.py` | ✅ |
| `HTTPLoggingMiddleware` | `infrastructure/api/middleware/http_logging.py` | ✅ |
| Jerarquía de excepciones de dominio | `domain/exceptions.py` | ✅ |
| Exception handlers globales (4 tipos) | `infrastructure/api/exception_handlers.py` | ✅ |
| Logs persistidos en `backend/logs/app.log` | bind mount Docker | ✅ |

---

## Fase 5 — Frontend (5%) ← PRÓXIMA

> Solo existe `<h1>Brixo</h1>`. CORS activo, errores con formato consistente — puede arrancar ahora.

| Ítem | Tiempo est. | Estado |
|------|-------------|--------|
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

## Fase 6 — QA + Hardening (0%)

> Bloqueada por Fase 5.

| Ítem | Tipo | Tiempo est. | Estado |
|------|------|-------------|--------|
| Testing manual flujo completo | QA | 45 min | ⭕ |
| Fix de bugs encontrados | Dev | 60 min | ⭕ |
| Rate limiting en `POST /api/auth/login` | Seguridad | 30 min | ⭕ |
| Validar TTL Redis snapshot y expiración de token | Seguridad | 20 min | ⭕ |
| Cabeceras de seguridad HTTP | Seguridad | 30 min | ⭕ |
| `request_id` en `HTTPLoggingMiddleware` + header `X-Request-ID` | Observabilidad | 30 min | ⭕ |
| README con instrucciones de uso | Docs | — | ✅ completado en sesión 3 |
| `docker-compose.prod.yml` | Infra | 30 min | ⭕ |

---

## Deuda técnica — RESUELTA ✅

Todos los ítems de deuda técnica han sido resueltos en sesión 3 (18 abr 2026).

| # | Ítem | Resolución |
|---|------|-----------|
| 1 | ~~`ocurred_at` → `occurred_at`~~ | Corregido en `domain/events/base.py` |
| 2 | ~~Directorio `acccess/` (triple c)~~ | Renombrado a `access/`, 2 imports actualizados |
| 3 | ~~`asssign_role.py` vacío~~ | Eliminado con `git rm` |
| 4 | ~~`aut_service.py` huérfano~~ | Eliminado con `git rm` |
| 5 | ~~`domain/events.py` duplicado~~ | Eliminado; import en `user_access_projection.py` corregido a `domain.events.base` |
| 6 | ~~`OPENAI_API_KEY` en `backend.env`~~ | Env files excluidos de git (`infra/env/*.env` en `.gitignore`) |

---

## Criterios de éxito del MVP

| Criterio | Estado |
|----------|--------|
| `docker-compose up -d` levanta sin errores | ✅ |
| `GET /health` responde 200 | ✅ |
| `POST /api/auth/login` retorna JWT válido | ✅ |
| `GET /docs` accesible sin token | ✅ |
| Crear producto con permiso correcto | ✅ |
| Registrar movimiento con permiso correcto | ✅ |
| Usuario sin permiso recibe 403 | ✅ |
| Token expirado se renueva con refresh | ✅ |
| Logs visibles en `docker logs` y en `backend/logs/app.log` | ✅ |
| Errores devuelven JSON consistente al frontend | ✅ |
| Frontend carga en `http://localhost:3000` | ⭕ |
| Flujo completo login → producto → movimiento → auditoría | ⭕ |
