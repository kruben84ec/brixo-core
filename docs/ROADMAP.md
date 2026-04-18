# ROADMAP — BRIXO MVP 2026

**Actualizado**: 18 de abril de 2026  
**Estado**: Backend ~88% funcional — Fase 4B (seguridad aplicada) y Frontend pendientes  
**Criterio de MVP**: Usuario puede hacer login → crear producto → registrar movimiento → ver auditoría, con RBAC activo

---

## RESUMEN EJECUTIVO

```text
FASE 1   Infraestructura          █████████░   90%   ← 2 pendientes menores
FASE 2   Data Access Layer        ██████████  100%   ← completo
FASE 3   Casos de uso             ██████████  100%   ← completo
FASE 4   Controladores / Rutas    █████████░   90%   ← 1 endpoint pendiente
FASE 4B  Seguridad aplicada       ░░░░░░░░░░    0%   ← BRECHA CRITICA
FASE 5   Frontend                 █░░░░░░░░░    5%   ← bloqueante del MVP
FASE 6   QA + Hardening           ░░░░░░░░░░    0%   ← bloqueada por Fase 5
────────────────────────────────────────────────────
TOTAL MVP                         █████░░░░░   58%
```

> La Fase 4B no existía en el roadmap original. El RBAC está modelado en BD y cacheado en Redis
> pero ningún endpoint verifica permisos. Cualquier usuario autenticado puede hacer cualquier
> operación. Esta fase lo corrige antes de arrancar el frontend.

---

## ORDEN DE EJECUCION RECOMENDADO

```text
HOY — Fase 1 (cierres) + Fase 4 (cierre) + Fase 4B
├─ F1:  Corregir typo Tenat → Tenant en domain/contracts.py        (10 min)
├─ F1:  GET /health sin autenticación                               (10 min)
├─ F4:  POST /api/users/{id}/roles                                  (30 min)
├─ F4B: CORS en main.py                                             (10 min)
├─ F4B: Dependency require_permission(code) para FastAPI            (45 min)
├─ F4B: Aplicar require_permission en endpoints críticos            (30 min)
└─ F4B: POST /api/auth/refresh                                      (45 min)

PROXIMAS 2 SEMANAS — Fase 5 Frontend
├─ Día 1: setup + api.js + authStore + LoginPage
├─ Día 2: ProductListPage + ProductFormModal + MovementFormModal
└─ Día 3: DashboardPage + AuditLogPage + routing + estilos

CIERRE — Fase 6 QA + Hardening
└─ Día 1: testing manual + rate limiting + fixes + docs
```

---

## FASE 1 — INFRAESTRUCTURA

**Estado**: 90% — **Entrada**: repo vacío / **Salida**: stack levanta, BD inicializada

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 1 | Redis en docker-compose | 15 min | ✅ |
| 2 | Script SQL completo (8 tablas + seed) | 45 min | ✅ |
| 3 | settings.py con Pydantic BaseSettings | 20 min | ✅ |
| 4 | main.py con lifespan + pool + routers | 30 min | ✅ |
| 5 | Volumen postgres externo (bind mount `./data/postgres`) | 10 min | ✅ |
| 6 | Env files montados en contenedor (`./env:/app/env:ro`) | 10 min | ✅ |
| 7 | Corregir typo `class Tenat` → `Tenant` en `domain/contracts.py` | 10 min | ⭕ |
| 8 | `GET /health` — responde 200 sin token | 10 min | ⭕ |
| **TOTAL** | | **2h 30min** | |

**Validacion**: `curl http://localhost:8000/health` → `{"status": "ok"}`

---

## FASE 2 — DATA ACCESS LAYER

**Estado**: 100% — **Entrada**: BD funcional / **Salida**: todos los repositorios operativos

