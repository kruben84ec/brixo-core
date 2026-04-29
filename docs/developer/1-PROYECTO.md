# Brixo — Proyecto de Control de Inventario

**Versión**: MVP 1.0  
**Fecha**: 29 de abril de 2026  
**Estado**: 100% funcional (Backend 100% ✅, Frontend 100% ✅, 9 gaps de deuda técnica documentados)  
**Branch activo**: `dev`

---

## ¿Qué es Brixo?

Un **sistema simple de control de inventario** para pequeños negocios y pymes.

### Qué es

- ✅ Control de stock: entradas, salidas, ajustes manuales, historial
- ✅ RBAC: roles (OWNER, MANAGER, OPERATOR) con permisos granulares
- ✅ Multi-tenant: cada empresa (tenant) aislada en datos
- ✅ Auditoría: historial de todas las acciones por usuario

### Qué NO es

- ❌ No es ERP (no gestiona compras, facturación, nómina)
- ❌ No es contable (no genera asientos contables)
- ❌ No es POS (no es caja ni carrito de compras)
- ❌ No es CRM (no gestiona clientes, contactos, leads)

### Criterio de MVP

**Un OWNER puede:**
1. ✅ Registrar su empresa desde el browser
2. ✅ Iniciar sesión y recibir JWT
3. ✅ Ver dashboard con KPIs reales
4. ✅ Ver inventario con semáforo de stock (verde/ámbar/rojo)
5. ✅ Registrar un movimiento (entrada/salida/ajuste) en < 10 segundos
6. ✅ Agregar un nuevo producto
7. ✅ Cambiar tema (claro/oscuro)

**Todo sin asistencia ni documentación.**

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Backend** | Python 3.12, FastAPI 0.128+, Pydantic v2, psycopg2, PyJWT (RS256) |
| **Frontend** | React 18, Vite 5, TypeScript 6, Zustand 5, Axios 1.15 |
| **Infraestructura** | Docker Compose, PostgreSQL 15, Redis 7-alpine |
| **Autenticación** | JWT RS256, RBAC por snapshots Redis |
| **OS Desarrollo** | Windows (PowerShell o Git Bash) |

---

## Estructura del Repositorio

```text
brixo-core/
├── backend/
│   ├── domain/                # Entidades, eventos, contratos — SIN dependencias externas
│   ├── application/           # Casos de uso, event bus, handlers
│   ├── infrastructure/        # BD, Redis, JWT, logging, settings, rutas HTTP
│   ├── adapters/              # Repositorios SQL
│   └── main.py                # Punto de entrada FastAPI
├── frontend/
│   └── src/                   # React SPA — Sprint 1-3 completados + UI Polish
├── infra/
│   ├── docker-compose.yml
│   ├── docker/postgres/init.sql
│   └── env/                   # Variables de entorno por servicio (no versionadas)
└── docs/
    ├── developer/             # Documentación para ingenieros (este folder)
    ├── historico/             # Snapshots de estado por fecha
    └── [otros]                # Documentación del proyecto
```

---

## Reglas No Negociables

Estas reglas vienen del producto y de la experiencia de desarrollo. No se relajan por conveniencia técnica.

### 1. **El dominio nunca importa infraestructura**

```python
# ❌ MAL
from infrastructure.database import db_session

# ✅ BIEN
class ProductRepository(ABC):
    @abstractmethod
    def get_by_id(self, product_id: UUID) -> Product: ...
```

**Por qué**: Permite cambiar BD, framework o agente de IA sin tocar lógica de negocio.

### 2. **Nombres descriptivos**

```python
# ❌ MAL
def get_data(): ...
def process(): ...
def handle(): ...

# ✅ BIEN
def get_product_current_stock(product_id: UUID) -> int: ...
def register_inventory_entry(product_id: UUID, quantity: int, actor: Actor) -> InventoryMovement: ...
```

**Por qué**: El nombre explica qué hace sin leer el cuerpo. Código autodocumentado.

