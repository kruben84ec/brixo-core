# CHANGELOG — Brixo Core

Historial de cambios ordenado por fecha descendente.

---

## 2026-04-21 — Sesión 6: Sprint 1 Frontend completado (Register + Login)

### feat(fase5-sprint1): Fundación del frontend + autenticación funcional — `HEAD`

#### Task 2 — Tokens de diseño e índigo como marca

- `theme/tokens.ts`: paleta light/dark con índigo `#4F46E5` (light) y `#818CF8` (dark) como marca dominante
- Semánticos: verde (entrada), rojo (salida/stock bajo), ámbar (ajuste/al límite) — mapean a movimientos de inventario
- `ThemeProvider.tsx`: detector `prefers-color-scheme`, persistencia localStorage, inyección de CSS variables
- `hooks/useTheme.ts`: hook para toggle de tema desde cualquier componente

#### Task 3 — Componentes primitivos reutilizables

- `Button.tsx`: 4 variantes (primary, secondary, ghost, danger) × 3 tamaños (sm, md, lg)
- `Input.tsx`: label + input + error + helper text, con states (focused, error, disabled)
- CSS modules con dark mode — todos los colores desde variables CSS

#### Task 4 — Logo e identidad visual

- `BrixoLogo.tsx`: SVG dinámico con solid + line variants, responsive sizes
- `public/favicon.svg`: logo índigo 32×32

#### Task 5 — Cliente HTTP tipado

- `services/api.ts`: axios instance con `baseURL`, timeout, interceptor de request (agregar token)
- Interceptor de response: maneja 401 (expira sesión), redirige a /login
- Métodos: `register()`, `login()`, `refresh()`, `getMe()`, `health()`
- Tipos exportados: `AuthResponse`, `LoginRequest`, `RegisterRequest`, `User`, `Product`, `ErrorResponse`

#### Task 6 — Store de autenticación global

- `stores/authStore.ts`: Zustand con persistencia localStorage
- Estados: `token`, `user`, `isAuthenticated`, `isLoading`
- Acciones: `setAuth()`, `logout()`, `setLoading()`, `hydrate()`
- Lazy-loads desde localStorage al montar App

#### Task 7 — Routing con guards

- `App.tsx`: BrowserRouter + Routes + ThemeProvider
- `/login`, `/register`: `PublicOnlyRoute` (redirige a /dashboard si autenticado)
- `/dashboard`: `PrivateRoute` (redirige a /login si no autenticado)
- `/`: redirige a /dashboard (raíz maneja automáticamente sesión)

#### Task 8 — Pantalla de Registro

- `RegisterPage.tsx`: 4 campos (empresa, nombre, email, contraseña) en grid 2col (móvil: 1col)
- Callout índigo: "Serás el propietario de la empresa. Después podrás invitar a tu equipo."
- Toggle password: botón "Mostrar/Ocultar" inline
- Error 409 en línea: "Esta empresa ya existe" si tenant duplicado
- Botón CTA: "Crear empresa y empezar" en primary
- Link switch: "¿Ya tienes una cuenta? Inicia sesión"

#### Task 9 — Pantalla de Login

- `LoginPage.tsx`: email + contraseña
- Toggle password inline
- Error 401 en línea: "Email o contraseña inválidos"
- Botón CTA: "Iniciar sesión"
- Link switch: "¿No tienes cuenta? Registrate gratis"

#### Estilos globales

- `index.css`: variables CSS root (light/dark), tipografía base 16px (15px móvil), reset de box-sizing
- Dark mode automático: `[data-theme="dark"]` selector en todos los components
- Transiciones smooth: 200ms ease-out para cambios de tema
- Accesibilidad: `:focus-visible` en botones/inputs, `.sr-only` para hidden text, `prefers-reduced-motion`

#### Build y validación

- Vite build: 0 errores TypeScript strict, 3 chunks optimizados (vendor 178KB, http 38KB, state 0.6KB)
- npm run build: ~2.3 segundos, gzip total 75.6 KB

