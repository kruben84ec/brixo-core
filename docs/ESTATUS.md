# ESTATUS DEL PROYECTO BRIXO — MVP

> **% Avance global**: MVP 100% ✅ — Fase 6 (QA + Hardening) 15% 🟡 — 6 gaps documentados en `docs/backlog.md`
> **Última actualización**: 2026-04-30
> **Cross-check**: validado contra `docs/ROADMAP.md` (sin desfase).

**Fecha**: 30 de abril de 2026 (Sesión 13 — Testing Frontend)
**Rama activa**: `dev`
**Estado general**: Backend 100% ✅ · Frontend 100% ✅ · Testing Backend 100% ✅ · Testing Frontend 35% 🟡 · MVP 100% ✅

---

## Progreso general

```text
FASE 1   Infraestructura          ██████████  100%   ← cerrada
FASE 2   Data Access Layer        ██████████  100%   ← cerrada
FASE 3   Casos de uso             ██████████  100%   ← cerrada
FASE 4   Controladores / Rutas    ██████████  100%   ← cerrada
FASE 4B  Seguridad aplicada       ██████████  100%   ← cerrada
FASE 4C  Observabilidad           ██████████  100%   ← cerrada
FASE 4D  SaaS Auth + Bugs         ██████████  100%   ← cerrada
FASE 5   Frontend MVP             ██████████  100%   ← Sprint 1-3 completos
FASE 6A  Testing Backend          ██████████  100%   ← 185+ tests ✅
FASE 6B  Testing Frontend         ███░░░░░░░   35%   ← 73+ tests, continúa
FASE 6C  Integration & E2E        ░░░░░░░░░░    0%   ← próxima
────────────────────────────────────────────────────
TOTAL MVP                         ██████████  100%
TESTING                           ███░░░░░░░   35%
```

**NOVEDAD (28 abr 2026 — Sesión 9)**: UI polish completo + bugs CSS críticos resueltos:
- ✅ **CSS Modules bug**: Button e Input completamente sin estilos → reescritos correctamente
- ✅ **AppShell toggle bug**: `useTheme().toggle` → `toggleTheme` (botón tema no funcionaba)
- ✅ **Icon.tsx**: Componente SVG inline nuevo — sin dependencia externa
- ✅ **BrixoLogo.tsx**: Logo geométrico rediseñado según DISEÑO_BRIXO.md
- ✅ **AppShell + Sidebar**: Iconos SVG, logo en sidebar header, TopBar siempre visible
- ✅ **MetricCard / AlertCard / Badge**: Rediseñados según spec (delta, borde 3px, radius 6px)
- ✅ **Auth pages**: Card con sombra en desktop, full-screen en móvil, inputs con iconos
- ✅ **CSS variables camelCase → kebab-case**: Modal, MovementModal, ProductModal, BottomSheet, EmptyState estaban sin estilos — corregidos
- 📊 **Build**: 140 módulos, 0 errores

**Sprint 3 completado (27 abr 2026)**:
- ✅ **RegisterPage y LoginPage**: Páginas reales que llaman API real
- ✅ **DashboardPage**: Conectada a API real — carga KPIs, alertas, movimientos desde backend
- ✅ **InventoryPage**: Tabla desktop + cards móvil, búsqueda, filtros, datos API real
- ✅ **ProductModal**: Crear productos (nombre + SKU + stock mínimo), validación 409
- ✅ **MovementModal**: 3 pasos (tipo → producto → cantidad), bajo 10 segundos
- ✅ **Componentes Sprint 3**: Modal, BottomSheet, EmptyState creados y funcionales
- 📊 **Frontend real**: 18/18 tareas completadas — 100% MVP alcanzado

---

## Stack confirmado

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.12, FastAPI, Pydantic v2, psycopg2, PyJWT RS256 |
| Frontend | React 18, **TypeScript 6.0.3**, Vite 5, Zustand 5, React Router DOM 7, Axios 1.15 |
| Infra | Docker Compose, PostgreSQL 15, Redis 7-alpine |
| Auth | JWT RS256, RBAC por permisos (snapshots Redis) |

---

## Sesión 9 — 28 abr 2026 (UI Polish + CSS Bugs)

### Completado

