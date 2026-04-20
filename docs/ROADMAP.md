# ROADMAP — BRIXO MVP 2026

**Actualizado**: 18 de abril de 2026  
**Estado**: Backend 100% + Observabilidad activa + Deuda técnica resuelta — Próximo: Fase 5 Frontend — MVP al 80%  
**Criterio de MVP**: Usuario puede hacer login → crear producto → registrar movimiento → ver auditoría, con RBAC activo

---

## Resumen ejecutivo

```text
FASE 1   Infraestructura          ██████████  100%   ← cerrada
FASE 2   Data Access Layer        ██████████  100%   ← cerrada
FASE 3   Casos de uso             ██████████  100%   ← cerrada
FASE 4   Controladores / Rutas    ██████████  100%   ← cerrada
FASE 4B  Seguridad aplicada       ██████████  100%   ← cerrada
FASE 4C  Observabilidad           ██████████  100%   ← cerrada
FASE 5   Frontend                 █░░░░░░░░░    5%   ← PROXIMA
FASE 6   QA + Hardening           ░░░░░░░░░░    0%   ← bloqueada por Fase 5
────────────────────────────────────────────────────
TOTAL MVP                         ████████░░   80%
```

---

## Orden de ejecución recomendado

```text
PROXIMAS 2 SEMANAS — Fase 5 Frontend
├─ Día 1: npm install + api.js + authStore + LoginPage
├─ Día 2: ProductListPage + ProductFormModal + MovementFormModal
└─ Día 3: DashboardPage + AuditLogPage + routing + estilos

CIERRE — Fase 6 QA + Hardening
└─ Día 1: testing manual + rate limiting + fixes + docker-compose.prod.yml
```

---

## Fase 1 — Infraestructura

**Estado**: 100% ← cerrada

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 1 | Redis en docker-compose | 15 min | ✅ |
| 2 | Script SQL completo (8 tablas + seed) | 45 min | ✅ |
| 3 | settings.py con Pydantic BaseSettings | 20 min | ✅ |
| 4 | main.py con lifespan + pool + routers | 30 min | ✅ |
| 5 | Volumen postgres externo (bind mount `./data/postgres`) | 10 min | ✅ |
| 6 | Env files montados en contenedor (`./env:/app/env:ro`) | 10 min | ✅ |
| 7 | `GET /health` — responde 200 sin token | 10 min | ✅ |

**Validación**: `curl http://localhost:8000/health` → `{"status": "ok"}`

---

## Fase 2 — Data Access Layer

**Estado**: 100% ← cerrada

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

---

## Fase 3 — Casos de uso

**Estado**: 100% ← cerrada

| # | Use Case | Archivo | Estado |
|---|----------|---------|--------|
| 1 | `LoginUser` | `application/services/auth/login_user.py` | ✅ |
| 2 | `CreateProductUseCase` | `application/use_cases/create_product.py` | ✅ |
| 3 | `RegisterInventoryMovementUseCase` | `application/use_cases/register_inventory_movement.py` | ✅ |
| 4 | `GetProductStockUseCase` | `application/use_cases/get_product_stock.py` | ✅ |
| 5 | `CreateUserUseCase` | `application/use_cases/create_user.py` | ✅ |
| 6 | `AssignRoleToUserUseCase` | `application/use_cases/assign_role_to_user.py` | ✅ |
| 7 | `GetAuditLogByTenantUseCase` | `application/use_cases/get_audit_log_by_tenant.py` | ✅ |

---

## Fase 4 — Controladores y Rutas

**Estado**: 100% ← cerrada

| # | Tarea | Rutas | Estado |
|---|-------|-------|--------|
| 1 | `LoginRequest` Pydantic + `TokenResponse` | `POST /api/auth/login` | ✅ |
| 2 | `ProductController` | `GET/POST /api/products/`, `GET /api/products/{id}` | ✅ |
| 3 | `InventoryController` | `POST/GET /api/products/{id}/movements` | ✅ |
| 4 | `UserController` | `GET/POST /api/users/` | ✅ |
| 5 | `AuditController` | `GET /api/audit/?limit=N` | ✅ |
| 6 | `AccessController` + Redis snapshot | `GET /me/access` | ✅ |
| 7 | `PUBLIC_PATHS` en `JWTAuthMiddleware` | `/docs /redoc /openapi.json /health /api/auth/login` | ✅ |
| 8 | Audit trail en `handlers.py` | — | ✅ |
| 9 | `POST /api/users/{id}/roles` | `POST /api/users/{id}/roles` | ✅ |

---

## Fase 4B — Seguridad aplicada