### 3. **Sin comentarios obvios**

```python
# ❌ MAL
# obtener el usuario
user = get_user(id)

# ✅ BIEN
# solo en el WHY cuando no es evidente
# Esperamos 15 min antes de expirar sesión porque el usuario está en caja
if time_since_last_activity > 900:
    invalidate_session()
```

**Por qué**: El código bien escrito es autodocumentado. Los comentarios deben explicar decisiones, no What.

### 4. **Sin sobre-ingeniería**

```python
# ❌ MAL — prematura abstracción para 3 líneas similares
class ValidationRuleFactory:
    ...

# ✅ BIEN
if email_exists:
    raise ConflictError("Email ya registrado")
if sku_exists:
    raise ConflictError("SKU ya existe")
if tenant_exists:
    raise ConflictError("Empresa ya registrada")
```

**Por qué**: Tres líneas similares es mejor que una abstracción prematura. Complejidad proporcionada.

### 5. **Evaluar antes de implementar**

Si hay un problema arquitectural o de diseño, **señalarlo PRIMERO**, no después de codificar.

```python
# ❌ No hagas esto
# Implemento la pantalla de equipo tal como se me ocurra
# Descubro después que no cumple WCAG 2.1 AA y tengo que rehacerla

# ✅ Haz esto
# Propongo la estructura: "Opción A (sidebar + tabla) vs Opción B (cards + filtros)"
# Discutimos, alineamos, LUEGO implemento
```

**Por qué**: Mejor pausar y discutir que reparar código mal diseñado después.

### 6. **Multi-tenant siempre**

Todo query, comando y evento debe filtrar/considerar `tenant_id`.

```python
# ❌ MAL
SELECT * FROM products;

# ✅ BIEN
SELECT * FROM products WHERE tenant_id = :tenant_id;
```

**Por qué**: El aislamiento de datos entre tenants es crítico y no es negociable.

### 7. **Mobile-first real**

No es "desktop adaptado a móvil". Es móvil como primer objetivo.

```css
/* Móvil primero */
.card { width: 100%; }
.buttons { flex-direction: column; gap: 8px; }

/* Tablet/Desktop (min-width: 768px) */
@media (min-width: 768px) {
  .card { width: 50%; }
  .buttons { flex-direction: row; }
}
```

**Por qué**: El usuario típico (dueño de tienda) abre la app en el mostrador con el móvil.

### 8. **Números sin distorsión**

`font-variant-numeric: tabular-nums` en toda columna numérica.

```css
/* ❌ Los números bailan al scrollear */
.stock { font-family: Inter; }

/* ✅ Los números están alineados */
.stock { font-variant-numeric: tabular-nums; }
```

**Por qué**: Al contar stock, los números tienen que estar estáticos visualmente.

### 9. **Teñir el dato, no el contenedor**

En listas largas, se colorea el número crítico, nunca la fila entera.

```css
/* ❌ MAL — distrae la vista */
.row.low-stock { background: #FEF2F2; } /* todo rojo */

/* ✅ BIEN — enfoca la atención */
.stock-value.low-stock { color: #DC2626; } /* solo el número rojo */
```

**Por qué**: Reduce ruido visual en tablas densas.

### 10. **Modo oscuro es obligatorio**

No es "feature", es función del contexto de uso (cajeros con luz variable, cierres nocturnos).

```tsx
// Dark mode debe estar integrado desde el inicio
const tokens = {
  light: { brand: "#4F46E5", ... },
  dark: { brand: "#818CF8", ... }
}
```

**Por qué**: El usuario trabaja en mostradores con iluminación variable.

### 11. **Accesibilidad WCAG 2.1 AA**

- Contraste mínimo 4.5:1 para texto, 3:1 para UI
- Targets táctiles 44 px mínimo en móvil
- Navegación por teclado (Tab, Enter, Esc)
- Roles ARIA en componentes custom