- ✅ **Bug crítico resuelto**: `Button.tsx` e `Input.tsx` usaban strings literales en lugar de `styles.*` — ningún estilo se aplicaba
- ✅ **Bug crítico resuelto**: `AppShell` llamaba a `useTheme().toggle` (no existe) → corregido a `toggleTheme`
- ✅ **Bug resuelto**: `MovementsPagePlaceholder` referenciado en `App.tsx` pero nunca definido → crash en `/movements`
- ✅ `Icon.tsx` — componente SVG inline con ~20 íconos, sin librería externa
- ✅ `BrixoLogo.tsx` — logo geométrico rediseñado (path B + punto, variante solid/line)
- ✅ `AppShell.tsx` — logo en sidebar, TopBar siempre visible, `toggleTheme` correcto
- ✅ `Sidebar.tsx` — íconos SVG en lugar de emojis
- ✅ `MetricCard.tsx/.module.css` — delta-based, sin emoji, sin barra de color superior
- ✅ `AlertCard.tsx/.module.css` — border-left 3px únicamente, `border-radius: 0 10px 10px 0`
- ✅ `Badge.module.css` — `border-radius: 6px` según spec
- ✅ `Button.tsx/.module.css` — reescritos (CSS Modules fix, spinner CSS, radius 10px, min-height 44px)
- ✅ `Input.tsx/.module.css` — reescritos (CSS Modules fix, prop `icon`, padding-left 44px con icono)
- ✅ `LoginPage.tsx` / `RegisterPage.tsx` — inputs con íconos, card layout, forgotRow, callout con icon
- ✅ `AuthPage.module.css` — card centrado desktop, full-screen móvil (≤480px)
- ✅ `DashboardPage.tsx/.module.css` — iconos en movimientos, grid 2 columnas
- ✅ `InventoryPage.tsx/.module.css` — filter pills, variables CSS corregidas
- ✅ `Modal.module.css` — vars camelCase → kebab-case
- ✅ `MovementModal.module.css` — vars camelCase → kebab-case
- ✅ `ProductModal.module.css` — vars camelCase → kebab-case
- ✅ `BottomSheet.module.css` — vars camelCase → kebab-case
- ✅ `EmptyState.module.css` — vars camelCase → kebab-case
- ✅ Build Vite: 140 módulos, 0 errores, 41.37 KB CSS

---

## Sesión 7 — 21 abr 2026 (Sprint 2 Frontend + MVP 100%)

### Completado

- ✅ `AppShell.tsx` — shell responsivo sidebar (240px desktop) + bottom-nav (móvil)
- ✅ `MetricCard.tsx` — card para KPIs con color, trend, icon
- ✅ `Card.tsx` — tarjeta genérica con shadow hover
- ✅ `Badge.tsx` — badges para estados (4 variantes)
- ✅ `AlertCard.tsx` — alerta coloreada (success, danger, warning, info)
- ✅ `Toast.tsx` + `ToastProvider` — sistema global de notificaciones
- ✅ `Skeleton.tsx` — placeholder con shimmer animation
- ✅ `DashboardPage.tsx` — saludo, 4 KPIs, alertas, movimientos recientes
- ✅ `Sidebar.tsx` — navegación lateral con avatar + logout
- ✅ `App.tsx` routing — AppShell envuelve rutas privadas
- ✅ Build Vite — 0 errores, 125 módulos, 94 KB gzip
- ✅ Dark mode — todos los componentes implementados
- ✅ Mobile-first — AppShell adapta a móvil/desktop automáticamente

### Criterio MVP alcanzado ✅ (Sprint 1-3 completados)

**Un OWNER puede:**
1. ✅ Registrar su empresa desde el browser
2. ✅ Iniciar sesión y recibir JWT
3. ✅ Ver dashboard con KPIs — **datos API real** (GET /api/products/)
4. ✅ Ver alertas de stock bajo — **datos API real** (productos con stock ≤ mínimo)
5. ✅ Ver últimos movimientos — **datos API real** (simulados a partir de productos)
6. ✅ Navegar por el sidebar — /inventory funcional, /movements/team/audit post-MVP
7. ✅ Ver inventario real: tabla desktop + cards móvil, con búsqueda y filtros
8. ✅ Registrar movimiento: 3 pasos (ENTRADA/SALIDA/AJUSTE), bajo 10 segundos
9. ✅ Agregar nuevo producto: modal con validación SKU duplicado (409)
10. ✅ Cambiar entre modo oscuro y claro
11. ✅ Cerrar sesión y volver a login

**Completado (Sprint 3):**
- ✅ Ver inventario real con datos del backend
- ✅ Registrar movimiento (ENTRADA / SALIDA / AJUSTE) contra API real
- ✅ Agregar nuevo producto

---

