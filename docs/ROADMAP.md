# ROADMAP — BRIXO MVP 2026

**Actualizado**: 20 de abril de 2026
**Estado**: Backend 100% · Frontend en curso (Setup TS completo) · MVP al 85%
**Criterio de MVP**: Un OWNER puede registrar su empresa → iniciar sesión → ver su inventario → registrar un movimiento, sin capacitación previa.

---

## Resumen ejecutivo

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

**Stack frontend**: React 18 + TypeScript 6 + Vite 5 + Zustand 5 + React Router DOM 7 + Axios 1.15

---

## Fase 5 — Frontend MVP

**Enfoque**: entregar las pantallas que un usuario real necesita para operar su negocio. Auditoría, gestión de equipo y landing promocional son post-MVP y no bloquean el flujo de valor.

**Referencia visual**: `frontend/src/inspiracion/` — 4 prototipos funcionales (Login, Registro, Dashboard, Inventario) que son la fuente de verdad de UI/UX para la implementación.

**Flujo de navegación MVP**:

```
/register  →  RegisterPage   (pública)
/login     →  LoginPage      (pública · si autenticado → /dashboard)
/dashboard →  DashboardPage  (privada · primera pantalla post-login)
/inventory →  InventoryPage  (privada)
/          →  redirect /login (o /dashboard si hay sesión)
```

---

### Sprint 1 — Fundación + Auth (objetivo: Register y Login funcionando)

> Tiempo estimado: ~3.5h · Entregable: usuario puede registrarse e iniciar sesión

| # | Tarea | Archivo(s) | Tiempo | Estado |
|---|-------|-----------|--------|--------|
| 1 | Setup TypeScript 6, vite.config.ts, aliases @/, estructura src/ | `tsconfig.json`, `vite.config.ts`, `src/` | 35 min | ✅ |
| 2 | Tokens de diseño tipados + ThemeProvider + hook useTheme | `theme/tokens.ts`, `theme/ThemeProvider.tsx` | 30 min | ⭕ |
| 3 | Primitivos UI: Button, Input, Field wrapper | `components/primitives/` | 35 min | ⭕ |
| 4 | BrixoLogo (solid, line) + favicon.svg | `components/BrixoLogo.tsx`, `public/favicon.svg` | 20 min | ⭕ |
| 5 | Cliente API: axios + interceptor JWT + refresh automático + tipos | `services/api.ts`, `types/api.ts` | 35 min | ⭕ |
| 6 | authStore Zustand: token, user, logout, persistencia localStorage | `stores/authStore.ts` | 25 min | ⭕ |
| 7 | Routing + PrivateRoute + PublicOnlyRoute (guard inverso) | `App.tsx`, `components/layout/PrivateRoute.tsx` | 25 min | ⭕ |
| **8** | **RegisterPage** — 4 campos, callout propietario, error 409 inline | `pages/RegisterPage.tsx` | 40 min | ⭕ |
| **9** | **LoginPage** — email + contraseña, toggle pwd, error 401 inline | `pages/LoginPage.tsx` | 35 min | ⭕ |

**UX crítico Sprint 1** (basado en prototipos de inspiración):
- Login y Register en dark mode de forma nativa desde el primer render
- El logo "B" índigo aparece centrado en ambas pantallas antes del título
- Register usa layout de 2 columnas para "empresa + nombre" en la misma fila (prototipo)
- Botón "Crear empresa y empezar" — texto exacto del prototipo
- Callout índigo: "Serás el **propietario** de la empresa. Después podrás invitar a tu equipo."
- Error 401/409 aparece inline bajo el botón, no como toast flotante

---

### Sprint 2 — Shell + Dashboard (objetivo: primera pantalla post-login)

> Tiempo estimado: ~2.5h · Entregable: dashboard operativo con datos reales

| # | Tarea | Archivo(s) | Tiempo | Estado |
|---|-------|-----------|--------|--------|
| 10 | AppShell responsivo: sidebar 240px (desktop) + bottom-nav 4 ítems (móvil) | `components/layout/AppShell.tsx` | 40 min | ⭕ |
| 11 | Componentes de datos: MetricCard, Card, Badge de estado, AlertCard | `components/feedback/` | 35 min | ⭕ |
| 12 | Toast global + Skeleton shimmer (prefers-reduced-motion) | `components/feedback/Toast.tsx`, `Skeleton.tsx` | 20 min | ⭕ |
| **13** | **DashboardPage** — saludo, 4 KPIs, movimientos recientes, alertas | `pages/DashboardPage.tsx` | 50 min | ⭕ |

