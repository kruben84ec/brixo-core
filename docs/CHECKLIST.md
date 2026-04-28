# CHECKLIST — Estado del Proyecto Brixo

**Actualizado**: 28 de abril de 2026 · **Sprint 1-3**: ✅ · **UI Polish**: ✅ · **MVP**: ✅
**Branch**: `dev`
**Fuente de verdad de avance**: [ROADMAP.md](ROADMAP.md) — [ESTATUS.md](ESTATUS.md)

---

## Leyenda

- ✅ Completado y funcional
- ⭕ Pendiente
- 🔴 Bloqueante — sin esto no avanza el sprint
- ⭐ Entregable visible — pantalla funcional contra backend real

---

## Backend — 100% ✅

### Fase 1 — Infraestructura

| Ítem | Estado |
|------|--------|
| Redis en docker-compose | ✅ |
| Script SQL (8 tablas + seed) | ✅ |
| `settings.py` Pydantic BaseSettings | ✅ |
| `main.py` con lifespan + pool + routers | ✅ |
| Volumen postgres externo | ✅ |
| Env files montados `./env:/app/env:ro` | ✅ |
| `GET /health` sin autenticación | ✅ |
| Hot reload backend + frontend | ✅ |

### Fase 2 — Data Access Layer

| Repositorio | Adaptador SQL | Estado |
|-------------|---------------|--------|
| `AuthRepository` | `AuthRepositorySQL` | ✅ |
| `ProductRepository` | `ProductRepositorySQL` | ✅ |
| `InventoryMovementRepository` | `InventoryMovementRepositorySQL` | ✅ |
| `AuditLogRepository` | `AuditLogRepositorySQL` | ✅ |
| `UserRepository` | `UserRepositorySQL` | ✅ |
| `TenantRepository` | `TenantRepositorySQL` | ✅ |
| `RoleRepository` | `RoleRepositorySQL` | ✅ |
| `AccessRepository` | `AccessRepositorySQL` | ✅ |

### Fase 3 — Casos de Uso

| Use Case | Archivo | Estado |
|----------|---------|--------|
| `LoginUser` | `application/services/auth/login_user.py` | ✅ |
| `SignUpUseCase` | `application/use_cases/signup.py` | ✅ |
| `CreateProductUseCase` | `application/use_cases/create_product.py` | ✅ |
| `RegisterInventoryMovementUseCase` | `application/use_cases/register_inventory_movement.py` | ✅ |
| `GetProductStockUseCase` | `application/use_cases/get_product_stock.py` | ✅ |
| `CreateUserUseCase` | `application/use_cases/create_user.py` | ✅ |
| `AssignRoleToUserUseCase` | `application/use_cases/assign_role_to_user.py` | ✅ |
| `GetAuditLogByTenantUseCase` | `application/use_cases/get_audit_log_by_tenant.py` | ✅ |

### Fase 4 — Rutas y Controladores

| Endpoint | Permiso | Estado |
|----------|---------|--------|
| `POST /api/auth/login` | público | ✅ |
| `POST /api/auth/register` | público | ✅ |
| `POST /api/auth/refresh` | token válido | ✅ |
| `GET /api/products/` | `INVENTORY_READ` | ✅ |
| `POST /api/products/` | `INVENTORY_WRITE` | ✅ |
| `GET /api/products/{id}` | `INVENTORY_READ` | ✅ |
| `POST /api/products/{id}/movements` | `INVENTORY_WRITE` | ✅ |
| `GET /api/products/{id}/movements` | `INVENTORY_READ` | ✅ |
| `GET /api/users/` | `USERS_READ` | ✅ |
| `POST /api/users/` | `USERS_WRITE` | ✅ |
| `POST /api/users/{id}/roles` | `ROLES_WRITE` | ✅ |
| `GET /api/audit/?limit=N` | `AUDIT_READ` | ✅ |
| `GET /me/access` | token válido | ✅ |
| `GET /health` | público | ✅ |

### Fase 4B — Seguridad

