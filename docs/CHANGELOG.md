# CHANGELOG — Brixo Core

Historial de cambios del proyecto ordenado por fecha descendente.
Formato: `[hash] fecha — descripción`

---

## 2026-04-18 — Sprint de completación del backend (Fases 1–4)

### feat: Infraestructura y controladores completos — `457ab54`
- Volumen postgres externo con bind mount `./data/postgres`
- Env files montados en contenedor `./env:/app/env:ro`
- `ProductController` — GET/POST `/api/products/`, GET `/api/products/{id}`
- `InventoryController` — POST/GET `/api/products/{id}/movements`
- `UserController` — GET/POST `/api/users/`
- `AuditController` — GET `/api/audit/?limit=N`
- `AccessController` — GET `/me/access` con snapshot Redis
- `PUBLIC_PATHS` en `JWTAuthMiddleware`: `/docs /redoc /openapi.json /health /api/auth/login`
- Audit trail en `handlers.py` — persiste `LogEntry` en BD en cada login

### feat: Fase 3 — todos los use cases del MVP — `d37d8a1`
- `CreateProductUseCase` — `application/use_cases/create_product.py`
- `RegisterInventoryMovementUseCase` — `application/use_cases/register_inventory_movement.py`
- `GetProductStockUseCase` — `application/use_cases/get_product_stock.py`
- `CreateUserUseCase` — `application/use_cases/create_user.py`
- `AssignRoleToUserUseCase` — `application/use_cases/assign_role_to_user.py`
- `GetAuditLogByTenantUseCase` — `application/use_cases/get_audit_log_by_tenant.py`

### feat: Fase 2 — Data Access Layer completo — `a9c2ba1`
- 8 repositorios implementados: puerto ABC + adaptador SQL real con psycopg2
- `AuthRepositorySQL`, `ProductRepositorySQL`, `InventoryMovementRepositorySQL`
- `AuditLogRepositorySQL`, `UserRepositorySQL`, `TenantRepositorySQL`
- `RoleRepositorySQL`, `AccessRepositorySQL`
- Script SQL completo — 8 tablas con UUID, tenant_id, índices y datos seed

### docs: Roadmap v2 con Fase 4B — `3b82f32`
- Incorpora Fase 4B (RBAC enforcement, CORS, refresh token) como brecha crítica
- Progreso total ajustado a 58% (la brecha existía antes, simplemente no estaba en el plan)
- ESTATUS.md actualizado con el mismo diagnóstico

### fix: Corrección de errores post-integración — `9e928e3`
- Correcciones menores tras integrar las ramas de las fases 2 y 3

---

## 2026-02-22 — Definición de roles y permisos

### feat: Modelo de roles y permisos — `c915f86`
- Definición de entidades `Role`, `Permission`, `UserRole` en el dominio
- Seed con roles OWNER / OPERATOR y permisos INVENTORY_READ/WRITE, USERS_READ/WRITE, etc.

### refactor: Limpieza arquitectónica — `82c0511`
- Reorganización de capas para alinear con arquitectura hexagonal
- Separación de `application/services/` y `application/use_cases/`

---

## 2026-02-17 — Redis y autenticación JWT

### feat: Redis integrado y snapshot de acceso — `8951c9f` / `255d9ba`
- Redis añadido a `docker-compose.yml`
- `UserAccessProjection` — escucha `UserAuthenticated` y guarda snapshot en Redis
- Clave: `user_access:{tenant_id}:{user_id}`

### fix: JWT con claves PEM — `9a4a602`
- `JWTService` RS256 reconoce correctamente el par de claves PEM desde `infra/env/jwt.env`
- Token decodificado correctamente en `JWTAuthMiddleware`

### fix: Login con usuario mock funcional — `6dd9dc8`
- `AuthRepositorySQL` acepta `admin@brixo.local` para desarrollo
- Flujo login → JWT → snapshot Redis funcional end-to-end

### fix: Docker con despliegue continuo — `29b46ab`
- Hot-reload del backend en contenedor Docker durante desarrollo

---

## 2026-02-01 — API corriendo

### feat: API FastAPI corriendo en Docker — `e924561`
- `main.py` con FastAPI app instanciada, middleware y lifespan básico
- Backend accesible en `http://localhost:8000`

### refactor: Reorganización del proyecto — `a627e39`
- Estructura de directorios alineada con arquitectura hexagonal

---

## 2026-01-24 — Capas base e integración JWT

### feat: JWT RS256 — `5f56e1c`
- `JWTService` con generación y decodificación de tokens RS256
- `JWTAuthMiddleware` — valida token en cada request

### feat: Capas base del proyecto — `e2a3ae2`
- Estructura `domain/`, `application/`, `infrastructure/`, `adapters/`
- `EventBus` pub/sub con manejo de errores
- `handlers.py` — `UserLoggedIn`, `UserLoginFailed`, `UserAuthenticated`

### feat: `settings.py` con Pydantic BaseSettings — `ccd2ca6`
- Configuración centralizada: JWT, Redis, Logging, PostgreSQL
- Carga desde archivos `.env` por servicio

---

## 2026-01-13 — Auth y conexión de datos

### feat: Auth básica — `d82266a`
- Primer flujo de autenticación: email + password → token
- `LoginUser` use case inicial (versión preliminar)

### feat: Conexión de datos — `feddb32`
- Primer pool de conexiones a PostgreSQL con psycopg2
- Tabla `products` inicial en `init.sql`

---

## 2026-01-11 — Fundamentos del sistema

### feat: Sistema de eventos y bus — `3362067` / `7882524`
- `EventBus` — publicación y suscripción de eventos de dominio
- Primer handler de captura de eventos

### feat: Logging de negocio — `774f0b4` / `9863e84`
- `LogEntry`, `Actor`, `LogEventType` en `domain/logs.py`
- Logger JSON estructurado en `infrastructure/logging.py`

### feat: Gobernanza y arquitectura basada en eventos — `0703dc6`
- Definición de `domain/events/` — `InventoryChanged`, `RoleAssigned`, `UserLoggedIn`
- Contratos base: `Tenant`, `User`, `Role`, `Permission` en `domain/contracts.py`

### feat: Docker Compose inicial — `a43ca02`
- PostgreSQL 15 en contenedor
- Configuración de red y volúmenes básicos

---

## 2026-01-04 — Inicio del proyecto

### chore: Estructura inicial del repositorio — `0470afa` / `737b20d`
- Commit inicial con estructura de carpetas
- `README.md` con descripción del proyecto

---

## PENDIENTE (próximas entradas esperadas)

```
[ ] feat(fase4b): CORS + require_permission + POST /auth/refresh
[ ] feat(fase4):  POST /api/users/{id}/roles
[ ] fix(fase1):   GET /health + typo Tenat → Tenant
[ ] feat(fase5):  Frontend React completo
[ ] feat(fase6):  QA + rate limiting + docker-compose.prod.yml
```