**UX crítico Sprint 2** (basado en prototipo panel de control):
- Saludo "Hola, [nombre]" con empresa y fecha/hora local en español
- Botón "+ Registrar movimiento" prominente top-right en desktop, ancho full en móvil
- KPIs en grid 2col (móvil) / 4col (desktop) con Skeleton mientras carga
- "Stock bajo" con valor en rojo + delta "Requiere reposición"
- Sección "Requiere atención" ordena: danger primero, warning después
- Movimientos recientes: círculo de color (rojo/verde/ámbar), nombre producto, tipo, cantidad, tiempo relativo
- "Ver todos" → navega a /inventory

---

### Sprint 3 — Inventario + Acciones (objetivo: flujo de negocio completo)

> Tiempo estimado: ~3h · Entregable: MVP completo y usable

| # | Tarea | Archivo(s) | Tiempo | Estado |
|---|-------|-----------|--------|--------|
| 14 | Modal + BottomSheet (contenedor reutilizable) | `components/feedback/Modal.tsx`, `BottomSheet.tsx` | 25 min | ⭕ |
| 15 | EmptyState (con CTA contextual) | `components/feedback/EmptyState.tsx` | 10 min | ⭕ |
| **16** | **InventoryPage** — tabla desktop + cards móvil + búsqueda + filtros | `pages/InventoryPage.tsx` | 50 min | ⭕ |
| **17** | **MovementModal** — ENTRADA / SALIDA / AJUSTE, 3 pasos, < 10 segundos | `components/MovementModal.tsx` | 50 min | ⭕ |
| **18** | **ProductModal** — formulario nuevo producto, error 409 SKU duplicado | `components/ProductModal.tsx` | 35 min | ⭕ |

**UX crítico Sprint 3** (basado en prototipo inventario):
- Sidebar muestra ítems: Panel, Inventario, Movimientos, Equipo, Auditoría — con ítem activo en brandSoft
- Avatar "LJ" (iniciales) con nombre y rol "Propietaria" en el pie del sidebar
- Tabla: columnas Producto · SKU (mono) · Stock · Mínimo · Estado · [acción]
- Badges de estado en columna final: "En stock" (verde) · "Al límite" (ámbar) · "Stock bajo" (rojo)
- Stock coloreado por estado — **nunca la fila entera**
- Filtro "Stock bajo · 3" con contador dinámico y borde rojo cuando activo
- Paginación "Mostrando N de X productos" con botones Anterior/Siguiente
- MovementModal: 3 botones grandes ENTRADA/SALIDA/AJUSTE → selector producto con búsqueda → cantidad → confirmar

---

## Fase 5 — Post-MVP (no bloquea el flujo de valor)

Estas pantallas se implementan después de validar el MVP core con usuarios reales.

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 19 | LandingPage — página promocional pública | 60 min | ⭕ |
| 20 | AuditPage — historial paginado con filtros | 50 min | ⭕ |
| 21 | TeamPage — gestión de usuarios y roles | 50 min | ⭕ |
| 22 | useAccess.ts — vistas diferenciadas por rol OWNER/MANAGER/OPERATOR | 40 min | ⭕ |
| 23 | Accesibilidad WCAG 2.1 AA — audit de contrastes, teclado, ARIA | 40 min | ⭕ |
| 24 | ErrorBoundary + build optimizado + Lighthouse ≥ 85 | 30 min | ⭕ |

---

## Fase 5 — Principios UI/UX no negociables

Derivados de `DISEÑO_BRIXO.md` y validados contra los 4 prototipos de `inspiracion/`:

1. **Dark mode nativo** — las 4 pantallas del prototipo están en oscuro. El ThemeProvider detecta `prefers-color-scheme` y respeta lo guardado en localStorage.
2. **Tokens, nunca colores hardcoded** — todo valor de color, sombra y tipografía viene de `tokens.ts`. Cambiar un token cambia toda la app.
3. **`tabular-nums` en toda columna numérica** — stock, cantidades, KPIs. Nunca permitas que los números "bailen" al hacer scroll.
4. **Colorear el dato, no el contenedor** — el número de stock se colorea; la fila de la tabla no.
5. **Semáforo de 3 estados** — En stock (verde) · Al límite (ámbar) · Stock bajo (rojo). Sin dicotomías.
6. **Un solo CTA primario por pantalla** — botón índigo, único, obvio. Los demás son ghost o icon.
7. **Targets táctiles 44px mínimo** — especialmente los botones +/− del inventario móvil.
8. **El flujo de movimiento en < 10 seg** — tipo → producto → cantidad → confirmar. Sin pasos extra.
9. **Mobile-first real** — base tipográfica 15px en móvil, bottom-nav con safe-area-inset, FAB 56px.
10. **Feedback inmediato** — Skeleton mientras carga, toast al completar, error inline al fallar.

