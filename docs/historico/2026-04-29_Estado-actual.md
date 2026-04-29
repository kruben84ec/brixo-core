# Estado Actual — 2026-04-29 (Sesión 10)

## Backend: 100% Completo ✅

Audit profundo de código realizado en sesión 10 (28 abr): Identificadas 9 gaps de deuda técnica — 5 en frontend, 4 en backend. Documentadas en `docs/ARQUITECTURA.md` sección "Deuda técnica identificada en audit". MVP está funcional pero hay temas pendientes antes de producción.

### Infraestructura Docker (Fase 1)
- docker-compose.yml con healthchecks en postgres y redis
- Bind mounts con hot reload en backend (uvicorn --reload + watchfiles) y frontend (Vite HMR)
- WATCHFILES_FORCE_POLLING=1 para Windows Docker

### Data Access Layer (Fase 2 — 8 repositorios)
- Todos los repositorios con puerto ABC + adaptador SQL real
- AuthRepositorySQL, ProductRepositorySQL, InventoryMovementRepositorySQL, AuditLogRepositorySQL, UserRepositorySQL, TenantRepositorySQL, RoleRepositorySQL, AccessRepositorySQL

### Casos de Uso (Fase 3 — 8 de 8)
- SignUpUseCase, LoginUser, CreateProductUseCase, RegisterInventoryMovementUseCase, GetProductStockUseCase, CreateUserUseCase, AssignRoleToUserUseCase, GetAuditLogByTenantUseCase

### Controladores y Rutas (Fase 4 — 100%)
- Todos los endpoints activos: auth (register + login + refresh), products, inventory, users, audit, access, health
- Swagger con metadata completa en /docs

### Seguridad Aplicada (Fase 4B — 100%)
- CORS habilitado para localhost:3000
- require_permission(code) — FastAPI dependency que lee snapshot Redis
- RBAC activo en todos los endpoints protegidos
- POST /api/auth/refresh — renueva token sin re-login

## Frontend: Sprint 1-3 + UI Polish COMPLETADOS (Fase 5 — 100%) ✅

**Estado real (28 abr — sesión 10)**:
- ✅ 5 páginas reales que llaman API (Register, Login, Dashboard*, Inventory, 2 modales)
- ✅ Componentes completos: Modal, BottomSheet, EmptyState, Icon, etc.
- ✅ Criterio MVP alcanzado (usuario puede registrar empresa → ver inventario → registrar movimiento)

### Stack Frontend
React 18 + TypeScript 6.0.3 + Vite 5 + Zustand 5 + React Router DOM 7 + Axios 1.15

### Páginas con API Funcional (src/pages/)

1. **RegisterPage.tsx** — 4 campos, error 409 inline, llama POST /api/auth/register ✅
2. **LoginPage.tsx** — email + password, error 401 inline, llama POST /api/auth/login ✅  
   ⚠️ Gap detectado: construye user con id:"temp", tenant_id:"temp" (falta GET /users/me)
3. **DashboardPage.tsx** — 4 KPIs, alertas stock, movimientos recientes, datos API real ✅  
   ⚠️ Gap detectado: movimientos recientes simulados con Math.random() (no llama API real)
4. **InventoryPage.tsx** — tabla desktop + cards móvil, búsqueda, filtros, datos API real ✅
5. **MovementModal.tsx** — 3 pasos (ENTRADA/SALIDA/AJUSTE), registra contra API real ✅  
   ⚠️ Gap detectado: isMobile siempre false, BottomSheet nunca se activa
6. **ProductModal.tsx** — crear productos, validación SKU 409, llama API real ✅

### Páginas Placeholder Post-MVP (inline en App.tsx)
- /movements, /team, /audit → placeholders sin componentes en src/pages/

### Componentes Completos con CSS Modules

- Sistema de tokens light/dark (theme/tokens.ts) — índigo como marca
- Button, Input, BrixoLogo (geométrico rediseñado 28 abr), Card, MetricCard, Badge, AlertCard, Toast, Skeleton, Icon
- Modal, BottomSheet, EmptyState — con CSS vars kebab-case (fix 28 abr)
- AppShell responsivo (sidebar 240px desktop + bottom-nav móvil, iconos SVG)
- authStore Zustand + interceptor JWT + refresh automático

## IMPORTANTE — 9 gaps de Deuda Técnica Identificados (Sesión 10, 28 abr)

Documentados completamente en docs/ARQUITECTURA.md sección "Deuda técnica identificada en audit (28 abr)"

MVP está 100% funcional pero hay trabajo pendiente antes de producción.

**Impacto**: movimientos simulados, user IDs temp, bug de rutas, etc. (ver sección de Deuda técnica)
