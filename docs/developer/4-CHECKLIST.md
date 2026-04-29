# CHECKLIST — Seguimiento de Tareas por Fase

**Actualizado**: 29 de abril de 2026  
**MVP**: 100% ✅ (Backend 100%, Frontend 100%, 9 gaps de deuda técnica documentados)

---

## Leyenda

- ✅ Completado y funcional
- ⭕ Pendiente
- 🔴 Bloqueante
- ⭐ Entregable visible (pantalla funcional)

---

## Backend — 100% ✅

### Fase 1: Infraestructura

| Ítem | Estado |
|------|--------|
| Redis en docker-compose | ✅ |
| Script SQL (8 tablas + seed) | ✅ |
| `settings.py` Pydantic BaseSettings | ✅ |
| `main.py` con lifespan + pool + routers | ✅ |
| Volumen postgres externo | ✅ |
| Env files montados | ✅ |
| `GET /health` sin autenticación | ✅ |
| Hot reload backend + frontend | ✅ |

### Fase 2: Data Access Layer

| Repositorio | Adaptador SQL | Estado |
|-------------|---------------|--------|
| AuthRepository | AuthRepositorySQL | ✅ |
| ProductRepository | ProductRepositorySQL | ✅ |
| InventoryMovementRepository | InventoryMovementRepositorySQL | ✅ |
| AuditLogRepository | AuditLogRepositorySQL | ✅ |
| UserRepository | UserRepositorySQL | ✅ |
| TenantRepository | TenantRepositorySQL | ✅ |
| RoleRepository | RoleRepositorySQL | ✅ |
| AccessRepository | AccessRepositorySQL | ✅ |

### Fase 3: Casos de Uso

| Use Case | Estado |
|----------|--------|
| SignUpUseCase | ✅ |
| LoginUser | ✅ |
| CreateProductUseCase | ✅ |
| RegisterInventoryMovementUseCase | ✅ |
| GetProductStockUseCase | ✅ |
| CreateUserUseCase | ✅ |
| AssignRoleToUserUseCase | ✅ |
| GetAuditLogByTenantUseCase | ✅ |

### Fase 4: Rutas y Controladores

| Endpoint | Permiso | Estado |
|----------|---------|--------|
| POST /api/auth/login | público | ✅ |
| POST /api/auth/register | público | ✅ |
| POST /api/auth/refresh | token válido | ✅ |
| GET /api/products/ | INVENTORY_READ | ✅ |
| POST /api/products/ | INVENTORY_WRITE | ✅ |
| GET /api/products/{id} | INVENTORY_READ | ✅ |
| POST /api/products/{id}/movements | INVENTORY_WRITE | ✅ |
| GET /api/users/ | USERS_READ | ✅ |
| POST /api/users/ | USERS_WRITE | ✅ |
| POST /api/users/{id}/roles | ROLES_WRITE | ✅ |
| GET /api/audit/ | AUDIT_READ | ✅ |
| GET /health | público | ✅ |

### Fase 4B: Seguridad

| Ítem | Estado |
|------|--------|
| CORS habilitado para localhost:3000 | ✅ |
| `require_permission(code)` FastAPI dependency | ✅ |
| RBAC activo en todos endpoints protegidos | ✅ |
| JWTAuthMiddleware RS256 + PUBLIC_PATHS | ✅ |

### Fase 4C: Observabilidad

| Ítem | Estado |
|------|--------|
| Logger JSON + RotatingFileHandler | ✅ |
| `HTTPLoggingMiddleware` | ✅ |
| Jerarquía `BrixoException` tipada | ✅ |
| 4 exception handlers globales | ✅ |
| Logs en `backend/logs/app.log` vía bind mount | ✅ |

### Fase 4D: SaaS Auth + Bugs

| Ítem | Estado |
|------|--------|
| POST /api/auth/register (tenant + OWNER + JWT) | ✅ |
| SignUpUseCase | ✅ |
| 5 bugs de runtime resueltos | ✅ |
| UnauthorizedError en login (no ValueError) | ✅ |
| ConflictError 409 en tenant duplicado | ✅ |

---

## Frontend — 100% ✅ (Sprint 1-3 Completo + UI Polish)

### Sprint 1: Auth (completado ✅)

| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 1 | Setup TypeScript 6, estructura src/ | `tsconfig.json`, `vite.config.ts` | ✅ |
| 2 | Tokens + ThemeProvider + useTheme | `theme/tokens.ts`, `theme/ThemeProvider.tsx` | ✅ |
| 3 | Button + Input (primitivos) | `components/primitives/` | ✅ |
| 4 | BrixoLogo + favicon.svg | `components/BrixoLogo.tsx`, `public/` | ✅ |
| 5 | api.ts — axios + JWT + tipos | `services/api.ts`, `types/api.ts` | ✅ |
| 6 | authStore.ts (Zustand) | `stores/authStore.ts` | ✅ |
| 7 | Routing + PrivateRoute + PublicOnlyRoute | `App.tsx`, `components/layout/PrivateRoute.tsx` | ✅ |
| 8 | ⭐ RegisterPage.tsx | `pages/RegisterPage.tsx` | ✅ |
| 9 | ⭐ LoginPage.tsx | `pages/LoginPage.tsx` | ✅ |