| # | Repositorio | Puerto | Adaptador SQL | Estado |
|---|-------------|--------|---------------|--------|
| 1 | Auth | `AuthRepository` | `AuthRepositorySQL` | ✅ |
| 2 | Product | `ProductRepository` | `ProductRepositorySQL` | ✅ |
| 3 | InventoryMovement | `InventoryMovementRepository` | `InventoryMovementRepositorySQL` | ✅ |
| 4 | AuditLog | `AuditLogRepository` | `AuditLogRepositorySQL` | ✅ |
| 5 | User | `UserRepository` | `UserRepositorySQL` | ✅ |
| 6 | Tenant | `TenantRepository` | `TenantRepositorySQL` | ✅ |
| 7 | Role | `RoleRepository` | `RoleRepositorySQL` | ✅ |
| 8 | Access | `AccessRepository` | `AccessRepositorySQL` | ✅ |

**Validacion**: todos los repositorios retornan datos del seed sin errores

---

## FASE 3 — CASOS DE USO

**Estado**: 100% — **Entrada**: repos funcionando / **Salida**: lógica de negocio completa

| # | Use Case | Archivo | Estado |
|---|----------|---------|--------|
| 1 | `LoginUser` | `application/services/auth/login_user.py` | ✅ |
| 2 | `CreateProductUseCase` | `application/use_cases/create_product.py` | ✅ |
| 3 | `RegisterInventoryMovementUseCase` | `application/use_cases/register_inventory_movement.py` | ✅ |
| 4 | `GetProductStockUseCase` | `application/use_cases/get_product_stock.py` | ✅ |
| 5 | `CreateUserUseCase` | `application/use_cases/create_user.py` | ✅ |
| 6 | `AssignRoleToUserUseCase` | `application/use_cases/assign_role_to_user.py` | ✅ |
| 7 | `GetAuditLogByTenantUseCase` | `application/use_cases/get_audit_log_by_tenant.py` | ✅ |

**Validacion**: cada use case ejecuta sin errores contra BD real

---

## FASE 4 — CONTROLADORES Y RUTAS

**Estado**: 90% — **Entrada**: use cases listos / **Salida**: API REST consumible desde Swagger

| # | Tarea | Rutas | Estado |
|---|-------|-------|--------|
| 1 | `LoginRequest` Pydantic + `TokenResponse` | `POST /api/auth/login` | ✅ |
| 2 | `ProductController` | `GET/POST /api/products/`, `GET /api/products/{id}` | ✅ |
| 3 | `InventoryController` | `POST/GET /api/products/{id}/movements` | ✅ |
| 4 | `UserController` | `GET/POST /api/users/` | ✅ |
| 5 | `AuditController` | `GET /api/audit/?limit=N` | ✅ |
| 6 | `AccessController` + Redis snapshot | `GET /me/access` | ✅ |
| 7 | `PUBLIC_PATHS` en `JWTAuthMiddleware` | `/docs /redoc /openapi.json /health /api/auth/login` | ✅ |
| 8 | Audit trail en `handlers.py` — persiste login en BD | — | ✅ |
| 9 | `POST /api/users/{id}/roles` — expone `AssignRoleToUserUseCase` | `POST /api/users/{id}/roles` | ⭕ |

**Validacion**: Swagger muestra todos los endpoints, requests/responses funcionan con token válido

---

## FASE 4B — SEGURIDAD APLICADA

**Estado**: 0% — **Entrada**: API funcional / **Salida**: RBAC activo, CORS habilitado, tokens renovables

> Esta fase no existía en el roadmap original. El RBAC estaba modelado correctamente en base de
> datos y cacheado en Redis, pero ningún endpoint lo verificaba. Un OPERATOR podía crear productos,
> borrar usuarios o acceder a la auditoría igual que un OWNER. Esta fase cierra esa brecha.

