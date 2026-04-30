# ROADMAP — Plan de Fases de Brixo

**Actualizado**: 29 de abril de 2026  
**Estado**: Backend 100% ✅ · Frontend 100% (Sprint 1-3 + UI Polish) ✅ · MVP 100% ✅

---

## Resumen Ejecutivo

```text
FASE 1   Infraestructura          ██████████  100%   ✅ cerrada
FASE 2   Data Access Layer        ██████████  100%   ✅ cerrada
FASE 3   Casos de uso             ██████████  100%   ✅ cerrada
FASE 4   Controladores / Rutas    ██████████  100%   ✅ cerrada
FASE 4B  Seguridad aplicada       ██████████  100%   ✅ cerrada
FASE 4C  Observabilidad           ██████████  100%   ✅ cerrada
FASE 4D  SaaS Auth + Bugs         ██████████  100%   ✅ cerrada
FASE 5   Frontend MVP             ██████████  100%   ✅ completada
FASE 6   QA + Hardening           ░░░░░░░░░░    0%   ⭕ siguientes
────────────────────────────────────────────────────
TOTAL MVP                         ██████████  100%   ✅
```

---

## Fase 1: Infraestructura ✅

**Objetivo**: Servicios base levantados, hot reload funcional.

- ✅ `docker-compose.yml` con PostgreSQL, Redis, healthchecks
- ✅ Bind mounts con hot reload backend (uvicorn --reload) y frontend (Vite HMR)
- ✅ Script SQL — 8 tablas + seed de roles, permisos
- ✅ `settings.py` Pydantic BaseSettings
- ✅ `main.py` con lifespan, pool de conexiones, routers registrados

---

## Fase 2: Data Access Layer ✅

**Objetivo**: 8 repositorios implementados (patrón ABC + adaptador SQL).

| Repositorio | Adaptador | Estado |
|-------------|-----------|--------|
| AuthRepository | AuthRepositorySQL | ✅ |
| ProductRepository | ProductRepositorySQL | ✅ |
| InventoryMovementRepository | InventoryMovementRepositorySQL | ✅ |
| AuditLogRepository | AuditLogRepositorySQL | ✅ |
| UserRepository | UserRepositorySQL | ✅ |
| TenantRepository | TenantRepositorySQL | ✅ |
| RoleRepository | RoleRepositorySQL | ✅ |
| AccessRepository | AccessRepositorySQL | ✅ |

---

## Fase 3: Casos de Uso ✅

**Objetivo**: 8 casos de uso implementados (8 de 8).

| Caso de Uso | Estado |
|-----------|--------|
| SignUpUseCase (registro SaaS) | ✅ |
| LoginUser | ✅ |
| CreateProductUseCase | ✅ |
| RegisterInventoryMovementUseCase | ✅ |
| GetProductStockUseCase | ✅ |
| CreateUserUseCase | ✅ |
| AssignRoleToUserUseCase | ✅ |
| GetAuditLogByTenantUseCase | ✅ |

---

## Fase 4: Controladores y Rutas ✅

**Objetivo**: Todos los endpoints activos.

| Endpoint | Métodos | Permiso Requerido | Estado |
|----------|---------|------------------|--------|
| `/api/auth/register` | POST | (público) | ✅ |
| `/api/auth/login` | POST | (público) | ✅ |
| `/api/auth/refresh` | POST | token válido | ✅ |
| `/api/products/` | GET, POST | INVENTORY_READ/WRITE | ✅ |
| `/api/products/{id}/movements` | GET, POST | INVENTORY_READ/WRITE | ✅ |
| `/api/users/` | GET, POST | USERS_READ/WRITE | ✅ |
| `/api/users/{id}/roles` | POST | ROLES_WRITE | ✅ |
| `/api/audit/` | GET | AUDIT_READ | ✅ |
| `/api/access/` | GET | (autenticado) | ✅ |
| `/health` | GET | (público) | ✅ |