```jsx
// ❌ MAL — botón no es accesible
<div onClick={handleDelete}>Eliminar</div>

// ✅ BIEN
<button
  onClick={handleDelete}
  aria-label="Eliminar este producto"
  className="button button--danger"
>
  Eliminar
</button>
```

**Por qué**: El usuario del mostrador puede tener limitaciones visuales o motoras.

---

## Flujo de Autenticación

```
REQUEST
  │
  ▼
CORSMiddleware              ← preflight OPTIONS sin auth
  │
  ▼
JWTAuthMiddleware           ← valida RS256, inyecta user_id + tenant_id
  │                            publica UserAuthenticated en EventBus
  ▼
UserAccessProjection        ← escucha UserAuthenticated
  │                            consulta roles + permisos en BD
  │                            guarda snapshot en Redis: user_access:{tenant}:{user}
  ▼
require_permission(code)    ← lee snapshot de Redis
  │                            lanza 403 si el código falta
  ▼
Handler / Use Case          ← lógica de negocio
```

---

## Roles y Permisos

| Rol | Permisos | Responsabilidades |
|-----|----------|-------------------|
| **OWNER** | Todos | Configurar empresa, invitar equipo, ver auditoría |
| **MANAGER** | INVENTORY_*, USERS_READ, AUDIT_READ | Gestionar stock, ver equipo |
| **OPERATOR** | INVENTORY_WRITE, INVENTORY_READ | Registrar movimientos, ver stock |

---

## Comandos Frecuentes

```bash
# Levantar servicios
cd infra && docker-compose up -d

# Ver logs del backend
docker logs -f brixo-backend

# Verificar salud
curl http://localhost:8000/health

# Acceso a BD
docker exec -it brixo-postgres psql -U brixo_user -d brixo

# UI
open http://localhost:8000/docs       # Swagger
open http://localhost:3000            # Frontend
```

---

## Criterios de Éxito del MVP

### Backend ✅ 100%

- [x] `docker-compose up -d` levanta sin errores
- [x] `GET /health` responde 200
- [x] `POST /api/auth/register` crea tenant + OWNER + retorna JWT
- [x] `POST /api/auth/login` retorna JWT válido
- [x] `POST /api/auth/refresh` renueva sin re-login
- [x] RBAC activo — `require_permission(code)` en todos los endpoints
- [x] Errores devuelven `{ error, message }` consistente
- [x] Logs JSON en stdout y archivo

### Frontend ✅ 100%

- [x] Un OWNER puede registrarse desde el browser
- [x] Un OWNER puede iniciar sesión
- [x] Dashboard renderiza con datos API real
- [x] Inventario muestra tabla en desktop, cards en móvil
- [x] Puede registrar movimiento en < 10 seg
- [x] Funciona en mobile y desktop
- [x] Modo oscuro y claro sin bugs

---

## Próximos Pasos

### Fase 6 — QA + Hardening

Antes de producción, resolver 9 gaps de deuda técnica identificados en audit (28 abr):

**Frontend (5 gaps)**:
1. DashboardPage — conectar movimientos reales
2. LoginPage — llamar `GET /api/users/me` post-login
3. App.tsx — fix bug rutas privadas
4. MovementModal — pasar `isMobile` correcto
5. Crear páginas `/movements`, `/team`, `/audit`

**Backend (4 gaps)**:
1. Evento `UserCreated` — registrar handler
2. Endpoints para `create_role()` y `revoke_role_from_user()`
3. Sincronizar JWT TTL (480 vs 15 min)
4. `/me/access` → `/api/me/access` (consistencia)

Ver detalles en [ESTATUS.md — Deuda técnica](3-ESTATUS.md#deuda-técnica-identificada-en-audit-28-abr-sesión-10)

---

**Documento mantenido por**: Equipo Brixo  
**Última revisión**: 29 de abril de 2026  
**Estado**: MVP 100% funcional, pre-producción
