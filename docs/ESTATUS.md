# ESTATUS DEL PROYECTO BRIXO — MVP

**Fecha**: 20 de abril de 2026
**Rama activa**: `dev`
**Estado general**: Backend 100% · Frontend Sprint 1 en curso · MVP al 85%

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
FASE 5   Frontend MVP             ██░░░░░░░░   10%   ← EN CURSO
FASE 6   QA + Hardening           ░░░░░░░░░░    0%   ← bloqueada por 5
────────────────────────────────────────────────────
TOTAL MVP                         █████████░   85%
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

## Sesión 6 — 20 abr 2026 (Seguridad + Sprint 1 Backend)

### ✅ Completado — Seguridad de Tokens (OWASP Compliant)

**Arquitectura**: Hybrid approach con access token en memoria + refresh token en cookie HttpOnly

| Tarea | Archivo | Estado |
|-------|---------|--------|
| Access token: TTL 15 min, guardado en **memoria** (JS no puede acceder) | `services/api.ts` | ✅ |
| Refresh token: TTL 7 días, en cookie **HttpOnly + Secure + SameSite** | `routes/auth.py` | ✅ |
| User info: guardar en localStorage (sin token) | `stores/authStore.ts` | ✅ |
| Endpoint `POST /api/auth/refresh` con validación de refresh token | `routes/auth.py` | ✅ |
| Endpoint `POST /api/auth/logout` borra cookie | `routes/auth.py` | ✅ |
| Interceptor axios: auto-refresh en 401 (transparente para UI) | `services/api.ts` | ✅ |
| Hidratación `hydrate()`: al recargar, obtiene nuevo access token | `stores/authStore.ts` | ✅ |
| CORS: `allow_credentials=True` + incluir localhost:3000 | `main.py` | ✅ |

**Protecciones implementadas**:
- ✅ **XSS-proof**: Token inaccesible a JavaScript malicioso
- ✅ **CSRF-proof**: Cookies con `SameSite=Lax`
- ✅ **Token theft**: Access token corta duración (15 min)
- ✅ **Session hijacking**: Refresh token en HttpOnly (no se puede extraer)

---

## Sesión 6 — Sprint 1 (En curso)

### ✅ Completado — Tareas 1–5

| # | Tarea | Archivo | Tiempo | Estado |
|---|-------|---------|--------|--------|
| 1 | Setup TypeScript 6, vite.config.ts, estructura src/ | `tsconfig.json`, `vite.config.ts` | 35 min | ✅ |
| **2** | **Tokens de diseño + ThemeProvider + useTheme** | **`theme/tokens.ts`, `theme/ThemeProvider.tsx`** | **30 min** | **⭕** |
| **3** | **Button + Input + Field wrapper** | **`components/primitives/`** | **35 min** | **⭕** |
| **4** | **BrixoLogo + favicon** | **`components/BrixoLogo.tsx`, `public/favicon.svg`** | **20 min** | **⭕** |
| **5** | **api.ts + tipos backend** | **`services/api.ts`, `types/api.ts`** | **35 min** | **✅** |
| **6** | **authStore Zustand** | **`stores/authStore.ts`** | **25 min** | **✅** |
| **7** | **Routing + PrivateRoute** | **`App.tsx`, `components/layout/PrivateRoute.tsx`** | **25 min** | **✅** |
| **8** | **RegisterPage** | **`pages/RegisterPage.tsx`** | **40 min** | **⭕** |
| **9** | **LoginPage** | **`pages/LoginPage.tsx`** | **35 min** | **⭕** |

**Próximas tareas inmediatas**: 2, 3, 4 (design tokens y UI primitivos)

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