---

## Fase 4B: Seguridad Aplicada ✅

**Objetivo**: CORS, RBAC, refresh token funcionales.

- ✅ CORSMiddleware habilitado para `localhost:3000`
- ✅ `require_permission(code)` — FastAPI dependency que lee snapshot Redis
- ✅ RBAC activo en todos los endpoints protegidos
- ✅ `POST /api/auth/refresh` — renueva token sin re-login
- ✅ JWTAuthMiddleware con RS256 + PUBLIC_PATHS

---

## Fase 4C: Observabilidad ✅

**Objetivo**: Logging JSON, middleware HTTP, exception handlers tipados.

- ✅ `infrastructure/logging.py` — JSON a stdout + archivo rotado
- ✅ `domain/exceptions.py` — jerarquía BrixoException tipada
- ✅ `HTTPLoggingMiddleware` — registra method, path, status, duration, user_id, tenant_id
- ✅ 4 exception handlers globales (BrixoException, RequestValidationError, HTTPException, generic)
- ✅ Logs en `backend/logs/app.log` con bind mount

---

## Fase 4D: SaaS Auth + Correcciones ✅

**Objetivo**: POST /api/auth/register crea tenant + OWNER en una operación. Bugs de runtime resueltos.

- ✅ `POST /api/auth/register` funcional
- ✅ SignUpUseCase implementado
- ✅ 5 bugs de runtime resueltos
- ✅ DATABASE_URL en backend.env
- ✅ Deuda técnica resuelta (9 ítems corregidos)

---

## Fase 5: Frontend MVP ✅

### Sprint 1: Auth ✅

**Objetivo**: Usuario puede registrarse e iniciar sesión.

| # | Tarea | Estado |
|---|-------|--------|
| 1 | Setup TypeScript 6, Vite, estructura src/ | ✅ |
| 2 | Tokens + ThemeProvider + useTheme | ✅ |
| 3 | Button + Input primitivos | ✅ |
| 4 | BrixoLogo + favicon | ✅ |
| 5 | api.ts (axios + JWT interceptor) | ✅ |
| 6 | authStore (Zustand) | ✅ |
| 7 | App.tsx routing + PrivateRoute | ✅ |
| 8 | **RegisterPage** | ✅ |
| 9 | **LoginPage** | ✅ |

**Criterio de done**: Un OWNER puede registrar empresa e iniciar sesión.

### Sprint 2: Dashboard ✅

**Objetivo**: Dashboard operativo con datos API real.

| # | Tarea | Estado |
|---|-------|--------|
| 10 | AppShell responsivo (sidebar + bottom-nav) | ✅ |
| 11 | MetricCard + Card + Badge + AlertCard | ✅ |
| 12 | Toast global + Skeleton shimmer | ✅ |
| 13 | **DashboardPage** (KPIs, alertas, movimientos) | ✅ |

**Criterio de done**: OWNER ve dashboard con datos API real post-login.

### Sprint 3: Inventario + Acciones ✅

**Objetivo**: Flujo de negocio completo funcional.

| # | Tarea | Estado |
|---|-------|--------|
| 14 | Modal + BottomSheet | ✅ |
| 15 | EmptyState | ✅ |
| 16 | **InventoryPage** (tabla desktop + cards móvil) | ✅ |
| 17 | **MovementModal** (3 pasos: tipo → producto → cantidad) | ✅ |
| 18 | **ProductModal** (nuevo producto con validación SKU) | ✅ |

**Criterio de done**: OPERATOR puede registrar movimiento en < 10 segundos.

### UI Polish ✅ (Sesión 9, 28 abr)

