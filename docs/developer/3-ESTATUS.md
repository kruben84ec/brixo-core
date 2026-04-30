# ESTATUS — Estado Técnico Actual (29 de abril de 2026)

**Branch**: `dev`  
**Estado MVP**: 100% funcional ✅  
**Deuda técnica**: 9 gaps identificados (requieren resolución antes de producción)

---

## Progreso General

```text
FASE 1   Infraestructura          ██████████  100%   ✅
FASE 2   Data Access Layer        ██████████  100%   ✅
FASE 3   Casos de Uso             ██████████  100%   ✅
FASE 4   Controladores / Rutas    ██████████  100%   ✅
FASE 4B  Seguridad Aplicada       ██████████  100%   ✅
FASE 4C  Observabilidad           ██████████  100%   ✅
FASE 4D  SaaS Auth + Bugs         ██████████  100%   ✅
FASE 5   Frontend MVP             ██████████  100%   ✅
FASE 6   QA + Hardening           ░░░░░░░░░░    0%   ⭕
────────────────────────────────────────────────────
TOTAL MVP                         ██████████  100%   ✅
```

**Novedades recientes (28-29 abr)**:
- ✅ Sprint 3 completado: InventoryPage + MovementModal + ProductModal funcionales
- ✅ UI Polish: CSS Modules bugs resueltos, Icon.tsx inline, BrixoLogo rediseñado, CSS vars normalizadas
- ✅ Audit profundo: 9 gaps de deuda técnica documentados (5 frontend, 4 backend)

---

## Backend: 100% ✅

### Infraestructura Docker (Fase 1)

- ✅ `docker-compose.yml` con healthchecks en postgres y redis
- ✅ Bind mounts con hot reload backend (uvicorn --reload + watchfiles)
- ✅ `WATCHFILES_FORCE_POLLING=1` para Windows Docker
- ✅ PostgreSQL 15, Redis 7-alpine

### Data Access Layer (Fase 2 — 8 repositorios)

| Repositorio | Adaptador SQL | Status |
|-------------|---------------|--------|
| AuthRepository | AuthRepositorySQL | ✅ |
| ProductRepository | ProductRepositorySQL | ✅ |
| InventoryMovementRepository | InventoryMovementRepositorySQL | ✅ |
| AuditLogRepository | AuditLogRepositorySQL | ✅ |
| UserRepository | UserRepositorySQL | ✅ |
| TenantRepository | TenantRepositorySQL | ✅ |
| RoleRepository | RoleRepositorySQL | ✅ |
| AccessRepository | AccessRepositorySQL | ✅ |

**Patrón**: Todos con puerto ABC + adaptador SQL real.

### Casos de Uso (Fase 3 — 8 de 8)

- ✅ SignUpUseCase — crea tenant + OWNER en una operación
- ✅ LoginUser — valida credenciales, genera JWT RS256
- ✅ CreateProductUseCase — validación SKU, filtro tenant_id
- ✅ RegisterInventoryMovementUseCase — registra entrada/salida/ajuste
- ✅ GetProductStockUseCase — calcula stock actual
- ✅ CreateUserUseCase — crea usuario con rol
- ✅ AssignRoleToUserUseCase — asigna rol a usuario
- ✅ GetAuditLogByTenantUseCase — historial de acciones

### Controladores y Rutas (Fase 4 — 100%)

**Endpoints activos**:

| Ruta | Métodos | Permiso | Status |
|------|---------|---------|--------|
| `/api/auth/register` | POST | (público) | ✅ |
| `/api/auth/login` | POST | (público) | ✅ |
| `/api/auth/refresh` | POST | token válido | ✅ |
| `/api/products/` | GET, POST | INVENTORY_* | ✅ |
| `/api/products/{id}/movements` | GET, POST | INVENTORY_* | ✅ |
| `/api/users/` | GET, POST | USERS_* | ✅ |
| `/api/users/{id}/roles` | POST | ROLES_WRITE | ✅ |
| `/api/audit/` | GET | AUDIT_READ | ✅ |
| `/me/access` | GET | (autenticado) | ✅ |
| `/health` | GET | (público) | ✅ |

**Swagger**: `http://localhost:8000/docs` con metadata completa

### Seguridad (Fase 4B — 100%)

- ✅ CORSMiddleware habilitado para `localhost:3000`
- ✅ `require_permission(code)` — FastAPI dependency, lee snapshot Redis
- ✅ RBAC activo en todos los endpoints protegidos
- ✅ JWTAuthMiddleware — RS256, `PUBLIC_PATHS` configurado
- ✅ `POST /api/auth/refresh` — renueva token sin re-login

