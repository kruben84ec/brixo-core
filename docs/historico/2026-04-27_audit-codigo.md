# Auditoría de Código — 27 de abril de 2026

**Objetivo**: Verificar estado REAL del código versus lo que dicen ROADMAP.md y ESTATUS.md  
**Fecha**: 27 abril 2026  
**Auditor**: Claude Code  
**Rama**: dev (commit 5f9e1d0)

---

## Hallazgos Críticos

### 1. Backend — ESTADO CORRECTO ✅ (100%)

Todos los componentes backend están **funcionales y cumplen estándares**:

| Capa | Hallazgo | Detalle |
|------|----------|---------|
| **Infraestructura** | ✅ Completo | Docker Compose, PostgreSQL, Redis activos |
| **Repositorios (8/8)** | ✅ Completo | `ProductRepositorySQL`, `InventoryMovementRepositorySQL`, `AuthRepositorySQL`, `TenantRepositorySQL`, `UserRepositorySQL`, `RoleRepositorySQL`, `AccessRepositorySQL`, `AuditLogRepositorySQL` — todos con puerto ABC + implementación SQL |
| **Casos de Uso (8/8)** | ✅ Completo | `SignUpUseCase`, `LoginUser`, `CreateProductUseCase`, `RegisterInventoryMovementUseCase`, `GetProductStockUseCase`, `CreateUserUseCase`, `AssignRoleToUserUseCase`, `GetAuditLogByTenantUseCase` |
| **Rutas HTTP** | ✅ Completo | `/api/auth` (login, register, refresh), `/api/products`, `/api/users`, `/api/audit`, `/api/access`, `/health` — todos incluidos en `main.py` |
| **Seguridad** | ✅ Completo | JWT RS256, RBAC, `require_permission()`, CORS, middlewares en orden correcto |
| **Event Bus** | ✅ Completo | EventBus implementado, handlers registrados, UserAccessProjection activa |

**Veredicto**: Backend está listo para producción.

---

### 2. Frontend — ESTADO PARCIAL ⚠️ (20%, NO 72%)

#### A. Páginas Implementadas (2/18)

| # | Tarea | Archivo | Llama API | Datos | Estado |
|---|-------|---------|----------|-------|--------|
| 8 | RegisterPage | `src/pages/RegisterPage.tsx` | ✅ SI | Real | ✅ Funcional |
| 9 | LoginPage | `src/pages/LoginPage.tsx` | ✅ SI | Real | ✅ Funcional |

**Hallazgo**: Register y Login son páginas **reales** que llaman `POST /api/auth/*` contra el backend.

#### B. Dashboard — UI Sin Lógica ⚠️

| Aspecto | Estado | Detalle |
|--------|--------|---------|
| **Archivo** | ✅ Existe | `src/pages/DashboardPage.tsx` (7,079 bytes) |
| **UI Renderiza** | ✅ Sí | AppShell, KPIs, Alertas, Movimientos recientes |
| **Llama API Real** | ❌ NO | Dashboard **usa `setTimeout()`** para simular carga (línea 56-111) |
| **Datos** | ❌ Mock | Hardcodeado: `totalProducts: 24`, `lowStockCount: 3`, movimientos ficticios |
| **API Call** | ❌ NO | No hay `api.get("/products")` ni `api.get("/inventory")` |