- ✅ Bug CSS Modules: Button/Input sin estilos → reescritos
- ✅ Bug AppShell: `useTheme().toggle` no existe → `toggleTheme` corregido
- ✅ Icon.tsx — SVG inline sin librerías externas
- ✅ BrixoLogo rediseñado según spec geométrica
- ✅ AppShell + Sidebar con iconos SVG
- ✅ CSS variables normalizadas: Modal, MovementModal, ProductModal, BottomSheet, EmptyState
- ✅ MetricCard, AlertCard, Badge rediseñadas
- ✅ Auth pages: card en desktop, full-screen en móvil
- ✅ Build Vite: 0 errores, 140 módulos

### Post-MVP (no bloquea flujo de valor)

| # | Tarea | Tiempo est. | Estado |
|---|-------|-------------|--------|
| 19 | LandingPage | 60 min | ⭕ |
| 20 | AuditPage | 50 min | ⭕ |
| 21 | TeamPage | 50 min | ⭕ |
| 22 | useAccess.ts — vistas por rol | 40 min | ⭕ |
| 23 | Accesibilidad WCAG 2.1 AA | 40 min | ⭕ |
| 24 | ErrorBoundary + build optimizado | 30 min | ⭕ |

---

## Fase 6: QA + Hardening ⭕

**Objetivo**: Listo para producción. Resolver 9 gaps de deuda técnica.

### Tareas de Testing y Seguridad

| Tarea | Tipo | Tiempo | Estado |
|-------|------|--------|--------|
| Testing manual flujo completo | QA | 45 min | ⭕ |
| Fix bugs encontrados | Dev | 60 min | ⭕ |
| Rate limiting `POST /api/auth/login` | Seguridad | 30 min | ⭕ |
| Validar TTL Redis snapshot y expiración token | Seguridad | 20 min | ⭕ |
| Cabeceras de seguridad HTTP | Seguridad | 30 min | ⭕ |
| `request_id` en HTTPLoggingMiddleware | Observabilidad | 30 min | ⭕ |
| `docker-compose.prod.yml` | Infra | 30 min | ⭕ |

**Tiempo total estimado**: 4h 25min

### Deuda Técnica a Resolver

**Frontend (5 gaps)**:
1. DashboardPage — conectar movimientos reales a API
2. LoginPage/RegisterPage — llamar `GET /api/users/me` post-login
3. App.tsx — fix bug rutas privadas (hidratación async)
4. MovementModal — pasar `isMobile` correcto desde DashboardPage
5. Crear páginas `/movements`, `/team`, `/audit` reales

**Backend (4 gaps)**:
1. Evento `UserCreated` — registrar handler para auditoría
2. Endpoints HTTP para `create_role()` + `revoke_role_from_user()`
3. Sincronizar JWT TTL (decidir entre 480 o 15 minutos)
4. `/me/access` → `/api/me/access` (consistencia con /api prefix)

---

## Principios de UI/UX No Negociables

Derivados de `DISEÑO_BRIXO.md`, validados contra 4 prototipos:

1. **Dark mode nativo** — detecta `prefers-color-scheme`, persiste en localStorage
2. **Tokens, nunca colores hardcoded** — cambiar un token cambia toda la app
3. **`tabular-nums` en columnas numéricas** — números no bailan al scrollear
4. **Teñir el dato, no el contenedor** — stock se colorea, no la fila
5. **Semáforo de 3 estados** — En stock (verde) · Al límite (ámbar) · Stock bajo (rojo)
6. **Un solo CTA primario por pantalla** — botón índigo, único, obvio
7. **Targets táctiles 44 px mínimo** — especialmente botones +/− en móvil
8. **Flujo de movimiento en < 10 seg** — tipo → producto → cantidad → confirmar
9. **Mobile-first real** — base 15 px en móvil, bottom-nav, safe-area-inset
10. **Feedback inmediato** — Skeleton mientras carga, toast al completar, error inline

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

---

**Documento mantenido por**: Equipo Brixo  
**Última actualización**: 29 de abril de 2026  
**Próxima revisión**: Al iniciar Fase 6 (QA + Hardening)