### refactor: Estructura frontend preparada para Sprint 2

- `main.tsx`: simplificado, ThemeProvider ya está en App.tsx
- `vite.config.ts`: alias @/, code-splitting confirmado, hot reload en dev
- Arquitectura lista para agregar componentes de layout (AppShell, Sidebar) sin conflictos

### docs: Actualización de status

- `ESTATUS.md`: Frontend 10% → 90%, MVP 85% → 93%
- `CHECKLIST.md`: todas las tareas Sprint 1 marcadas ✅
- `ROADMAP.md`: Sprint 1 completo, Sprint 2 en la mira (AppShell + Dashboard)
- `CHANGELOG.md`: esta entrada

### CDD (Criteria of Done) Sprint 1

- ✅ Un OWNER puede registrar una empresa desde el browser (POST /api/auth/register)
- ✅ Un OWNER puede iniciar sesión y recibir JWT válido (POST /api/auth/login)
- ✅ Token se persiste en localStorage y se restaura al recargar
- ✅ Redirigido automático: /login → /dashboard si autenticado
- ✅ Redirigido automático: /register → /dashboard si autenticado
- ✅ Dark mode y light mode sin bugs visuales, respeta prefers-color-scheme
- ✅ Mobile-first responsive: Login y Register en móvil y desktop
- ✅ TypeScript strict: 0 errores de compilación
- ✅ Build optimizado: Vite genera 3 chunks, total 75.6 KB gzip

---

## 2026-04-18 — Sesión 3: Deuda técnica resuelta + Observabilidad

### refactor: Resolución completa de deuda técnica — `HEAD`

#### TD1 — Typo corregido

- `domain/events/base.py`: `ocurred_at` → `occurred_at` en clase base `DomainEvent`

#### TD2 — Directorio renombrado

- `application/services/acccess/` → `application/services/access/`
- Actualizado import en `main.py` y `infrastructure/projections/user_access_projection.py`

#### TD3 — Archivo vacío eliminado

- Eliminado `application/services/asssign_role.py` (0 líneas, sin importadores)

#### TD4 — Archivo huérfano eliminado

- Eliminado `application/auth/aut_service.py` (sin importadores; lógica real en `jwt_service.py`)

#### TD5 — Módulo duplicado eliminado

- Eliminado `domain/events.py` (archivo plano duplicado del paquete `domain/events/`)
- Corregido import en `infrastructure/user_access_projection.py`: `from domain.events` → `from domain.events.base`

#### TD6 — Credenciales verificadas

- Confirmado que `infra/env/*.env` está en `.gitignore` y no se versiona

---

### feat(fase4c): Capa de observabilidad completa — `33f294d`

- `infrastructure/logging.py`: `RotatingFileHandler` a `/app/logs/app.log` (10 MB × 5), respeta `LOGGING_LEVEL` desde env
- `domain/exceptions.py`: jerarquía `BrixoException` → `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`, `DomainValidationError`, `InternalError`
- `infrastructure/api/middleware/http_logging.py`: `HTTPLoggingMiddleware` — registra `method`, `path`, `status_code`, `duration_ms`, `user_id`, `tenant_id` por request
- `infrastructure/api/exception_handlers.py`: 4 handlers globales que separan mensaje al frontend de detalle técnico al log
- `main.py`: middlewares en orden `CORS → HTTPLogging → JWT` + exception handlers registrados
- `docs/OBSERVABILIDAD.md`: reporte completo de la capa
- MVP: 77% → 80%

---

## 2026-04-18 — Sesión 2: Documentación y ROADMAP

### docs: Alinear documentación al estado real del proyecto — `7d3566d`

- ESTATUS.md, ROADMAP.md, CHECKLIST.md actualizados al estado verificado
- Progreso ajustado al 77% con deuda técnica documentada

---

## 2026-04-18 — Sesión 1: Backend 100% completado (Fases 1–4B)

### feat(fase4b): CORS, RBAC activo y refresh token — `d47362d`