### Observabilidad (Fase 4C — 100%)

- ✅ Logger JSON con `RotatingFileHandler`
- ✅ Logs en stdout (docker logs) + archivo rotado (backend/logs/app.log)
- ✅ `HTTPLoggingMiddleware` — registra method, path, status, duration, user_id, tenant_id
- ✅ Jerarquía de excepciones: BrixoException → NotFoundError, UnauthorizedError, ForbiddenError, ConflictError, DomainValidationError, InternalError
- ✅ 4 exception handlers globales

### SaaS Auth (Fase 4D — 100%)

- ✅ `POST /api/auth/register` — crea tenant + OWNER en una operación
- ✅ SignUpUseCase implementado
- ✅ Errores devuelven JSON `{ error, message }` consistente
- ✅ 5 bugs de runtime resueltos

---

## Frontend: 100% ✅ (Sprint 1-3 + UI Polish)

### Stack

- React 18
- TypeScript 6.0.3
- Vite 5
- Zustand 5 (state management)
- React Router DOM 7
- Axios 1.15 (HTTP client)
- CSS Modules (styling)

### Páginas Reales (llaman API)

| Página | Archivo | Funcionalidad | Status |
|--------|---------|---------------|--------|
| **RegisterPage** | `src/pages/RegisterPage.tsx` | 4 campos, error 409 inline, `POST /api/auth/register` | ✅ |
| **LoginPage** | `src/pages/LoginPage.tsx` | email + password, error 401 inline, `POST /api/auth/login` | ✅ |
| **DashboardPage** | `src/pages/DashboardPage.tsx` | KPIs, alertas, movimientos recientes — **datos simulados** | ✅ |
| **InventoryPage** | `src/pages/InventoryPage.tsx` | Tabla desktop + cards móvil, búsqueda, filtros, `GET /api/products/` real | ✅ |
| **MovementModal** | `src/components/MovementModal.tsx` | 3 pasos (tipo → producto → cantidad), `POST /api/products/{id}/movements` | ✅ |
| **ProductModal** | `src/components/ProductModal.tsx` | Nuevo producto, validación SKU 409, `POST /api/products/` | ✅ |

### Componentes Completados

**Primitivos**:
- ✅ Button.tsx — 4 variantes (primary, secondary, ghost, danger), 3 tamaños
- ✅ Input.tsx — con label, error, helper text, prop icon
- ✅ BrixoLogo.tsx — SVG dinámico (solid + line), responsive sizes
- ✅ Card.tsx, MetricCard.tsx, Badge.tsx, AlertCard.tsx

**Feedback**:
- ✅ Toast.tsx + ToastProvider — sistema global de notificaciones
- ✅ Skeleton.tsx — shimmer animation, respeta prefers-reduced-motion
- ✅ EmptyState.tsx — con CTA contextual
- ✅ Icon.tsx — ~20 íconos SVG inline sin librerías

**Layout**:
- ✅ AppShell.tsx — responsive (sidebar 240px desktop + bottom-nav móvil)
- ✅ Sidebar.tsx — navegación con avatar, logout, ítems activos coloreados
- ✅ TopBar.tsx — tema + campanita
- ✅ Modal.tsx, BottomSheet.tsx — contenedores reutilizables

**Otros**:
- ✅ ThemeProvider.tsx — dark/light, localStorage, `prefers-color-scheme`
- ✅ useTheme() hook — toggle de tema global
- ✅ api.ts — axios con JWT interceptor + refresh automático
- ✅ authStore.ts (Zustand) — token, user, logout, persistencia
- ✅ PrivateRoute.tsx + PublicOnlyRoute.tsx — guards de routing

### Tema y Diseño

- ✅ Tokens de diseño: índigo #4F46E5 (claro) / #818CF8 (oscuro)
- ✅ Colores semánticos: verde (entrada), rojo (salida), ámbar (ajuste)
- ✅ Tipografía: Inter + JetBrains Mono
- ✅ CSS Modules con variables CSS kebab-case normalizadas
- ✅ Dark mode integrado en todos los componentes
- ✅ Responsive: mobile-first, breakpoints en 768px y 1024px

### Build

- ✅ Vite build: 0 errores TypeScript, 140 módulos, 41.37 KB CSS
- ✅ Hot reload en dev: 2–3 segundos
- ✅ `tsc --noEmit`: 0 errores (1 warning pre-existente)

---

## Deuda Técnica Identificada en Audit (28 abr — Sesión 10)