| Ítem | Estado |
|------|--------|
| CORS habilitado para `localhost:3000` | ✅ |
| `require_permission(code)` FastAPI dependency | ✅ |
| RBAC activo en todos los endpoints protegidos | ✅ |
| `JWTAuthMiddleware` RS256 + `PUBLIC_PATHS` | ✅ |

### Fase 4C — Observabilidad

| Ítem | Estado |
|------|--------|
| Logger JSON + RotatingFileHandler | ✅ |
| `HTTPLoggingMiddleware` | ✅ |
| Jerarquía `BrixoException` tipada | ✅ |
| 4 exception handlers globales | ✅ |
| Logs en `backend/logs/app.log` vía bind mount | ✅ |

### Fase 4D — SaaS Auth + Bugs

| Ítem | Estado |
|------|--------|
| `POST /api/auth/register` (tenant + OWNER + JWT) | ✅ |
| `SignUpUseCase` | ✅ |
| 5 bugs de runtime resueltos | ✅ |
| `UnauthorizedError` en login (no `ValueError`) | ✅ |
| `ConflictError` 409 en tenant duplicado | ✅ |

---

## Frontend — 100% ✅ (Sprint 1-3 Completo + UI Polish)

**Stack**: React 18 + TypeScript 6.0.3 + Vite 5 + Zustand 5 + React Router DOM 7 + Axios 1.15

**Referencia visual**: `frontend/src/inspiracion/` (4 prototipos + BrixoMockup.jsx)

### Sprint 1 — Auth (completado ✅)

| # | Ítem | Archivo | Estado |
|---|------|---------|--------|
| 1 | Setup TypeScript 6 + estructura src/ | `tsconfig.json`, `vite.config.ts` | ✅ |
| 2 | Tokens de diseño + ThemeProvider + useTheme | `theme/tokens.ts`, `theme/ThemeProvider.tsx` | ✅ |
| 3 | Button.tsx + Input.tsx (primitivos de formulario) | `components/primitives/` | ✅ |
| 4 | BrixoLogo.tsx + favicon.svg | `components/BrixoLogo.tsx`, `public/` | ✅ |
| 5 | api.ts — axios + interceptor JWT + refresh + tipos | `services/api.ts`, `types/api.ts` | ✅ |
| 6 | authStore.ts — Zustand + localStorage | `stores/authStore.ts` | ✅ |
| 7 | Routing + PrivateRoute + PublicOnlyRoute | `App.tsx`, `components/layout/PrivateRoute.tsx` | ✅ |
| 8 | ⭐ RegisterPage.tsx | `pages/RegisterPage.tsx` | ✅ |
| 9 | ⭐ LoginPage.tsx | `pages/LoginPage.tsx` | ✅ |

**Criterio de done Sprint 1**: Un OWNER puede registrar una empresa y luego iniciar sesión desde el browser, con token guardado y redirect a `/dashboard`.

### Sprint 2 — Dashboard ✅

| # | Ítem | Archivo | Estado |
|---|------|---------|--------|
| 10 | AppShell — sidebar 240px (desktop) + bottom-nav (móvil) | `components/layout/AppShell.tsx` | ✅ |
| 11 | MetricCard + Card + Badge + AlertCard | `components/feedback/` | ✅ |
| 12 | Toast global + Skeleton shimmer | `components/feedback/Toast.tsx` | ✅ |
| 13 | ⭐ DashboardPage.tsx — KPIs + movimientos + alertas | `pages/DashboardPage.tsx` | ✅ |

**Criterio de done Sprint 2**: El usuario ve su dashboard con datos reales del backend al hacer login.

### Sprint 3 — Inventario + Acciones ✅

| # | Ítem | Archivo | Estado |
|---|------|---------|--------|
| 14 | Modal.tsx + BottomSheet.tsx | `components/feedback/` | ✅ |
| 15 | EmptyState.tsx | `components/feedback/EmptyState.tsx` | ✅ |
| 16 | ⭐ InventoryPage.tsx — tabla + cards móvil + filtros | `pages/InventoryPage.tsx` | ✅ |
| 17 | ⭐ MovementModal.tsx — ENTRADA/SALIDA/AJUSTE | `components/MovementModal.tsx` | ✅ |
| 18 | ⭐ ProductModal.tsx — nuevo producto + error 409 | `components/ProductModal.tsx` | ✅ |