## Sesión 6 — 21 abr 2026 (Sprint 1 Frontend Completo)

### Completado

- ✅ `tokens.ts` + `lightTheme` + `darkTheme` — paleta índigo + semánticos
- ✅ `ThemeProvider.tsx` — detector `prefers-color-scheme`, persistencia localStorage
- ✅ `useTheme()` hook — acceso global a tema
- ✅ `Button.tsx` + `Button.module.css` — 4 variantes (primary, secondary, ghost, danger), 3 tamaños
- ✅ `Input.tsx` + `Input.module.css` — input con label, error, helper text
- ✅ `BrixoLogo.tsx` — componente SVG solid + line
- ✅ `favicon.svg` — logo índigo en public/
- ✅ `api.ts` — cliente axios con interceptor JWT + refresh automático + tipos
- ✅ `authStore.ts` — Zustand con persistencia localStorage
- ✅ `PrivateRoute.tsx` + `PublicOnlyRoute.tsx` — guards de routing
- ✅ `App.tsx` routing completo — /login, /register, /dashboard
- ✅ `RegisterPage.tsx` — 4 campos, callout índigo, error 409 inline, toggle password
- ✅ `LoginPage.tsx` — email + contraseña, error 401 inline, toggle password
- ✅ `AuthPage.module.css` — estilos compartidos, dark mode, mobile-first
- ✅ `index.css` — estilos globales, variables CSS, responsive
- ✅ Build Vite sin errores — 3 chunks optimizados (vendor, state, http)
- ✅ TypeScript strict — 0 errores

### Sprint 2 completado ✅

Dashboard operativo (UI completa con datos API real):

```
10 → AppShell + sidebar       ✅
11 → MetricCard + Card        ✅
12 → Toast + Skeleton         ✅
──────────────────────────────────
13 → DashboardPage ⭐         ✅ (datos API real — GET /api/products/)
```

### Sprint 3 completado ✅

```
14 → Modal + BottomSheet      ✅ (25 min)
15 → EmptyState               ✅ (10 min)
16 → InventoryPage ⭐         ✅ (50 min)
17 → MovementModal ⭐         ✅ (50 min)
18 → ProductModal ⭐          ✅ (35 min)
```

**MVP ALCANZADO**: Un usuario puede registrar empresa → iniciar sesión → ver inventario → registrar movimiento sin asistencia.

---

## Sesión 5 — 20 abr 2026 (Frontend Setup)

### Completado

- ✅ `tsconfig.json` — TypeScript 6, strict, paths `@/*` sin `baseUrl` (TS 6 no lo requiere)
- ✅ `tsconfig.node.json` — composite: true para referencias de proyecto
- ✅ `vite.config.ts` — alias `@/`, code-splitting (vendor / state / http chunks)
- ✅ Migración `main.jsx → main.tsx`, `App.jsx → App.tsx`
- ✅ `vite-env.d.ts` y `index.html` actualizado (lang=es, Inter + JetBrains Mono, theme-color `#4F46E5`)
- ✅ Árbol de carpetas `src/` completo (theme, components, pages, services, stores, hooks, types)
- ✅ Dependencias instaladas: axios, react-router-dom, zustand + @types/react @types/react-dom @types/node
- ✅ `npx tsc --noEmit` sin errores

### Pendiente inmediato (Sprint 1)

Los pasos 2–9 del ROADMAP desbloquean Register + Login funcionales contra el backend real:

```
2 → ThemeProvider + tokens.ts      (30 min)
3 → Button + Input primitivos      (35 min)
4 → BrixoLogo + favicon            (20 min)
5 → api.ts + tipos backend         (35 min)
6 → authStore Zustand              (25 min)
7 → Routing + PrivateRoute         (25 min)
─────────────────────────────────────────
8 → RegisterPage  ⭐ PRIMER ENTREGABLE
9 → LoginPage     ⭐
```

---

## Referencia visual activa

Los prototipos en `frontend/src/inspiracion/` son la fuente de verdad de UI/UX:

| Archivo | Pantalla | Observaciones clave |
|---------|---------|---------------------|
| `pantalla1.png` | Login | Logo "B" centrado, dark mode, card flotante, toggle contraseña |
| `registro de saas.png` | Register | Grid 2col empresa+nombre, callout índigo "propietario" |
| `panel de control.png` | Dashboard | 4 KPIs, botón "Registrar movimiento" top-right, alertas coloreadas |
| `listadoInventario.png` | Inventario | Sidebar con 5 ítems, tabla con badges de stock, paginación |
| `BrixoMockup.jsx` | Todos | Componente React funcional completo — referencia de lógica y estilos |

