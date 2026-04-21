# ESTATUS DEL PROYECTO BRIXO — MVP

**Fecha**: 21 de abril de 2026
**Rama activa**: `dev`
**Estado general**: Backend 100% · Frontend Sprint 1 completado · MVP al 93%

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
FASE 5   Frontend MVP             █████████░   90%   ← Sprint 1 ✅
FASE 6   QA + Hardening           ░░░░░░░░░░    0%   ← bloqueada por 5
────────────────────────────────────────────────────
TOTAL MVP                         █████████░   93%
```

**Cálculo**: Fases 1–4D = 83% base. Fase 5 al 10% aporta ~1.7% → **85% total**.

---

## Stack confirmado

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.12, FastAPI, Pydantic v2, psycopg2, PyJWT RS256 |
| Frontend | React 18, **TypeScript 6.0.3**, Vite 5, Zustand 5, React Router DOM 7, Axios 1.15 |
| Infra | Docker Compose, PostgreSQL 15, Redis 7-alpine |
| Auth | JWT RS256, RBAC por permisos (snapshots Redis) |

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

### Pendiente inmediato (Sprint 2)

7 pasos para dashboard operativo:

```
10 → AppShell + sidebar       (40 min)
11 → MetricCard + Card        (35 min)
12 → Toast + Skeleton         (20 min)
─────────────────────────────────────
13 → DashboardPage ⭐         (50 min)
```

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

## Fase 5 — Frontend MVP (10%)

**Stack**: React 18 + TypeScript 6 + Vite 5 + Zustand 5 + React Router DOM 7 + Axios 1.15

**Flujo de rutas MVP**:

```
/register  →  RegisterPage   (pública)
/login     →  LoginPage      (pública · si autenticado → /dashboard)
/dashboard →  DashboardPage  (privada · primera pantalla post-login)
/inventory →  InventoryPage  (privada)
/          →  redirect según sesión
```

### Sprint 1 — Auth (en curso)

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 1 | Setup TypeScript 6, vite.config.ts, estructura src/ | 35 min | ✅ |
| 2 | tokens.ts + ThemeProvider.tsx + useTheme | 30 min | ⭕ |
| 3 | Button.tsx + Input.tsx + Field wrapper | 35 min | ⭕ |
| 4 | BrixoLogo.tsx + favicon.svg | 20 min | ⭕ |
| 5 | api.ts + tipos del backend | 35 min | ⭕ |
| 6 | authStore.ts (Zustand) | 25 min | ⭕ |
| 7 | App.tsx routing + PrivateRoute + PublicOnlyRoute | 25 min | ⭕ |
| **8** | **RegisterPage.tsx** | **40 min** | **⭕** |
| **9** | **LoginPage.tsx** | **35 min** | **⭕** |

### Sprint 2 — Dashboard (bloqueado por Sprint 1)

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 10 | AppShell.tsx — sidebar + bottom-nav responsivo | 40 min | ⭕ |
| 11 | MetricCard + Card + Badge + AlertCard | 35 min | ⭕ |
| 12 | Toast global + Skeleton shimmer | 20 min | ⭕ |
| **13** | **DashboardPage.tsx** | **50 min** | **⭕** |

### Sprint 3 — Inventario + Acciones (bloqueado por Sprint 2)

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 14 | Modal.tsx + BottomSheet.tsx | 25 min | ⭕ |
| 15 | EmptyState.tsx | 10 min | ⭕ |
| **16** | **InventoryPage.tsx** | **50 min** | **⭕** |
| **17** | **MovementModal.tsx** | **50 min** | **⭕** |
| **18** | **ProductModal.tsx** | **35 min** | **⭕** |

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

**Documento actualizado**: 20 de abril de 2026 (sesión 5)
**Próxima revisión**: Al completar Sprint 1 (RegisterPage + LoginPage)