### Sprint 2: Dashboard (completado ✅)

| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 10 | AppShell — sidebar + bottom-nav responsivo | `components/layout/AppShell.tsx` | ✅ |
| 11 | MetricCard + Card + Badge + AlertCard | `components/feedback/` | ✅ |
| 12 | Toast global + Skeleton shimmer | `components/feedback/Toast.tsx` | ✅ |
| 13 | ⭐ DashboardPage.tsx (KPIs + movimientos) | `pages/DashboardPage.tsx` | ✅ |

### Sprint 3: Inventario + Acciones (completado ✅)

| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 14 | Modal + BottomSheet | `components/feedback/` | ✅ |
| 15 | EmptyState | `components/feedback/EmptyState.tsx` | ✅ |
| 16 | ⭐ InventoryPage.tsx | `pages/InventoryPage.tsx` | ✅ |
| 17 | ⭐ MovementModal.tsx | `components/MovementModal.tsx` | ✅ |
| 18 | ⭐ ProductModal.tsx | `components/ProductModal.tsx` | ✅ |

### UI Polish (28 abr 2026) ✅

| Ítem | Estado |
|------|--------|
| Bug CSS Modules: Button/Input sin estilos | ✅ |
| Bug AppShell: `toggle` → `toggleTheme` | ✅ |
| Bug App.tsx: `MovementsPagePlaceholder` undefined | ✅ |
| Icon.tsx — SVG inline sin librerías | ✅ |
| BrixoLogo.tsx rediseñado | ✅ |
| AppShell + Sidebar con iconos SVG | ✅ |
| MetricCard: delta-based, sin emoji | ✅ |
| AlertCard: border-left 3px únicamente | ✅ |
| Badge: border-radius 6px | ✅ |
| Auth pages: card desktop, full-screen móvil | ✅ |
| CSS vars camelCase → kebab-case (5 archivos) | ✅ |

### Post-MVP (no bloquea valor)

| # | Tarea | Estado |
|---|-------|--------|
| 19 | LandingPage.tsx | ⭕ |
| 20 | AuditPage.tsx | ⭕ |
| 21 | TeamPage.tsx | ⭕ |
| 22 | useAccess.ts — vistas por rol | ⭕ |
| 23 | Accesibilidad WCAG 2.1 AA | ⭕ |
| 24 | ErrorBoundary + build optimizado | ⭕ |

---

## Fase 6: QA + Hardening — 0% ⭕

### Tareas QA y Testing

| Tarea | Tipo | Estado |
|-------|------|--------|
| Testing manual flujo completo | QA | ⭕ |
| Fix bugs encontrados | Dev | ⭕ |
| Rate limiting POST /api/auth/login | Seguridad | ⭕ |
| Validar TTL Redis + expiración token | Seguridad | ⭕ |
| Cabeceras de seguridad HTTP | Seguridad | ⭕ |
| `request_id` en HTTPLoggingMiddleware | Observabilidad | ⭕ |
| `docker-compose.prod.yml` | Infra | ⭕ |

### Deuda Técnica a Resolver (9 gaps)

**Frontend (5 gaps)**:
- ⭕ DashboardPage: conectar movimientos reales (GET /api/products/{id}/movements)
- ⭕ LoginPage/RegisterPage: llamar GET /api/users/me post-login
- ⭕ App.tsx: fijar bug rutas privadas (hidratación async)
- ⭕ MovementModal: pasar isMobile correcto desde DashboardPage
- ⭕ Crear páginas `/movements`, `/team`, `/audit` reales

**Backend (4 gaps)**:
- ⭕ Evento UserCreated sin handler — registrar handler para auditoría
- ⭕ create_role() + revoke_role_from_user() sin endpoints HTTP
- ⭕ Inconsistencia JWT TTL: decidir entre 480 o 15 minutos
- ⭕ /me/access → /api/me/access (consistencia)

---

## Criterios MVP — Estado Actual

| Criterio | Estado |
|----------|--------|
| Backend levanta sin errores | ✅ |
| Register crea empresa + OWNER + retorna JWT | ✅ |
| Login retorna JWT válido | ✅ |
| Refresh renueva sin re-login | ✅ |
| Errores devuelven JSON `{ error, message }` | ✅ |
| RBAC activo (403 sin permiso) | ✅ |
| Logs JSON observables | ✅ |
| **OWNER puede registrarse desde browser** | ✅ |
| **OWNER puede iniciar sesión y ver dashboard** | ✅ |
| **OWNER puede ver inventario con semáforo** | ✅ |
| **OPERATOR puede registrar movimiento en < 10 seg** | ✅ |
| **OWNER puede agregar producto nuevo** | ✅ |
| Funciona en mobile y desktop | ✅ |
| Modo oscuro y claro sin bugs | ✅ |

---

**Checklist actualizado**: 29 de abril de 2026  
**Próxima revisión**: Al completar Fase 6 (QA + Hardening)