| # | Tarea | Archivo | Tiempo | Estado |
|---|-------|---------|--------|--------|
| 1 | CORS en `main.py` — habilita llamadas desde el frontend en `:3000` | `backend/main.py` | 10 min | ⭕ |
| 2 | `GET /health` — endpoint sin auth para healthcheck y docker | `infrastructure/api/routes/health.py` | 10 min | ⭕ |
| 3 | `require_permission(code)` — FastAPI dependency que lee Redis snapshot | `infrastructure/security/permissions.py` | 45 min | ⭕ |
| 4 | Aplicar `require_permission` en endpoints de escritura críticos | `routes/products.py`, `routes/users.py` | 30 min | ⭕ |
| 5 | `POST /api/auth/refresh` — renueva token sin re-login | `infrastructure/api/routes/auth.py` | 45 min | ⭕ |
| **TOTAL** | | | **2h 20min** | |

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

### Como funciona require_permission

```python
# infrastructure/security/permissions.py
async def require_permission(code: str):
    async def dependency(request: Request):
        snapshot = await _get_snapshot(request.state.user_id, request.state.tenant_id)
        if code not in snapshot["permissions"]:
            raise HTTPException(403, f"Permiso requerido: {code}")
    return Depends(dependency)

# Uso en router:
@router.post("/", dependencies=[require_permission("INVENTORY_WRITE")])
async def create_product(...):
    ...
```

**Validacion**: un usuario con rol OPERATOR recibe 403 al intentar `POST /api/products/` si no tiene el permiso `INVENTORY_WRITE`

---

## FASE 5 — FRONTEND

**Estado**: 5% — **Entrada**: API con CORS activo / **Salida**: UI funcional para el flujo MVP

> Solo existe `<h1>Brixo</h1>` en `frontend/src/App.jsx`. No hay dependencias instaladas.
> Esta fase no puede arrancar antes de que Fase 4B tenga CORS activo.

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 1 | `npm install axios react-router-dom zustand` | 15 min | ⭕ |
| 2 | `src/services/api.js` — cliente axios con interceptor JWT y refresh automático | 30 min | ⭕ |
| 3 | `authStore` (Zustand) — token, usuario, logout, persistencia en localStorage | 30 min | ⭕ |
| 4 | `LoginPage` — form email+password, manejo de error 401 | 50 min | ⭕ |
| 5 | `ProductListPage` — tabla con stock actual y alerta de mínimo | 60 min | ⭕ |
| 6 | `ProductFormModal` — alta de producto con validación client-side | 40 min | ⭕ |
| 7 | `MovementFormModal` — ENTRADA / SALIDA / AJUSTE con cantidad y motivo | 50 min | ⭕ |
| 8 | `DashboardPage` — resumen de stock, alertas de stock bajo | 45 min | ⭕ |
| 9 | `AuditLogPage` — historial paginado con filtros | 40 min | ⭕ |
| 10 | Routing + layout base (sidebar, navbar, rutas privadas) | 35 min | ⭕ |
| 11 | Estilos básicos (CSS o Tailwind) | 40 min | ⭕ |
| **TOTAL** | | **6h** | |

**Validacion**: login funciona, puede ver productos, crear uno, registrar un movimiento, ver auditoría

---

## FASE 6 — QA + HARDENING

**Estado**: 0% — **Entrada**: Frontend funcional / **Salida**: MVP listo para producción

| # | Tarea | Tipo | Tiempo | Estado |
|---|-------|------|--------|--------|
| 1 | Testing manual flujo completo (login → producto → movimiento → auditoría) | QA | 45 min | ⭕ |
| 2 | Fix de bugs encontrados | Dev | 60 min | ⭕ |
| 3 | Rate limiting en `POST /api/auth/login` (max 5 intentos / 60s por IP) | Seguridad | 30 min | ⭕ |
| 4 | Validar TTL del Redis snapshot y expiración correcta del token | Seguridad | 20 min | ⭕ |
| 5 | README actualizado con instrucciones de uso | Docs | 30 min | ⭕ |
| 6 | `docker-compose.prod.yml` con variables de entorno seguras | Infra | 30 min | ⭕ |
| **TOTAL** | | | **3h 35min** | |

**Validacion**: flujo e2e sin errores — Login → Crear Producto → Registrar Movimiento → Ver Auditoría → Logout

---

