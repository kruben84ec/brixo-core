# ✅ CHECKLIST DETALLADO - IMPLEMENTACIÓN MVP BRIXO

## 🔴 FASE 1: INFRAESTRUCTURA Y BASE DE DATOS (Crítico)

### Docker & Servicios
- [ ] Agregar servicio Redis a `docker-compose.yml`
  - [ ] Imagen: redis:7-alpine
  - [ ] Puerto: 6379
  - [ ] Volumen para persistencia
  - [ ] Health check
  - [ ] Esperar a que postgres esté listo

- [ ] Validar que todos los servicios sean accesibles:
  - [ ] PostgreSQL en 5432
  - [ ] Backend en 8000
  - [ ] Frontend en 3000
  - [ ] Redis en 6379

### Base de Datos - Migraciones SQL
- [ ] Crear script SQL completo en `infra/docker/postgres/init.sql`
  
  **Tablas necesarias**:
  - [ ] `tenants` (empresas)
  - [ ] `users` (usuarios)
  - [ ] `roles` (roles de usuario)
  - [ ] `user_roles` (asignaciones de roles)
  - [ ] `products` (productos/artículos)
  - [ ] `inventory_movements` (entradas/salidas)
  - [ ] `audit_logs` (historial de cambios)
  - [ ] `permissions` (permisos)
  
  **Índices**:
  - [ ] INDEX en tenant_id (multi-tenant)
  - [ ] INDEX en user_id
  - [ ] INDEX en product_id
  - [ ] INDEX en created_at (para auditoría)

### Correcciones de Código de Dominio
- [ ] Renombrar `class Tenat` → `class Tenant` en `contracts.py`
- [ ] Actualizar imports donde se use Tenat
- [ ] Validar que todos los dataclasses sean inmutables (frozen=True)

### Configuración de Ambiente
- [ ] Completar `settings.py`:
  - [ ] Database connection string desde env var
  - [ ] Redis URL desde env var
  - [ ] JWT keys desde env files
  - [ ] Validación de settings al startup

- [ ] Variables de entorno en `infra/env/`:
  - [ ] `backend.env`: DATABASE_URL, REDIS_URL, JWT_*
  - [ ] `db.env`: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
  - [ ] `frontend.env`: VITE_API_URL=http://localhost:8000

---

## 🔴 FASE 2: DATA ACCESS LAYER (Crítico)

### Repositorios
- [ ] Crear `backend/adapters/repositories/` directorio

- [ ] Implementar `ProductRepository`:
  - [ ] `create(name: str, initial_stock: int) → Product`
  - [ ] `get_by_id(product_id: UUID) → Product`
  - [ ] `list_all(tenant_id: UUID) → List[Product]`
  - [ ] `update_stock(product_id: UUID, delta: int) → Product`
  - [ ] `get_current_stock(product_id: UUID) → int`

- [ ] Implementar `UserRepository`:
  - [ ] `create(tenant_id, username, email, authority_level) → User`
  - [ ] `get_by_id(user_id: UUID) → User`
  - [ ] `get_by_username(tenant_id, username) → User`
  - [ ] `list_by_tenant(tenant_id: UUID) → List[User]`

- [ ] Implementar `TenantRepository`:
  - [ ] `create(name: str) → Tenant`
  - [ ] `get_by_id(tenant_id: UUID) → Tenant`

- [ ] Implementar `RoleRepository`:
  - [ ] `create(tenant_id, name) → Role`
  - [ ] `list_by_tenant(tenant_id: UUID) → List[Role]`
  - [ ] `assign_to_user(user_id, role_id) → UserRole`
  - [ ] `revoke_from_user(user_id, role_id) → None`

- [ ] Implementar `AuditLogRepository`:
  - [ ] `create(log_entry: LogEntry) → LogEntry`
  - [ ] `get_by_tenant(tenant_id: UUID) → List[LogEntry]`
  - [ ] `get_by_entity(entity_id: UUID) → List[LogEntry]`

- [ ] Implementar `InventoryMovementRepository`:
  - [ ] `register_movement(movement: InventoryMovement) → InventoryMovement`
  - [ ] `get_history(product_id: UUID) → List[InventoryMovement]`

### Interfaces (Puertos)
- [ ] Crear `backend/adapters/repositories/base.py` con interfaz base
- [ ] Asegurar que todos los repositorios implementen interfaz consistente

### Database Connection
- [ ] Crear `backend/infrastructure/database.py`:
  - [ ] Pool de conexiones PostgreSQL
  - [ ] Async support (asyncpg o psycopg3)
  - [ ] Connection lifecycle hooks

---

## 🔴 FASE 3: CASOS DE USO (Crítico)

### Casos de Uso de Inventario
- [ ] `CreateProductUseCase`:
  - [ ] Input: name, initial_stock, tenant_id
  - [ ] Output: Product
  - [ ] Validaciones: nombre no vacío, stock >= 0
  - [ ] Publican evento: ProductCreated