**Criterio de done Sprint 3**: El usuario puede ver su inventario, registrar un movimiento y agregar un producto. **MVP completo** ✅

### UI Polish — Sesión 9 (28 abr 2026) ✅

| Ítem | Archivo | Estado |
|------|---------|--------|
| Bug CSS Modules: Button/Input sin estilos | `components/primitives/Button.tsx`, `Input.tsx` | ✅ |
| Bug AppShell: `toggle` → `toggleTheme` | `components/layout/AppShell.tsx` | ✅ |
| Bug App.tsx: `MovementsPagePlaceholder` undefined | `App.tsx` | ✅ |
| Icon.tsx — SVG inline sin librería externa | `components/Icon.tsx` | ✅ |
| BrixoLogo.tsx rediseñado (spec DISEÑO_BRIXO) | `components/BrixoLogo.tsx` | ✅ |
| AppShell + Sidebar con iconos SVG | `components/layout/` | ✅ |
| MetricCard: delta-based, sin emoji | `components/feedback/MetricCard.tsx` | ✅ |
| AlertCard: border-left 3px únicamente | `components/feedback/AlertCard.tsx` | ✅ |
| Badge: border-radius 6px | `components/feedback/Badge.module.css` | ✅ |
| Auth pages: card desktop, full-screen móvil | `pages/AuthPage.module.css` | ✅ |
| CSS vars normalizadas: 5 archivos (Modal, MovementModal, ProductModal, BottomSheet, EmptyState) | `*.module.css` | ✅ |

### Post-MVP (después de validar con usuarios reales)

| # | Ítem | Estado |
|---|------|--------|
| 19 | LandingPage.tsx — página promocional | ⭕ |
| 20 | AuditPage.tsx — historial paginado | ⭕ |
| 21 | TeamPage.tsx — gestión de usuarios y roles | ⭕ |
| 22 | useAccess.ts — vistas diferenciadas por rol | ⭕ |
| 23 | Accesibilidad WCAG 2.1 AA | ⭕ |
| 24 | ErrorBoundary + build optimizado + Lighthouse ≥ 85 | ⭕ |

---

## QA + Hardening — 0% ⭕ (bloqueado por Sprint 3)

| Ítem | Tipo | Estado |
|------|------|--------|
| Testing manual flujo completo | QA | ⭕ |
| Fix de bugs encontrados | Dev | ⭕ |
| Rate limiting `POST /api/auth/login` (5/60s por IP) | Seguridad | ⭕ |
| Validar TTL Redis snapshot y expiración token | Seguridad | ⭕ |
| Cabeceras de seguridad HTTP | Seguridad | ⭕ |
| `request_id` en HTTPLoggingMiddleware | Observabilidad | ⭕ |
| `docker-compose.prod.yml` | Infra | ⭕ |

---

## Criterios MVP — Estado actual

| Criterio | Estado |
|----------|--------|
| Backend levanta sin errores | ✅ |
| Register crea empresa + OWNER + devuelve JWT | ✅ |
| Login devuelve JWT válido | ✅ |
| Refresh renueva sin re-login | ✅ |
| Errores devuelven JSON `{ error, message }` | ✅ |
| RBAC activo (403 sin permiso) | ✅ |
| Logs JSON observables | ✅ |
| **OWNER puede registrarse desde el browser** | ✅ |
| **OWNER puede iniciar sesión y ver dashboard** | ✅ (datos simulados) |
| **OWNER puede ver inventario con semáforo de stock** | ✅ |
| **OPERATOR puede registrar movimiento en < 10 seg** | ✅ |
| **OWNER puede agregar un producto nuevo** | ✅ |
| Funciona en mobile y desktop | ✅ |
| Modo oscuro y claro sin bugs visuales | ✅ |