**Estado**: 100% ← cerrada

| # | Tarea | Archivo | Tiempo | Estado |
|---|-------|---------|--------|--------|
| 1 | CORS en `main.py` | `backend/main.py` | 10 min | ✅ |
| 2 | `require_permission(code)` FastAPI dependency | `infrastructure/security/permissions.py` | 45 min | ✅ |
| 3 | Aplicar `require_permission` en endpoints críticos | `routes/products.py`, `routes/users.py` | 30 min | ✅ |
| 4 | `POST /api/auth/refresh` | `infrastructure/api/routes/auth.py` | 45 min | ✅ |

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

## Fase 4C — Observabilidad y Manejo de Excepciones

**Estado**: 100% ← cerrada

| # | Tarea | Archivo | Tiempo | Estado |
|---|-------|---------|--------|--------|
| 1 | Logger JSON + `RotatingFileHandler` (stdout + `/app/logs/app.log`) | `infrastructure/logging.py` | 30 min | ✅ |
| 2 | `domain/exceptions.py` — jerarquía tipada de excepciones | `domain/exceptions.py` | 20 min | ✅ |
| 3 | `HTTPLoggingMiddleware` — method/path/status/duration/user_id | `infrastructure/api/middleware/http_logging.py` | 30 min | ✅ |
| 4 | Exception handlers globales (dominio, HTTP, validación, catch-all) | `infrastructure/api/exception_handlers.py` | 45 min | ✅ |
| 5 | Registrar middlewares y handlers en `main.py` | `backend/main.py` | 15 min | ✅ |

---

## Fase 5 — Frontend

**Estado**: 5% — **Entrada**: API con CORS activo / **Salida**: UI funcional para el flujo MVP

**Stack**: React 18 + **TypeScript 5** + Vite 5 + Zustand + React Router DOM + Axios

**Flujo de navegación**:

- `/` → `LandingPage` (pública, promocional) → si autenticado redirige a `/dashboard`
- `/login` / `/register` → públicas → si autenticado redirigen a `/dashboard`
- `/dashboard` → primera pantalla post-login (ruta privada)
- `/inventory`, `/movements`, `/team`, `/audit` → rutas privadas por permiso

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 1 | Setup TypeScript: `tsconfig.json`, `vite.config.ts`, aliases `@/`, migrar `.jsx → .tsx` | 20 min | ⭕ |
| 2 | `npm install` — axios, react-router-dom, zustand + @types/react @types/node | 15 min | ⭕ |
| 3 | `src/theme/tokens.ts` + `ThemeProvider.tsx` + `useTheme` hook tipado | 30 min | ⭕ |
| 4 | `BrixoLogo.tsx` — variantes solid/line/horizontal + favicon assets | 20 min | ⭕ |
| 5 | Primitivos: `Button.tsx`, `Input.tsx`, `Badge.tsx` | 40 min | ⭕ |
| 6 | Feedback: `Card.tsx`, `Toast.tsx`, `Skeleton.tsx`, `EmptyState.tsx` | 40 min | ⭕ |
| 7 | Overlays: `Modal.tsx`, `BottomSheet.tsx` | 30 min | ⭕ |
| 8 | `src/services/api.ts` — axios + interceptor JWT + refresh + tipos del backend | 30 min | ⭕ |
| 9 | `authStore.ts` (Zustand) — token, user, logout, permisos, localStorage | 30 min | ⭕ |
| 10 | Layout: `AppShell.tsx`, sidebar desktop, bottom-nav móvil, `PrivateRoute.tsx` | 40 min | ⭕ |
| 11 | `LandingPage.tsx` — página promocional pública de Brixo | 60 min | ⭕ |
| 12 | `LoginPage.tsx` + `RegisterPage.tsx` | 60 min | ⭕ |
| 13 | `DashboardPage.tsx` — KPIs + movimientos recientes + alertas (segunda pantalla post-login) | 50 min | ⭕ |
| 14 | `InventoryPage.tsx` — tabla desktop + cards móvil + semáforo 3 estados | 50 min | ⭕ |
| 15 | `MovementModal.tsx` — ENTRADA / SALIDA / AJUSTE con validación | 50 min | ⭕ |
| 16 | `ProductModal.tsx` — formulario + manejo error 409 SKU duplicado | 40 min | ⭕ |
| 17 | `AuditPage.tsx` + `TeamPage.tsx` (gestión de equipo y roles) | 50 min | ⭕ |
| 18 | `useAccess.ts` (vistas por rol) + accesibilidad WCAG 2.1 AA + build final | 70 min | ⭕ |
| **TOTAL** | | **~11h** | |