- `CORSMiddleware` habilitado para `localhost:3000`
- `require_permission(code)` — FastAPI dependency que lee snapshot Redis
- RBAC aplicado en todos los endpoints protegidos
- `POST /api/auth/refresh` — renueva token sin re-login
- `POST /api/users/{id}/roles` — expone `AssignRoleToUserUseCase`

### feat: Infraestructura y controladores completos — `457ab54`

- Bind mounts con hot reload (backend + frontend)
- `ProductController`, `InventoryController`, `UserController`, `AuditController`, `AccessController`
- `PUBLIC_PATHS` en `JWTAuthMiddleware`
- Audit trail en `handlers.py` — persiste `LogEntry` en BD en cada login

### feat: Fase 3 — todos los use cases del MVP — `d37d8a1`

- `CreateProductUseCase`, `RegisterInventoryMovementUseCase`, `GetProductStockUseCase`
- `CreateUserUseCase`, `AssignRoleToUserUseCase`, `GetAuditLogByTenantUseCase`

### feat: Fase 2 — Data Access Layer completo — `a9c2ba1`

- 8 repositorios: puerto ABC + adaptador SQL con psycopg2
- Script SQL — 8 tablas con UUID, tenant_id, índices y seed

---

## 2026-02-22 — Roles y permisos

### feat: Modelo de roles y permisos — `c915f86`

- Entidades `Role`, `Permission`, `UserRole` en el dominio
- Seed: roles OWNER / OPERATOR, permisos INVENTORY_READ/WRITE, USERS_READ/WRITE, etc.

### refactor: Arquitectura hexagonal — `82c0511`

- Separación de `application/services/` y `application/use_cases/`

---

## 2026-02-17 — Redis y JWT

### feat: Redis + snapshot de acceso — `8951c9f`

- Redis en `docker-compose.yml`
- `UserAccessProjection` — escucha `UserAuthenticated`, guarda snapshot en Redis
- Clave: `user_access:{tenant_id}:{user_id}`

### fix: JWT con claves PEM — `9a4a602`

- `JWTService` RS256 con par de claves PEM desde `infra/env/jwt.env`
- Flujo login → JWT → snapshot Redis funcional end-to-end

---

## 2026-02-01 — API corriendo

### feat: API FastAPI en Docker — `e924561`

- `main.py` con FastAPI, middleware y lifespan básico
- Backend accesible en `http://localhost:8000`

---

## 2026-01-24 — Capas base

### feat: JWT RS256 — `5f56e1c`

- `JWTService` con generación y decodificación RS256
- `JWTAuthMiddleware` — valida token en cada request

### feat: EventBus + handlers — `e2a3ae2`

- `EventBus` pub/sub con manejo de errores
- Handlers: `UserLoggedIn`, `UserLoginFailed`, `UserAuthenticated`

### feat: `settings.py` con Pydantic BaseSettings — `ccd2ca6`

- Configuración centralizada: JWT, Redis, Logging, PostgreSQL

---

## 2026-01-13 — Auth y datos

### feat: Auth básica + conexión PostgreSQL — `d82266a` / `feddb32`

- Primer flujo de autenticación email + password → token
- Pool de conexiones psycopg2, tabla `products` inicial

---

## 2026-01-11 — Fundamentos

### feat: EventBus + logging de negocio — `3362067` / `774f0b4`

- `LogEntry`, `Actor`, `LogEventType` en `domain/logs.py`
- Logger JSON estructurado en `infrastructure/logging.py`
- Definición de `domain/events/` — `InventoryChanged`, `RoleAssigned`, `UserLoggedIn`
- Contratos base: `Tenant`, `User`, `Role`, `Permission`

### feat: Docker Compose inicial — `a43ca02`

- PostgreSQL 15 en contenedor, configuración de red y volúmenes

---

## 2026-01-04 — Inicio del proyecto

### chore: Estructura inicial — `0470afa`

- Commit inicial, estructura de carpetas
- `README.md` con descripción del proyecto