---

## Fase 6 — QA + Hardening

**Entrada**: Frontend MVP completo · **Salida**: listo para producción

| # | Tarea | Tipo | Tiempo | Estado |
|---|-------|------|--------|--------|
| 1 | Testing manual flujo completo (registro → movimiento) | QA | 45 min | ⭕ |
| 2 | Fix bugs encontrados | Dev | 60 min | ⭕ |
| 3 | Rate limiting `POST /api/auth/login` — máx. 5/60s por IP | Seguridad | 30 min | ⭕ |
| 4 | Validar TTL Redis snapshot y expiración de token | Seguridad | 20 min | ⭕ |
| 5 | Cabeceras de seguridad HTTP | Seguridad | 30 min | ⭕ |
| 6 | `request_id` en `HTTPLoggingMiddleware` + header `X-Request-ID` | Observabilidad | 30 min | ⭕ |
| 7 | `docker-compose.prod.yml` | Infra | 30 min | ⭕ |
| **TOTAL** | | | **4h 25min** | |

---

## Criterios de éxito del MVP

### Backend ✅ — 100% completo

| Criterio | Estado |
|----------|--------|
| `docker-compose up -d` levanta sin errores | ✅ |
| `GET /health` responde 200 | ✅ |
| `POST /api/auth/register` crea tenant + OWNER + retorna JWT | ✅ |
| `POST /api/auth/login` retorna JWT válido | ✅ |
| `POST /api/auth/refresh` renueva sin re-login | ✅ |
| Crear producto funciona con permiso correcto | ✅ |
| Registrar movimiento funciona con permiso correcto | ✅ |
| Usuario sin permiso recibe 403 | ✅ |
| Errores devuelven JSON consistente `{ error, message }` | ✅ |
| Logs JSON en stdout y `backend/logs/app.log` | ✅ |

### Frontend ⭕ — En curso

| Criterio | Estado |
|----------|--------|
| Setup TypeScript 6 + Vite 5 sin errores | ✅ |
| Un OWNER puede registrar su empresa desde el browser | ⭕ |
| Un OWNER puede iniciar sesión y ver el dashboard | ⭕ |
| Puede ver su inventario con semáforo de stock | ⭕ |
| Puede registrar un movimiento en < 10 segundos | ⭕ |
| Puede agregar un nuevo producto | ⭕ |
| Funciona en mobile y desktop (responsive) | ⭕ |
| Modo oscuro y claro sin bugs visuales | ⭕ |

---

## Deuda técnica — RESUELTA ✅

| # | Ítem | Resolución |
|---|------|-----------|
| 1 | `ocurred_at` → `occurred_at` | Corregido en `domain/events/base.py` |
| 2 | Directorio `acccess/` (triple c) | Renombrado a `access/` |
| 3 | `asssign_role.py` vacío | Eliminado con `git rm` |
| 4 | `aut_service.py` huérfano | Eliminado con `git rm` |
| 5 | `domain/events.py` duplicado | Eliminado, import corregido |
| 6 | `OPENAI_API_KEY` en `backend.env` | Env files excluidos de git |
| 7 | `DATABASE_URL` ausente | Agregada en `backend.env` |
| 8 | `email-validator` ausente | Agregado en `requirements.txt` |
| 9 | Comentario inline en `jwt.env` | Eliminado |
| 10 | `"name"` en `extra={}` del logger | Renombrado correctamente |
| 11 | `ValueError` en login → 500 | Reemplazado por `UnauthorizedError` |
| 12 | `UniqueViolation` tenant → 500 | Capturado → `ConflictError` 409 |

---

## Growth Roadmap (Post-MVP)

```text
MES 1 — Mayo 2026
├─ MVP v1.0 funcional con flujo completo
├─ Deploy a staging
└─ Primeros usuarios reales

MES 2 — Junio 2026
├─ LandingPage + AuditPage + TeamPage
├─ Alertas de stock bajo por email/webhook
├─ Reportes de stock en PDF/CSV
└─ Deploy a producción

MES 3+ — Julio 2026 en adelante
├─ Agente de reabastecimiento predictivo
├─ Importación masiva desde CSV/Excel
├─ API mobile (React Native)
└─ Analytics con histórico de movimientos
```