**Código encontrado (línea 56-111)**:
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    setKpi({ totalProducts: 24, lowStockCount: 3, ... });
    setMovements([...]);
    setAlerts([...]);
    setLoading(false);
  }, 800);  // ← simula carga
  return () => clearTimeout(timer);
}, []);
```

**Hallazgo crítico**: Dashboard dice "datos simulados" en ESTATUS, pero **no llama API real**. Debería hacer:
```javascript
api.get("/api/products/")  // para lista de productos
api.get("/api/products/?low_stock=true")  // para alertas
```

#### C. Páginas Sprint 3 — NO EXISTEN ❌

| Ruta | Archivo | Existe | Detalles |
|------|---------|--------|----------|
| `/inventory` | `src/pages/InventoryPage.tsx` | ❌ NO | Placeholder inline en `App.tsx:17-19` |
| `/movements` | `src/pages/MovementsPage.tsx` | ❌ NO | Placeholder inline en `App.tsx:21-23` |
| `/team` | `src/pages/TeamPage.tsx` | ❌ NO | Placeholder inline en `App.tsx:25-27` |
| `/audit` | `src/pages/AuditPage.tsx` | ❌ NO | Placeholder inline en `App.tsx:29-31` |

**Código en App.tsx**:
```jsx
function InventoryPage() {
  return <div style={{ padding: "2rem" }}>📦 Inventario - próximamente</div>;
}
```

**Hallazgo**: Páginas existen como stubs de una línea inline, no como componentes reales.

#### D. Componentes Sprint 3 — NO EXISTEN ❌

| Componente | Archivo | Existe | Necesario para |
|------------|---------|--------|------------------|
| Modal | `src/components/feedback/Modal.tsx` | ❌ NO | Sprint 3 · Tarea 14 |
| BottomSheet | `src/components/feedback/BottomSheet.tsx` | ❌ NO | Sprint 3 · Tarea 14 |
| EmptyState | `src/components/feedback/EmptyState.tsx` | ❌ NO | Sprint 3 · Tarea 15 |
| InventoryPage | `src/pages/InventoryPage.tsx` | ❌ NO | Sprint 3 · Tarea 16 |
| MovementModal | `src/components/MovementModal.tsx` | ❌ NO | Sprint 3 · Tarea 17 |
| ProductModal | `src/components/ProductModal.tsx` | ❌ NO | Sprint 3 · Tarea 18 |

**Hallazgo**: Sprint 3 **no se ha iniciado**.

#### E. Componentes Sprint 1-2 — COMPLETOS ✅

| Componente | Estado | Notas |
|------------|--------|-------|
| `Button.tsx` | ✅ | Variantes: primary, secondary, ghost, danger |
| `Input.tsx` | ✅ | Con label, error, helper text |
| `BrixoLogo.tsx` | ✅ | SVG solid + line |
| `ThemeProvider.tsx` | ✅ | Dark/Light, localStorage, `prefers-color-scheme` |
| `useTheme.ts` hook | ✅ | Acceso global al tema |
| `Card.tsx` | ✅ | Genérica con shadow hover |
| `MetricCard.tsx` | ✅ | Para KPIs (color, trend, icon) |
| `Badge.tsx` | ✅ | 4 variantes de estado |
| `AlertCard.tsx` | ✅ | success, danger, warning, info |
| `Toast.tsx` + Provider | ✅ | Sistema global de notificaciones |
| `Skeleton.tsx` | ✅ | Con shimmer animation |
| `AppShell.tsx` | ✅ | Sidebar (240px) + bottom-nav responsivo |
| `Sidebar.tsx` | ✅ | Con avatar, logout |
| `PrivateRoute.tsx` | ✅ | Guard de rutas autenticadas |
| `PublicOnlyRoute.tsx` | ✅ | Guard inverso (solo públicas) |
| `authStore.ts` (Zustand) | ✅ | Token, user, logout, localStorage |
| `api.ts` | ✅ | Axios + JWT interceptor + refresh |

**Hallazgo**: Infraestructura frontend está lista. Falta lógica de negocio.

---

## Comparación: Documentos vs Realidad

### ROADMAP.md — Afirmaciones Incorrectas

| Línea | Afirmación | Realidad | Severidad |
|------|-----------|----------|-----------|
| L4 | "Frontend Sprint 1-2 ✅" | Parcial: 2 páginas reales + 1 UI sin lógica | 🟡 Crítica |
| L5 | "Criterio MVP: ver su inventario + registrar movimiento" | Dashboard no llama API real | 🔴 Crítica |
| L22 | "TOTAL MVP 78%" | Debe ser ~65% | 🟡 Crítica |
| L39 | "InventoryPage (privada · próximamente)" | Existe como placeholder inline, no como archivo | 🟡 Media |
| L40 | "MovementsPage (privada · próximamente)" | Existe como placeholder inline, no como archivo | 🟡 Media |

### ESTATUS.md — Afirmaciones Incorrectas

| Línea | Afirmación | Realidad | Severidad |
|------|-----------|----------|-----------|
| L4 | "Frontend Sprint 1-2 ✅" | Parcial: 2 páginas reales + 1 UI sin lógica | 🟡 Crítica |
| L5 | "TOTAL MVP 78%" | Debe ser ~65% | 🟡 Crítica |
| L63 | "DashboardPage usa datos simulados" | ✅ Correcto, pero **no llama API real** | ✅ Correcto |

---

## Estado Real por Porcentaje

### Backend: 100% ✅

```
Infraestructura        100%  ✅
Repositorios (8/8)     100%  ✅
Casos de Uso (8/8)     100%  ✅
Rutas HTTP             100%  ✅
Seguridad              100%  ✅
────────────────────────────
Backend Total          100%  ✅
```

### Frontend: 20% (NO 72%)

```
Sprint 1 — Auth        100%  ✅ (Register + Login llaman API real)
           UI Setup      100%  ✅ (tokens, theme, componentes)