- [ ] `RegisterMovementUseCase`:
  - [ ] Input: product_id, movement_type (ENTRADA/SALIDA), quantity, reason
  - [ ] Output: InventoryMovement
  - [ ] Validaciones: quantity > 0, stock no puede ser negativo
  - [ ] Publica evento: InventoryChanged
  - [ ] Crea LogEntry automático

- [ ] `GetProductStockUseCase`:
  - [ ] Input: product_id
  - [ ] Output: current_stock
  - [ ] Lee desde repositorio

### Casos de Uso de Autenticación
- [ ] Completar `LoginUseCase`:
  - [ ] Input: username, password, tenant_id
  - [ ] Output: JWT token
  - [ ] Validaciones: usuario existe, contraseña correcta
  - [ ] Publica evento: UserLoggedIn
  - [ ] Crea sesión en Redis

- [ ] `CreateUserUseCase`:
  - [ ] Input: username, email, authority_level, tenant_id
  - [ ] Output: User
  - [ ] Hash de contraseña (bcrypt o argon2)
  - [ ] Validaciones: username único por tenant, email válido

- [ ] `AssignRoleUseCase` (completar archivo vacío):
  - [ ] Input: user_id, role_id, tenant_id
  - [ ] Output: UserRole
  - [ ] Validaciones: usuario y rol existen, pertenecen al mismo tenant
  - [ ] Publica evento: RoleAssigned

### Casos de Uso de Auditoría
- [ ] `GetAuditLogUseCase`:
  - [ ] Input: tenant_id, filters (fecha, tipo, entity)
  - [ ] Output: List[LogEntry]

---

## 🔴 FASE 4: CONTROLADORES Y RUTAS API (Crítico)

### DTOs (Data Transfer Objects)
- [ ] Crear `backend/adapters/dtos/`:
  - [ ] `ProductDTO` (in/out)
  - [ ] `UserDTO` (in/out)
  - [ ] `MovementDTO` (in/out)
  - [ ] `LoginDTO` (in)
  - [ ] `TokenResponseDTO` (out)
  - [ ] `AuditLogDTO` (out)

### Controladores
- [ ] Crear `backend/adapters/http/`:

  **ProductController**:
  - [ ] POST `/api/products` → CreateProduct
  - [ ] GET `/api/products` → ListProducts
  - [ ] GET `/api/products/{id}` → GetProduct
  - [ ] PUT `/api/products/{id}` → UpdateProduct (stock)

  **InventoryController**:
  - [ ] POST `/api/inventory/movements` → RegisterMovement
  - [ ] GET `/api/inventory/movements` → ListMovements
  - [ ] GET `/api/inventory/stock/{productId}` → GetStock
  - [ ] GET `/api/inventory/movements/{productId}` → GetProductHistory

  **AuthController**:
  - [ ] POST `/api/auth/login` → Login
  - [ ] POST `/api/auth/logout` → Logout
  - [ ] POST `/api/auth/refresh` → RefreshToken
  - [ ] GET `/api/auth/me` → GetCurrentUser

  **UserController**:
  - [ ] POST `/api/users` → CreateUser (admin only)
  - [ ] GET `/api/users` → ListUsers
  - [ ] POST `/api/users/{id}/roles` → AssignRole
  - [ ] DELETE `/api/users/{id}/roles/{roleId}` → RevokeRole

  **AuditController**:
  - [ ] GET `/api/audit/logs` → GetAuditLogs
  - [ ] GET `/api/audit/logs?entity=PRODUCT&entityId={id}` → GetEntityHistory

### Validación y Errores
- [ ] Crear `backend/adapters/exceptions.py`:
  - [ ] CustomException base class
  - [ ] ProductNotFound
  - [ ] UserNotFound
  - [ ] InvalidCredentials
  - [ ] UnauthorizedAction
  - [ ] ValidationError

- [ ] Error handlers en FastAPI:
  - [ ] Exception → JSON response con código HTTP
  - [ ] Logging de errores

---

## 🔴 FASE 5: INTEGRACIÓN EN main.py (Crítico)

### FastAPI App Setup
- [ ] Completar `backend/main.py`:
  ```python
  from fastapi import FastAPI
  from fastapi.middleware.cors import CORSMiddleware
  
  app = FastAPI(
      title="Brixo API",
      description="Sistema de control de inventario",
      version="4.5.0"
  )
  ```

### Middlewares
- [ ] CORS:
  - [ ] Allow origins: localhost:3000, (y producción later)
  - [ ] Allow credentials: true

- [ ] Logging middleware:
  - [ ] Log cada request/response
  - [ ] Incluir tenant_id, user_id

- [ ] Auth middleware:
  - [ ] Validar JWT en rutas protegidas
  - [ ] Inyectar current_user en contexto

### Lifecycle
- [ ] `@app.on_event("startup")`:
  - [ ] Conectar a BD
  - [ ] Conectar a Redis
  - [ ] Instanciar Event Bus
  - [ ] Subscribir handlers a eventos
  - [ ] Cargar configuración