## CAPA DE SEGURIDAD — ARQUITECTURA

Implementado en `backend/infrastructure/security/`:

```text
REQUEST
  │
  ▼
JWTAuthMiddleware                  ← valida RS256, inyecta user_id + tenant_id
  │                                   publica UserAuthenticated en EventBus
  ▼
UserAccessProjection               ← escucha UserAuthenticated
  │                                   consulta roles + permisos en BD
  │                                   guarda snapshot en Redis (user_access:{tenant}:{user})
  ▼
require_permission(code)           ← Fase 4B — lee snapshot de Redis
  │                                   lanza 403 si el código no está en permissions[]
  ▼
Handler / Use Case                 ← lógica de negocio sin conocer seguridad
  │
  ▼
AuditLogRepository                 ← persiste cada acción relevante en audit_logs
```

**Claims del JWT**: `sub` (user_id), `tenant` (tenant_id), `iat`, `exp`  
**Algoritmo**: RS256 con par de claves RSA de 2048 bits  
**TTL access token**: 8 horas  
**Password hashing**: bcrypt con salt generado por operación

---

## CRITERIOS DE EXITO DEL MVP

El MVP está LISTO cuando:

| Criterio | Estado |
|----------|--------|
| `docker-compose up -d` levanta sin errores | ⭕ |
| `GET /health` responde 200 | ⭕ |
| `POST /api/auth/login` retorna JWT válido | ✅ |
| `GET /docs` accesible sin token | ✅ |
| Crear producto funciona con permiso correcto | ⭕ (RBAC pendiente) |
| Registrar movimiento funciona con permiso correcto | ⭕ (RBAC pendiente) |
| Usuario sin permiso recibe 403 | ⭕ (RBAC pendiente) |
| Token expirado se renueva con refresh | ⭕ |
| Frontend carga en `http://localhost:3000` | ⭕ |
| Flujo completo login → producto → movimiento → auditoría | ⭕ |

---

## RIESGOS

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| RBAC mal configurado en seed — usuarios sin permisos bloqueados | Alta | Alto | Verificar seed con admin que tenga todos los permisos |
| CORS bloqueando frontend antes de configurarlo | Alta | Alto | Fase 4B lo resuelve antes de arrancar frontend |
| Redis snapshot desincronizado tras reasignar rol | Media | Medio | El snapshot se regenera en cada autenticación |
| `UserAccessProjection` async no ejecuta correctamente en EventBus sync | Media | Alto | Verificar con log que el snapshot se escribe al hacer login |
| JWT keys en `.env` comprometidas | Baja | Alto | Rotar keys en `infra/env/jwt.env` y reiniciar backend |

---

## DEUDA TECNICA ACTIVA

| # | Ítem | Archivo | Acción |
|---|------|---------|--------|
| 1 | `class Tenat` → `Tenant` | `domain/contracts.py:8` | Renombrar |
| 2 | `ocurred_at` → `occurred_at` | `domain/events/base.py` | Renombrar |
| 3 | Directorio `acccess/` (triple c) | `application/services/` | Renombrar directorio |
| 4 | `asssign_role.py` vacío | `application/services/` | Eliminar |
| 5 | `aut_service.py` huérfano | `application/auth/` | Eliminar |
| 6 | `domain/events.py` duplicado | `domain/` | Eliminar el archivo, queda el paquete |

---

## GROWTH ROADMAP (Post-MVP)

```text
MES 1 (Mayo 2026)
├─ MVP v1.0 funcional y con RBAC activo
├─ Tests de integración en endpoints críticos
└─ Deploy a staging

MES 2 (Junio 2026)
├─ Reportes de stock en PDF/CSV
├─ Alertas de stock bajo por email
├─ Multi-warehouse (múltiples almacenes por tenant)
└─ Deploy a producción

MES 3+ (Julio 2026+)
├─ Importación masiva desde CSV/Excel
├─ Categorías de productos
├─ API mobile (React Native)
└─ Analytics dashboard con histórico de movimientos
```