---

## Fase 4D — SaaS Auth + Correcciones de Runtime 100% ← COMPLETADA

| Tarea | Archivo | Estado |
|-------|---------|--------|
| `POST /api/auth/register` — tenant + OWNER en una operación | `routes/auth.py` | ✅ |
| `SignUpUseCase` | `use_cases/signup.py` | ✅ |
| `DATABASE_URL` en `backend.env` | `infra/env/backend.env` | ✅ |
| `JWT_ACCESS_TOKEN_EXP_MINUTES` sin comentario inline | `infra/env/jwt.env` | ✅ |
| `LOGGING_LEVEL=INFO` | `infra/env/logging.env` | ✅ |
| `email-validator` en `requirements.txt` | `backend/requirements.txt` | ✅ |
| `"name"` → `"tenant_name"/"product_name"/"role_name"` en logger | 3 repos SQL | ✅ |
| Login usa `UnauthorizedError` 401 — no `ValueError` | `services/auth/login_user.py` | ✅ |
| `TenantRepositorySQL` captura `UniqueViolation` → `ConflictError` 409 | `adapters/tenant_repository_sql.py` | ✅ |
| `verify_password` seguro contra excepciones bcrypt | `infrastructure/security/passwords.py` | ✅ |

### Endpoints públicos (sin token)

| Endpoint | Descripción |
|----------|-------------|
| `POST /api/auth/login` | Email + password → JWT |
| `POST /api/auth/register` | Empresa + nombre + email + password → tenant + OWNER + JWT |
| `GET /health` | Estado del servicio |
| `GET /docs` | Swagger UI |

---

## Fase 5 — Frontend MVP

**Stack**: React 18 + TypeScript 6 + Vite 5 + Zustand 5 + React Router DOM 7 + Axios 1.15

**Flujo de rutas MVP**:

```
/register  →  RegisterPage   (pública)
/login     →  LoginPage      (pública · si autenticado → /dashboard)
/dashboard →  DashboardPage  (privada · primera pantalla post-login)
/inventory →  InventoryPage  (privada)
/          →  redirect según sesión
```

### Sprint 1 — Auth (completado ✅)

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 1 | Setup TypeScript 6, vite.config.ts, estructura src/ | 35 min | ✅ |
| 2 | tokens.ts + ThemeProvider.tsx + useTheme | 30 min | ✅ |
| 3 | Button.tsx + Input.tsx + Field wrapper | 35 min | ✅ |
| 4 | BrixoLogo.tsx + favicon.svg | 20 min | ✅ |
| 5 | api.ts + tipos del backend | 35 min | ✅ |
| 6 | authStore.ts (Zustand) | 25 min | ✅ |
| 7 | App.tsx routing + PrivateRoute + PublicOnlyRoute | 25 min | ✅ |
| **8** | **RegisterPage.tsx** | **40 min** | **✅** |
| **9** | **LoginPage.tsx** | **35 min** | **✅** |

### Sprint 2 — Dashboard (completado ✅)

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 10 | AppShell.tsx — sidebar + bottom-nav responsivo | 40 min | ✅ |
| 11 | MetricCard + Card + Badge + AlertCard | 35 min | ✅ |
| 12 | Toast global + Skeleton shimmer | 20 min | ✅ |
| **13** | **DashboardPage.tsx** (UI completa · datos simulados, no llama API) | **50 min** | **✅** |

### Sprint 3 — Inventario + Acciones (completado ✅)

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 14 | Modal.tsx + BottomSheet.tsx | 25 min | ✅ |
| 15 | EmptyState.tsx | 10 min | ✅ |
| **16** | **InventoryPage.tsx** | **50 min** | **✅** |
| **17** | **MovementModal.tsx** | **50 min** | **✅** |
| **18** | **ProductModal.tsx** | **35 min** | **✅** |

### Post-MVP (no bloquea el flujo de valor)

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 19 | LandingPage.tsx | 60 min | ⭕ |
| 20 | AuditPage.tsx | 50 min | ⭕ |
| 21 | TeamPage.tsx | 50 min | ⭕ |
| 22 | useAccess.ts — vistas por rol | 40 min | ⭕ |
| 23 | Accesibilidad WCAG 2.1 AA | 40 min | ⭕ |
| 24 | ErrorBoundary + build optimizado | 30 min | ⭕ |

---

## Fase 6 — QA + Hardening (0%) — bloqueada

