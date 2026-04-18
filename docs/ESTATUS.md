# ESTATUS DEL PROYECTO BRIXO — MVP

**Fecha**: 18 de abril de 2026
**Rama activa**: `feature/auth-core`
**Estado general**: 🟡 **Backend core funcional — Frontend pendiente**

> Historial: el ESTATUS anterior (24-ene-2026) estaba completamente desactualizado.
> Este documento refleja el estado real del código fuente al 18-04-2026.

---

## RESUMEN EJECUTIVO

El backend tiene el núcleo funcional. La autenticación JWT RS256 está operativa, el
schema SQL completo con 8 tablas fue creado, los repositorios reales reemplazaron los
stubs hardcodeados, y los endpoints de productos e inventario están implementados y
conectados a la app. El bloqueante principal para el MVP es el frontend.

---

## LO QUE ESTÁ IMPLEMENTADO Y FUNCIONA

### Infraestructura

| Componente | Estado | Notas |
| --- | --- | --- |
| Docker Compose | ✅ | PostgreSQL 15 + Redis 7 + Backend + Frontend |
| PostgreSQL 15 | ✅ | Schema completo con 8 tablas, seed data incluido |
| Redis 7 | ✅ | Configurado en Docker, usado para snapshots de sesión |
| Pool de conexiones | ✅ | `infrastructure/database.py` — psycopg2 ThreadedConnectionPool |
| Variables de entorno | ✅ | Pydantic BaseSettings, JWT config, Redis, logging |
| Startup/shutdown | ✅ | `lifespan` asynccontextmanager en main.py — pool init y cierre limpio |

### Schema SQL (`infra/docker/postgres/init.sql`)

Todas las tablas del dominio están creadas con UUIDs, foreign keys, constraints e índices:

| Tabla | Estado |
| --- | --- |
| `tenants` | ✅ |
| `users` | ✅ |
| `roles` | ✅ |
| `user_roles` | ✅ |
| `permissions` | ✅ |
| `products` | ✅ (con `tenant_id`, UUID, `minimum_stock`) |
| `inventory_movements` | ✅ |
| `audit_logs` | ✅ (payload JSONB) |

Seed data: tenant "Demo Store", usuario `admin@brixo.local`, 3 productos de ejemplo.

### Autenticación y seguridad

| Componente | Estado | Archivo |
| --- | --- | --- |
| JWT RS256 — generate | ✅ | `infrastructure/security/jwt_service.py` |
| JWT RS256 — decode | ✅ | Bug de método truncado corregido, 4 excepciones manejadas |
| JWTAuthMiddleware | ✅ | `infrastructure/security/jwt_middleware.py` |
| Login endpoint | ✅ | `POST /api/auth/login` |
| AuthRepositorySQL real | ✅ | `adapters/repositories/auth_repository_sql.py` — consulta tabla `users` |
| Sesión Redis | ✅ | Snapshot de roles/permisos por usuario |

### Domain y Application

| Componente | Estado | Notas |
| --- | --- | --- |
| EventBus | ✅ | Bug async corregido — detecta coroutines con `inspect.isawaitable` |
| Handlers | ✅ | `UserLoggedIn`, `UserLoginFailed`, `UserAuthenticated` |
| LoginUser use case | ✅ | `application/services/auth/login_user.py` |
| CreateProductUseCase | ✅ | `application/use_cases/create_product.py` |
| RegisterInventoryMovementUseCase | ✅ | Maneja ENTRADA / SALIDA / AJUSTE con validación de stock |
| GetProductStockUseCase | ✅ | `application/use_cases/get_product_stock.py` |
| Domain entities | ✅ | Product, InventoryMovement, LogEntry, Actor, User, Tenant |
| Port interfaces (ABC) | ✅ | ProductRepository, InventoryMovementRepository, AuditLogRepository, AuthRepository |

### API REST — Endpoints activos

| Método | Ruta | Estado |
| --- | --- | --- |
| POST | `/api/auth/login` | ✅ |
| GET | `/me/access` | ✅ |
| GET | `/api/products/` | ✅ |
| POST | `/api/products/` | ✅ |
| GET | `/api/products/{product_id}` | ✅ |
| POST | `/api/products/{product_id}/movements` | ✅ |
| GET | `/api/products/{product_id}/movements` | ✅ |

### Repositorios reales (adapters/repositories/)

| Repositorio | Estado | Reemplaza |
| --- | --- | --- |
| `AuthRepositorySQL` | ✅ | Stub hardcodeado en `infrastructure/persistence/` |
| `ProductRepositorySQL` | ✅ | Vacío en `adapters/` |
| `InventoryMovementRepositorySQL` | ✅ | No existía |
| `AuditLogRepositorySQL` | ✅ | No existía |