**Validación**: landing → registro → login → dashboard → crear producto → registrar movimiento → ver auditoría

---

## Fase 6 — QA + Hardening

**Estado**: 0% — **Entrada**: Frontend funcional / **Salida**: MVP listo para producción

| # | Tarea | Tipo | Tiempo | Estado |
|---|-------|------|--------|--------|
| 1 | Testing manual flujo completo | QA | 45 min | ⭕ |
| 2 | Fix de bugs encontrados | Dev | 60 min | ⭕ |
| 3 | Rate limiting en `POST /api/auth/login` — máx. 5 intentos / 60s por IP | Seguridad | 30 min | ⭕ |
| 4 | Validar TTL del Redis snapshot y expiración del token | Seguridad | 20 min | ⭕ |
| 5 | Cabeceras de seguridad HTTP (`X-Content-Type-Options`, `X-Frame-Options`, etc.) | Seguridad | 30 min | ⭕ |
| 6 | `request_id` en `HTTPLoggingMiddleware` + header `X-Request-ID` en respuestas | Observabilidad | 30 min | ⭕ |
| 7 | `docker-compose.prod.yml` con variables de entorno seguras | Infra | 30 min | ⭕ |
| 8 | README actualizado con instrucciones de uso | Docs | — | ✅ |
| **TOTAL** | | | **4h 25min** | |

---

## Capa de seguridad — Arquitectura

```text
REQUEST
  │
  ▼
CORSMiddleware                     ← outermost — preflight OPTIONS sin auth
  │
  ▼
HTTPLoggingMiddleware              ← registra method/path/status/duration/user_id
  │
  ▼
JWTAuthMiddleware                  ← valida RS256, inyecta user_id + tenant_id
  │                                   publica UserAuthenticated en EventBus
  ▼
UserAccessProjection               ← escucha UserAuthenticated
  │                                   consulta roles + permisos en BD
  │                                   guarda snapshot en Redis
  ▼
require_permission(code)           ← lee snapshot de Redis
  │                                   lanza 403 si el código falta
  ▼
Handler / Use Case
  │
  ▼
Exception Handlers                 ← separan mensaje al cliente de log técnico
  │
  ▼
AuditLogRepository                 ← persiste cada acción en audit_logs
```

---

## Deuda técnica — RESUELTA ✅

Todos los ítems resueltos en sesión 3 (18 abr 2026).

| # | Ítem | Resolución |
|---|------|-----------|
| 1 | `ocurred_at` → `occurred_at` | Corregido en `domain/events/base.py` |
| 2 | Directorio `acccess/` (triple c) | Renombrado a `access/`, imports actualizados |
| 3 | `asssign_role.py` vacío | Eliminado con `git rm` |
| 4 | `aut_service.py` huérfano | Eliminado con `git rm` |
| 5 | `domain/events.py` duplicado | Eliminado; import corregido a `domain.events.base` |
| 6 | `OPENAI_API_KEY` en `backend.env` | `infra/env/*.env` excluido de git en `.gitignore` |

---

## Criterios de éxito del MVP

| Criterio | Estado |
|----------|--------|
| `docker-compose up -d` levanta sin errores | ✅ |
| `GET /health` responde 200 | ✅ |
| `POST /api/auth/login` retorna JWT válido | ✅ |
| `GET /docs` accesible sin token | ✅ |
| Crear producto funciona con permiso correcto | ✅ |
| Registrar movimiento funciona con permiso correcto | ✅ |
| Usuario sin permiso recibe 403 | ✅ |
| Token expirado se renueva con refresh | ✅ |
| Logs visibles en stdout y en `backend/logs/app.log` | ✅ |
| Errores devuelven JSON consistente al frontend | ✅ |
| Frontend carga en `http://localhost:3000` | ⭕ |
| Flujo completo login → producto → movimiento → auditoría | ⭕ |

---

## Growth Roadmap (Post-MVP)

```text
MES 1 — Mayo 2026
├─ MVP v1.0 funcional con RBAC activo
├─ Tests de integración en endpoints críticos
└─ Deploy a staging

MES 2 — Junio 2026
├─ Reportes de stock en PDF/CSV
├─ Alertas de stock bajo por email/webhook
├─ Multi-warehouse (múltiples almacenes por tenant)
└─ Deploy a producción

MES 3+ — Julio 2026 en adelante
├─ Agente de reabastecimiento predictivo
├─ Detector de anomalías de inventario
├─ Importación masiva desde CSV/Excel
├─ API mobile (React Native)
└─ Analytics dashboard con histórico de movimientos
```