Sprint 2 — Dashboard    50%  ⚠️  (UI lista, datos mock)
           Components   100%  ✅ (Card, Badge, Toast, etc.)
Sprint 3 — Modal         0%  ❌ (No existe)
           InventoryPage 0%  ❌ (No existe)
           MovementModal  0%  ❌ (No existe)
           ProductModal   0%  ❌ (No existe)
────────────────────────────
Frontend Total          20%  (2/18 tareas reales)
```

### MVP Total: 65% (NO 78%)

```
Backend         100%  × 50% = 50%
Frontend         20%  × 50% = 10%
────────────────────────────
MVP Total               65%
```

---

## Recomendaciones

### Inmediato (48h)

1. ✅ **Actualizar ROADMAP.md**: Cambiar "72%" → "20%" para frontend
2. ✅ **Actualizar ESTATUS.md**: Cambiar "78%" → "65%" para MVP
3. 🚨 **Aclarar DashboardPage**: Decidir si debe:
   - **Opción A**: Llamar API real (`GET /api/products/`) — Sprint 3.1
   - **Opción B**: Mantener mock hasta completar inventario — Sprint 3

### Sprint 3 (próximas sesiones)

```
14 → Modal.tsx + BottomSheet.tsx (25 min)
15 → EmptyState.tsx              (10 min)
16 → InventoryPage.tsx           (50 min)  ← conectar a GET /api/products/
17 → MovementModal.tsx           (50 min)  ← conectar a POST /api/products/{id}/movements
18 → ProductModal.tsx            (35 min)  ← conectar a POST /api/products/
```

---

## Archivos Auditados

**Backend (57 archivos Python)**:
- `backend/main.py` — Rutas registradas: auth, products, users, audit, access, health
- `backend/application/use_cases/*` — 8 casos de uso implementados
- `backend/adapters/repositories/*` — 8 repositorios SQL implementados
- `backend/infrastructure/api/routes/*` — 5 routers activos

**Frontend (20 archivos TSX/TS)**:
- `frontend/src/pages/` — 3 archivos (LoginPage, RegisterPage, DashboardPage)
- `frontend/src/components/` — 14 componentes funcionales
- `frontend/src/App.tsx` — 4 placeholders inline (Inventory, Movements, Team, Audit)
- `frontend/src/stores/authStore.ts` — Zustand con persistencia
- `frontend/src/services/api.ts` — Axios con JWT interceptor

---

## Conclusión

**Backend**: 100% funcional, código de calidad, arquitectura hexagonal respetada.  
**Frontend**: 20% funcional. Sprint 1-2 entregaron UI + 2 páginas reales. Dashboard es UI sin lógica.  
**MVP Criterio**: No cumplido — requiere que dashboard llame API real + inventario + movimientos.

**Próximo paso**: Iniciar Sprint 3 o aclarar criterio MVP.