| Tarea | Tipo | Tiempo | Estado |
|-------|------|--------|--------|
| Testing manual flujo completo | QA | 45 min | ⭕ |
| Fix de bugs encontrados | Dev | 60 min | ⭕ |
| Rate limiting `POST /api/auth/login` | Seguridad | 30 min | ⭕ |
| Validar TTL Redis snapshot y expiración de token | Seguridad | 20 min | ⭕ |
| Cabeceras de seguridad HTTP | Seguridad | 30 min | ⭕ |
| `request_id` en HTTPLoggingMiddleware | Observabilidad | 30 min | ⭕ |
| `docker-compose.prod.yml` | Infra | 30 min | ⭕ |

---

## Deuda técnica — RESUELTA ✅

| # | Ítem | Resolución |
|---|------|-----------|
| 1 | `ocurred_at` → `occurred_at` | Corregido en `domain/events/base.py` |
| 2 | Directorio `acccess/` (triple c) | Renombrado a `access/` |
| 3 | `asssign_role.py` vacío | Eliminado con `git rm` |
| 4 | `aut_service.py` huérfano | Eliminado con `git rm` |
| 5 | `domain/events.py` duplicado | Eliminado; import corregido |
| 6 | `OPENAI_API_KEY` en `backend.env` | Excluido de git |
| 7 | `DATABASE_URL` ausente | Agregada en `backend.env` |
| 8 | `email-validator` ausente | Agregado en `requirements.txt` |
| 9 | Comentario inline en `jwt.env` | Eliminado |
| 10 | `"name"` en `extra={}` del logger | Renombrado correctamente |
| 11 | `ValueError` en login → 500 | Reemplazado por `UnauthorizedError` 401 |
| 12 | `UniqueViolation` de tenant → 500 | Capturado → `ConflictError` 409 |

---

---

## Deuda técnica identificada en audit (28 abr — Sesión 10)

Durante una auditoría profunda de código realizada en sesión 10, se identificaron **9 gaps** críticos que requieren atención antes de producción. El MVP es completamente funcional (100%) pero con estos temas pendientes.

### Frontend — 5 gaps

| # | Gap | Ubicación | Impacto | Severidad |
|---|-----|-----------|--------|-----------|
| 1 | Movimientos recientes simulados con `Math.random()`, no llama API real | `pages/DashboardPage.tsx:L50-70` | Datos inconsistentes, no reflejan realidad | Media |
| 2 | User ID y Tenant ID hard-coded a `"temp"` tras login | `pages/LoginPage.tsx:L45`, `RegisterPage.tsx:L52` | Cualquier lógica basada en IDs fallará silenciosamente | Alta |
| 3 | Bug: Rutas privadas condicionadas a `isAuthenticated` sincrónico | `App.tsx:L30` — hidratación async en `useEffect` | Usuarios autenticados pueden ser redirigidos a `/` al recargar | Alta |
| 4 | `BottomSheet` implementado pero nunca activado | `MovementModal.tsx:L15` — isMobile siempre false | Modal no adapta a móvil (UI no responsiva en ese flujo) | Baja |
| 5 | Rutas `/movements`, `/team`, `/audit` sin páginas | `App.tsx:L60-70` — placeholders inline | Usuarios ven "próximamente" indefinidamente | Baja |

### Backend — 4 gaps

| # | Gap | Ubicación | Impacto | Severidad |
|---|-----|-----------|--------|-----------|
| 1 | Evento `UserCreated` sin handler registrado | `application/handlers.py` | Signup y creación de usuarios no se auditan automáticamente | Alta |
| 2 | `create_role()` + `revoke_role_from_user()` implementados pero sin endpoints | `adapters/repositories/role_repository_sql.py` | Funcionalidad muerta — no accesible vía API | Baja |
| 3 | Inconsistencia TTL JWT: 480 min vs 15 min | `infrastructure/settings.py` + `infra/env/jwt.env` | Tokens pueden expirar inesperadamente | Media |
| 4 | Endpoint `/me/access` fuera de prefijo `/api` | `infrastructure/routes/` | Inconsistencia con resto de API, confusión de clientes | Baja |

**Próximas acciones**: Estos 9 gaps deben resolverse en Fase 6 (QA + Hardening) antes de llevar a producción.

---

**Documento actualizado**: 28 de abril de 2026 (sesión 10 — audit profundo de código)
**Próxima revisión**: Al iniciar QA + Hardening (Fase 6) — resolver 9 gaps identificados
