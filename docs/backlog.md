# Backlog — Brixo Core

**Última actualización**: 2026-04-29
**Estado MVP**: 100% ✅ — 9 gaps de deuda técnica pendientes antes de producción

---

## Deuda técnica (post-audit 28 abr)

### Alta prioridad

- [ ] **Alta** — LoginPage/RegisterPage: llamar `GET /api/users/me` post-login, guardar `user_id` + `tenant_id` reales — `LoginPage.tsx:L45`, `RegisterPage.tsx:L52` — 20 min
- [ ] **Alta** — App.tsx: fijar bug rutas privadas (hidratación async, aplicar loading state correcto) — `App.tsx:L30` — 25 min
- [ ] **Alta** — Backend: registrar handler para evento `UserCreated` (signup no se audita) — `application/handlers.py` — 15 min

### Media prioridad

- [ ] **Media** — DashboardPage: conectar movimientos reales (`GET /api/products/{id}/movements`) — `DashboardPage.tsx:L50-70` — 30 min
- [ ] **Media** — Backend: sincronizar TTL JWT (decidir entre 480 min o 15 min, documentar) — `infrastructure/settings.py` + `infra/env/jwt.env` — 10 min

### Baja prioridad

- [ ] **Baja** — MovementModal: pasar `isMobile` correcto desde DashboardPage, activar BottomSheet en móvil — `MovementModal.tsx:L15` — 15 min
- [ ] **Baja** — Backend: crear endpoints para `create_role()` + `revoke_role_from_user()` — `adapters/repositories/role_repository_sql.py` — 30 min
- [ ] **Baja** — Backend: mover `/me/access` → `/api/me/access` (consistencia de prefijos) — `infrastructure/routes/` — 5 min
- [ ] **Baja** — Crear páginas reales `/movements`, `/team`, `/audit` (pueden esperar post-MVP) — `App.tsx:L60-70` — 120 min

---

## Fase 6: QA + Hardening

- [ ] **Alta** — Testing manual flujo completo (register → login → inventario → movimiento)
- [ ] **Alta** — Fix de bugs encontrados en testing manual
- [ ] **Media** — Rate limiting `POST /api/auth/login` (5 req/60s por IP)
- [ ] **Media** — Validar TTL Redis snapshot + expiración de token en flujo real
- [ ] **Media** — Cabeceras de seguridad HTTP (`X-Frame-Options`, `X-Content-Type-Options`, etc.)
- [ ] **Baja** — `request_id` en `HTTPLoggingMiddleware` para correlación de logs
- [ ] **Baja** — `docker-compose.prod.yml` (configuración de producción separada)

---

## Post-MVP (después de validar con usuarios reales)

- [ ] **Post-MVP** — LandingPage.tsx — página promocional pública
- [ ] **Post-MVP** — AuditPage.tsx — historial paginado de movimientos
- [ ] **Post-MVP** — TeamPage.tsx — gestión de usuarios y roles
- [ ] **Post-MVP** — `useAccess.ts` — vistas diferenciadas por rol (OWNER vs OPERATOR)
- [ ] **Post-MVP** — Accesibilidad WCAG 2.1 AA (4.5:1 contraste, navegación teclado)
- [ ] **Post-MVP** — ErrorBoundary global + build optimizado + Lighthouse ≥ 85

---

## Ideas (no comprometidas)

- [ ] **Idea** — Lector de barcode en móvil para registro rápido de movimientos
- [ ] **Idea** — Export CSV/Excel del inventario
- [ ] **Idea** — Multi-idioma (ES/EN)

---

## Completadas recientes

- [x] UI Polish (28 abr) — CSS Modules bug Button/Input, Icon.tsx SVG inline, BrixoLogo rediseñado, CSS vars kebab-case en 5 archivos
- [x] Sprint 3 (27 abr) — InventoryPage + MovementModal + ProductModal con API real, criterio MVP alcanzado
- [x] Sprint 2 — DashboardPage + AppShell + MetricCard + AlertCard + Badge + Toast
- [x] Sprint 1 — RegisterPage + LoginPage + authStore + interceptor JWT + refresh automático
- [x] Backend completo (Fases 1-4D) — 8 repositorios, 8 casos de uso, todos los endpoints, RBAC, observabilidad