---

## LO QUE ESTÁ PENDIENTE

### Crítico para MVP funcional

| # | Ítem | Impacto |
| --- | --- | --- |
| 1 | Frontend completo | Sin UI no hay producto |
| 2 | `handle_user_logged_in` no persiste en BD | Auditoría de logins silenciosa |
| 3 | LoginRequest sin modelo Pydantic | `KeyError` 500 si cliente omite campo |
| 4 | JWT middleware sin rutas públicas | Swagger UI inaccesible sin token |

### Deuda técnica (no bloquea arranque)

| # | Ítem | Archivo |
| --- | --- | --- |
| 1 | `class Tenat` → `Tenant` | `domain/contracts.py:8` |
| 2 | `ocurred_at` → `occurred_at` | `domain/events/base.py` |
| 3 | Directorio `acccess/` → `access/` | `application/services/acccess/` |
| 4 | Archivo `asssign_role.py` vacío | `application/services/` |
| 5 | `aut_service.py` → `auth_service.py` (huérfano) | `application/auth/` |
| 6 | `domain/events.py` duplicado del paquete `domain/events/` | `domain/` |
| 7 | `access_repository.py` sin herencia ABC | `application/ports/` |
| 8 | `AssignRoleToUserUseCase` no existe | `application/use_cases/` |

---

## PROGRESO POR COMPONENTE

```text
Schema SQL             ██████████  100%
domain/                █████████░   95%  (typos menores)
application/event_bus  ██████████  100%  (bug async resuelto)
application/handlers   ██████░░░░   60%  (auditoría no persiste)
application/use_cases  ████████░░   80%  (assign_role faltante)
application/ports/     █████████░   90%  (access_repository sin ABC)
infrastructure/db      ██████████  100%
infrastructure/jwt     ██████████  100%  (decode completo)
infrastructure/mw      █████████░   90%  (falta lista rutas públicas)
infrastructure/redis   ██████████  100%
adapters/repositories  ██████████  100%
infrastructure/routes  █████████░   90%  (falta LoginRequest Pydantic)
main.py                ██████████  100%  (lifespan, routers, pool)
frontend/src/          █░░░░░░░░░    5%  (solo placeholder)
```

---

## PLAN PARA CERRAR EL MVP

### Fase 1 — Seguridad y validación (½ día)

1. Crear `LoginRequest(BaseModel)` con `email: EmailStr` y `password: str` en `routes/auth.py`
2. Agregar lista `PUBLIC_PATHS` en `jwt_middleware.py` (`/docs`, `/redoc`, `/openapi.json`, `/health`)
3. Inyectar `AuditLogRepositorySQL` en `handlers.py` para persistir logins

### Fase 2 — Frontend mínimo (3-5 días)

1. Instalar dependencias: `axios`, `react-router-dom`, `zustand`
2. Crear `src/services/api.js` — cliente axios con interceptor de token JWT
3. Crear páginas: `LoginPage`, `ProductListPage`, `MovementFormModal`, `DashboardPage`, `AuditLogPage`
4. Crear stores Zustand: `authStore`, `productStore`

### Fase 3 — Cleanup (½ día)

1. Corregir typos del dominio (`Tenat`, `ocurred_at`, `acccess/`, `asssign_role.py`)
2. Eliminar `domain/events.py` plano (duplicado)
3. Hacer `access_repository.py` heredar de ABC
4. Renombrar `aut_service.py` → `auth_service.py` o eliminarlo (es huérfano)

### Fase 4 — Testing e integración (1 día)

1. `docker compose up` — verificar flujo completo
2. Crear producto → registrar movimiento → ver stock → ver historial
3. Login con usuario real desde tabla `users`

---

## ESTIMACIÓN PARA MVP

| Fase | Tiempo estimado |
| --- | --- |
| Fase 1 — Seguridad y validación | 4 horas |
| Fase 2 — Frontend | 3-5 días |
| Fase 3 — Cleanup | 4 horas |
| Fase 4 — Testing e integración | 1 día |
| **Total** | **~6-7 días** |

---

## RIESGOS ACTUALES

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Auditoría de logins silenciosa | Alta | Medio | Inyectar AuditLogRepository en handlers.py |
| Swagger bloqueado por JWT | Alta | Bajo | Agregar PUBLIC_PATHS en middleware |
| KeyError en /login sin campos | Media | Alto | Crear LoginRequest Pydantic |
| Frontend subestimado en tiempo | Media | Alto | Priorizar flujo mínimo antes de UX |

---

**Documento generado**: 18 de abril de 2026
**Próxima revisión**: Al completar Fase 1