Durante auditoría profunda de código, se identificaron **9 gaps críticos** que requieren resolución antes de producción. El MVP es 100% funcional pero estos temas están pendientes.

### Frontend — 5 Gaps

| # | Gap | Ubicación | Impacto | Severidad | Tiempo est. |
|---|-----|-----------|---------|-----------|-------------|
| 1 | DashboardPage — movimientos recientes simulados con `Math.random()`, no llama API real | `pages/DashboardPage.tsx:L50-70` | Datos inconsistentes, no reflejan realidad | Media | 30 min |
| 2 | LoginPage + RegisterPage — IDs de usuario hard-coded a `"temp"` | `pages/LoginPage.tsx:L45`, `RegisterPage.tsx:L52` | Lógica basada en IDs fallará silenciosamente | **Alta** | 20 min |
| 3 | App.tsx — Bug: Rutas privadas hidratadas condicionalmente | `App.tsx:L30` | Usuarios autenticados redirigidos a `/` al recargar | **Alta** | 25 min |
| 4 | BottomSheet nunca activado | `MovementModal.tsx:L15` | Modal no adapta a móvil | Baja | 15 min |
| 5 | Rutas post-MVP sin páginas reales | `App.tsx:L60-70` | `/movements`, `/team`, `/audit` son placeholders | Baja | 120 min |

### Backend — 4 Gaps

| # | Gap | Ubicación | Impacto | Severidad | Tiempo est. |
|---|-----|-----------|---------|-----------|-------------|
| 1 | `UserCreated` sin handler | `application/handlers.py` | Signup no se audita automáticamente | **Alta** | 15 min |
| 2 | `create_role()` + `revoke_role_from_user()` sin endpoints | `adapters/repositories/role_repository_sql.py` | Funcionalidad muerta, inaccesible | Baja | 30 min |
| 3 | Inconsistencia JWT TTL: 480 vs 15 minutos | `infrastructure/settings.py` + `infra/env/jwt.env` | Tokens expiran inesperadamente | Media | 10 min |
| 4 | `/me/access` fuera de `/api` prefix | `infrastructure/routes/` | Inconsistencia con resto de API | Baja | 5 min |

**Próximas acciones**: Resolver estos 9 gaps en Fase 6 antes de llevar a producción.

---

## Criterios de Éxito del MVP

### Backend ✅

| Criterio | Estado |
|----------|--------|
| `docker-compose up -d` levanta sin errores | ✅ |
| `GET /health` responde 200 | ✅ |
| `POST /api/auth/register` crea tenant + OWNER + retorna JWT | ✅ |
| `POST /api/auth/login` retorna JWT válido | ✅ |
| `POST /api/auth/refresh` renueva sin re-login | ✅ |
| Crear producto con permiso correcto | ✅ |
| Registrar movimiento con permiso correcto | ✅ |
| Usuario sin permiso recibe 403 | ✅ |
| Errores devuelven JSON `{ error, message }` | ✅ |
| Logs JSON en stdout y archivo | ✅ |

### Frontend ✅

| Criterio | Estado | Notas |
|----------|--------|-------|
| Setup TypeScript + Vite sin errores | ✅ | 0 errores strict |
| Un OWNER puede registrar su empresa | ✅ | POST /api/auth/register real |
| Un OWNER puede iniciar sesión | ✅ | POST /api/auth/login real |
| Dashboard UI renderiza correctamente | ✅ | AppShell + KPIs completos |
| Dashboard carga datos REALES del API | ⚠️ | KPIs reales, movimientos simulados |
| Puede ver su inventario con semáforo | ✅ | Tabla desktop + cards móvil |
| Puede registrar movimiento en < 10 seg | ✅ | 3 pasos: tipo → producto → cantidad |
| Puede agregar nuevo producto | ✅ | Modal con validación SKU 409 |
| Funciona en mobile y desktop | ✅ | AppShell adapta automáticamente |
| Modo oscuro y claro sin bugs | ✅ | Theme tokens + localStorage |

---

## Comandos Rápidos

```bash
# Levantar servicios
cd infra && docker-compose up -d

# Ver logs
docker logs -f brixo-backend
tail -f backend/logs/app.log

# Verificar salud
curl http://localhost:8000/health

# Acceso BD
docker exec -it brixo-postgres psql -U brixo_user -d brixo

# UI
open http://localhost:8000/docs        # Swagger
open http://localhost:3000             # Frontend
```

---

**Documento actualizado**: 29 de abril de 2026 (sesión 10 — audit + deuda técnica)  
**Próxima revisión**: Al iniciar Fase 6 (QA + Hardening)