- [ ] `@app.on_event("shutdown")`:
  - [ ] Cerrar conexiones BD
  - [ ] Cerrar Redis
  - [ ] Logs de shutdown

### Incluir Routers
- [ ] `app.include_router(product_router, prefix="/api")`
- [ ] `app.include_router(inventory_router, prefix="/api")`
- [ ] `app.include_router(auth_router, prefix="/api")`
- [ ] `app.include_router(user_router, prefix="/api")`
- [ ] `app.include_router(audit_router, prefix="/api")`

### Documentación
- [ ] Swagger en `/docs`
- [ ] ReDoc en `/redoc`
- [ ] Health check en `/health`

---

## 🟡 FASE 6: FRONTEND (Importante)

### Setup
- [ ] Completar `frontend/package.json` con deps:
  - [ ] axios
  - [ ] react-router-dom
  - [ ] zustand (state management)

### Estructura
- [ ] Crear `frontend/src/`:
  - [ ] `components/` - Componentes reutilizables
  - [ ] `pages/` - Páginas/vistas
  - [ ] `services/` - API calls
  - [ ] `stores/` - Zustand stores
  - [ ] `hooks/` - Custom hooks

### Componentes Críticos
- [ ] `LoginPage`:
  - [ ] Formulario username/password
  - [ ] Manejo de errores
  - [ ] Guardar token en localStorage/sessionStorage

- [ ] `ProductListPage`:
  - [ ] Tabla de productos
  - [ ] Botón para crear producto
  - [ ] Mostrar stock actual
  - [ ] Botones de entrada/salida

- [ ] `ProductFormModal`:
  - [ ] Crear nuevo producto
  - [ ] Campos: nombre, stock inicial

- [ ] `MovementFormModal`:
  - [ ] Registrar movimiento
  - [ ] Campos: tipo (entrada/salida), cantidad, motivo
  - [ ] Mostrar stock resultante

- [ ] `DashboardPage`:
  - [ ] Resumen de productos
  - [ ] Stock bajo (en rojo)
  - [ ] Últimos movimientos

- [ ] `AuditLogPage`:
  - [ ] Tabla de cambios
  - [ ] Filtros por fecha, tipo, entidad
  - [ ] Mostrar quién, cuándo, qué cambió

### API Service
- [ ] Crear `frontend/src/services/api.ts`:
  - [ ] Cliente HTTP (axios)
  - [ ] Métodos para cada endpoint
  - [ ] Manejo de auth tokens
  - [ ] Interceptores para errores

### State Management
- [ ] Zustand store para:
  - [ ] Usuario autenticado
  - [ ] Productos
  - [ ] Movimientos
  - [ ] Tenant actual

---

## 🟡 FASE 7: TESTING (Importante)

### Backend Tests
- [ ] Tests unitarios (pytest):
  - [ ] Casos de uso
  - [ ] Validaciones
  - [ ] Eventos

- [ ] Tests de integración:
  - [ ] Endpoints API
  - [ ] Flujos completos (login → crear producto → movimiento)

- [ ] Coverage mínimo: 70%

### Frontend Tests
- [ ] Tests unitarios (vitest):
  - [ ] Componentes
  - [ ] Funciones util

- [ ] Tests e2e (opcional para MVP):
  - [ ] Flujo login
  - [ ] Crear producto
  - [ ] Registrar movimiento

---

## ✨ FASES ADICIONALES (Post-MVP)

- [ ] CI/CD con GitHub Actions
- [ ] Reportes en PDF/CSV
- [ ] Alertas de stock bajo
- [ ] Importación de datos
- [ ] Dark mode
- [ ] Soporte multi-idioma
- [ ] Backup automático

---

## 📊 EJECUCIÓN RECOMENDADA

**Equipo**: 1 backend + 1 frontend developer  
**Daily standup**: 15 min para sincronizar bloqueantes

**Semana 1**:
- Día 1-2: Fases 1-2 (BD + Repos)
- Día 3-4: Fase 3 (Casos de uso)
- Día 5: Fase 4 (Controllers)

**Semana 2**:
- Día 1: Fase 5 (main.py + integración)
- Día 2-4: Fase 6 (Frontend)
- Día 5: Testing + fixes

**Semana 3** (opcional):
- Optimizaciones
- Deploy a staging
- QA y refinamientos

---

## 🚨 BLOCKERS CONOCIDOS

1. **Redis no en docker-compose** → Bloquea sesiones persistentes
2. **main.py vacío** → Bloquea backend completamente
3. **BD incompleta** → Bloquea todas las operaciones CRUD
4. **Sin repositorios** → Bloquea acceso a datos
5. **Sin controladores** → Bloquea API

**Recomendación**: Resolver estos 5 primero (Fase 1-2) antes de continuar.

---

**Última actualización**: 24 de enero de 2026
