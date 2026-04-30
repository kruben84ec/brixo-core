# Backlog — Brixo Core

**Última actualización**: 2026-04-30
**Estado MVP**: 100% ✅ — Fase 6 activa: suites de tests con 18 fallos pendientes

---

## Deuda técnica (post-audit 28 abr)

### Alta prioridad

- [x] **Alta** — LoginPage/RegisterPage: llamar `GET /api/users/me` post-login, guardar `user_id` + `tenant_id` reales — resuelto 2026-04-30
- [x] **Alta** — App.tsx: fijar bug rutas privadas (hidratación async, `isHydrated` flag) — resuelto 2026-04-30
- [x] **Alta** — Backend: registrar handler para evento `UserCreated` — resuelto 2026-04-30

### Fallos de tests (sesión 13 — QA rechazado, 2026-04-30)

**Backend — 14 fallos**
- [ ] **Bloqueante** — `Mock().__name__` inexistente (11 tests en `test_event_bus.py` + `test_login_user.py`) — agregar `handler.__name__ = "mock_handler"` a mocks o usar `MagicMock(spec=...)` — `backend/tests/`
- [ ] **Alta** — `test_system_user_id_is_valid_uuid`: `uuid.version == 0` incorrecto en Python (devuelve `None`). Cambiar aserción a `assert uuid_obj.version is None` — `backend/tests/test_domain/test_logs.py:229`
- [ ] **Alta** — `test_hash_long_password`: bcrypt rechaza passwords >72 bytes. Decidir si `hash_password()` debe truncar o si la validación va en use case — `backend/tests/test_infrastructure/test_passwords.py`
- [ ] **Media** — `test_register_handlers_count`: verificar que el conteo esperado sea 3 (UserLoggedIn + UserLoginFailed + UserCreated) — `backend/tests/test_application/test_handlers.py`

**Frontend — 4 fallos**
- [ ] **Bloqueante** — `PrivateRoute.test.tsx`: usa `require()` en módulo ESM — reemplazar con import estático ESM — `frontend/src/components/layout/PrivateRoute.test.tsx:13`
- [ ] **Alta** — `api.test.ts`: usa `require()` en ESM + tests de TypeScript types sin valor runtime — refactorizar con imports ESM y remover assertions de tipos inexistentes en runtime — `frontend/src/services/api.test.ts`
- [ ] **Alta** — `Card.test.tsx > handles click events`: query `.parentElement` sube demasiado — cambiar a query directa `screen.getByText('...')` o `container.querySelector('div')` — `frontend/src/components/feedback/Card.test.tsx:35`
- [ ] **Alta** — `Input.test.tsx > renders with different input types`: `input[type="password"]` no tiene role "textbox" — usar `document.querySelector('input[type="password"]')` — `frontend/src/components/primitives/Input.test.tsx:94`

**Deuda técnica nueva (identificada en sesión 12 — 2026-04-30)**

- [ ] **Media** — `UserCreated` evento no incluye `created_by_user_id` — cuando un admin crea usuarios via `CreateUserUseCase`, el handler de auditoría registra al usuario creado como actor en lugar de quien lo creó. Requiere extender el dominio: agregar `created_by_user_id: str | None` a `UserCreated` y actualizar el use case — `domain/events/user.py`, `application/use_cases/create_user.py`, `application/handlers.py`

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
