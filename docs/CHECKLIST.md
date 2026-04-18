# CHECKLIST — Diagnóstico Técnico Real del Código

**Generado**: 18 de abril de 2026
**Branch**: `feature/auth-core`
**Metodología**: Revisión archivo por archivo del código fuente real

> Este checklist reemplaza el anterior (basado en ESTATUS.md del 24-ene-2026, que estaba desactualizado).
> Los ítems están ordenados por bloqueo: un ítem sin resolver puede romper los que dependen de él.

---

## LEYENDA

- 🔴 **CRÍTICO** — Rompe funcionalidad existente o bloquea todo lo que viene después
- 🟡 **IMPORTANTE** — No bloquea arranque pero causa bugs en runtime o viola arquitectura
- 🟢 **MENOR** — Deuda técnica, typos, inconsistencias que no rompen nada hoy

---

## BLOQUE 1 — Bugs activos (el código existe pero está roto)

### 1.1 EventBus no puede ejecutar handlers async

- [ ] 🔴 `application/event_bus.py` — `publish()` es síncrono pero llama handlers como `UserAccessProjection.on_user_authenticated` que son `async def`. La coroutine se crea pero nunca se ejecuta (no hay `await` ni `asyncio.run()`).
  - **Síntoma**: El snapshot de acceso en Redis **nunca se escribe** aunque el log diga que sí.
  - **Archivo afectado también**: `infrastructure/projections/user_access_projection.py:36`
  - **Solución**: Detectar si el handler retorna una coroutine y ejecutarla, o rediseñar el bus como async.

### 1.2 jwt_service.py — método `decode()` truncado

- [ ] 🔴 `infrastructure/security/jwt_service.py:40-52` — El método `decode()` tiene el bloque `try` incompleto. Solo captura `jwt.ExpiredSignatureError` pero falta el `return` dentro del `try` y no hay manejo de `jwt.InvalidTokenError`, `jwt.DecodeError` ni `jwt.InvalidSignatureError`.
  - **Síntoma**: Tokens con firma inválida no son rechazados correctamente → excepción no controlada en middleware.
  - **Solución**: Completar el bloque try/except con todos los casos de excepción JWT.

### 1.3 aut_service.py — TTL convertido incorrectamente

- [ ] 🔴 `application/auth/aut_service.py:26` — El TTL se lee en **minutos** (`access_token_exp_minutes`) pero se pasa a `timedelta(seconds=TTL)`. Un token configurado para 15 minutos expira en 15 **segundos**.
  - **Solución**: Cambiar a `timedelta(minutes=TTL)`.

### 1.4 aut_service.py — `await` sobre método síncrono

- [ ] 🔴 `application/auth/aut_service.py:33` — Hace `await self.event_bus.publish(...)` pero `EventBus.publish()` es síncrono, no una coroutine.
  - **Síntoma**: `TypeError: object NoneType can't be used in 'await' expression` en runtime.
  - **Nota**: Este servicio tampoco se instancia en ningún lugar actualmente.

### 1.5 main.py — wait_for_db bloquea el event loop de uvicorn

- [ ] 🔴 `main.py` — La función `init_app()` llama `wait_for_db()` (síncrono, usa `time.sleep`) dentro del ciclo de vida de una app ASGI. Bloquea el event loop de uvicorn durante el startup.
  - **Síntoma**: El servidor puede parecer colgado los primeros segundos.
  - **Solución**: Usar `asyncio.sleep` y convertir la espera a async, o correr `wait_for_db` en un executor.

---

## BLOQUE 2 — Typos que rompen imports en runtime

### 2.1 Clase `Tenat` en lugar de `Tenant`

- [ ] 🟡 `domain/contracts.py:8` — `class Tenat:` debe ser `class Tenant:`.
  - **Impacto**: Todo el código que intente importar `Tenant` fallará con `ImportError`. Actualmente nadie importa este nombre porque el typo se arrastra, pero bloquea implementaciones futuras.

### 2.2 Atributo `ocurred_at` en lugar de `occurred_at`

- [ ] 🟡 `domain/events/base.py` — El atributo `ocurred_at` tiene typo (falta una `r`). Los eventos en `domain/events/auth.py` usan `occurred_at` (correcto), generando inconsistencia entre clases hermanas.

### 2.3 Typo en nombre de directorio `acccess/`

- [ ] 🟡 `application/services/acccess/` — El directorio tiene 3 "c". Los imports funcionan porque Python usa el nombre real, pero es confuso y genera errores al referenciar el módulo manualmente.

### 2.4 Typo en nombre de archivo `asssign_role.py`

- [ ] 🟡 `application/services/asssign_role.py` — Triple "s". El archivo además está completamente vacío (0 líneas).

### 2.5 Typo en nombre de archivo `aut_service.py`

- [ ] 🟡 `application/auth/aut_service.py` — Le falta la "h" (debería ser `auth_service.py`).

---

## BLOQUE 3 — Archivos vacíos o sin implementar

### 3.1 assign_role — completamente vacío

- [ ] 🔴 `application/services/asssign_role.py` — 0 líneas de código. No existe ningún caso de uso de asignación de roles.

### 3.2 adapters/ — directorio completamente vacío

- [ ] 🔴 `backend/adapters/` — Solo contiene `__init__.py`. Faltan:
  - [ ] `adapters/repositories/product_repository_sql.py`
  - [ ] `adapters/repositories/user_repository_sql.py`
  - [ ] `adapters/repositories/tenant_repository_sql.py`
  - [ ] `adapters/repositories/role_repository_sql.py`
  - [ ] `adapters/repositories/audit_log_repository_sql.py`
  - [ ] `adapters/repositories/inventory_movement_repository_sql.py`
  - [ ] `adapters/dtos/product_dto.py`
  - [ ] `adapters/dtos/user_dto.py`
  - [ ] `adapters/dtos/movement_dto.py`
  - [ ] `adapters/dtos/login_dto.py`
  - [ ] `adapters/dtos/token_response_dto.py`
  - [ ] `adapters/exceptions.py` — excepciones de dominio mapeadas a HTTP

### 3.3 mappers/ — directorio vacío

- [ ] 🟡 `backend/mappers/` — Solo contiene `__init__.py`. Faltan los mappers Domain ↔ DTO.

### 3.4 infrastructure/database.py — no existe

- [ ] 🔴 No existe ningún pool de conexiones a PostgreSQL. Es prerequisito de todos los repositorios reales.
  - **Debe incluir**: pool psycopg2, context manager para conexiones, manejo de transacciones.

### 3.5 Casos de uso de inventario — no existen

- [ ] 🔴 No existe ningún caso de uso para:
  - [ ] `CreateProductUseCase` — crear producto con stock inicial
  - [ ] `RegisterInventoryMovementUseCase` — registrar entrada/salida/ajuste
  - [ ] `GetProductCurrentStockUseCase` — obtener stock actual
  - [ ] `CreateUserUseCase` — crear usuario con hash de contraseña
  - [ ] `CreateTenantUseCase` — crear empresa/negocio
  - [ ] `AssignRoleToUserUseCase` — asignar rol a usuario
  - [ ] `GetAuditLogByTenantUseCase` — historial de auditoría

---

## BLOQUE 4 — Arquitectura y patrones inconsistentes

### 4.1 `access_repository.py` no hereda de ABC

- [ ] 🟡 `application/ports/access_repository.py` — A diferencia de `auth_repository.py` (que usa correctamente `ABC` y `@abstractmethod`), este archivo define los métodos con `raise NotImplementedError` sin herencia de ABC.
  - **Consecuencia**: No hay contrato forzado. Se puede instanciar `AccessRepository()` directamente sin error en tiempo de importación.

### 4.2 Módulo `domain/events.py` duplicado con `domain/events/base.py`

- [ ] 🟡 Existe `/domain/events.py` (archivo plano) y `/domain/events/` (paquete con `base.py`). Esto crea ambigüedad en `from domain.events import ...` — puede resolverse a uno u otro dependiendo del intérprete y la versión.
  - **Solución**: Eliminar el archivo plano `domain/events.py` y usar solo el paquete `domain/events/`.

### 4.3 `infrastructure/user_access_projection.py` — archivo huérfano

- [ ] 🟡 Existe `infrastructure/user_access_projection.py` en la raíz de infrastructure Y `infrastructure/projections/user_access_projection.py`. El de la raíz:
  - No está registrado en ningún handler ni en main.py
  - Importa `from domain.events import RoleAssigned, RoleRevoked` que puede no resolverse por el punto 4.2
  - Tiene métodos async con el mismo problema del EventBus síncrono

### 4.4 `aut_service.py` — diseño paralelo abandonado

- [ ] 🟡 `application/auth/aut_service.py` define `AuthService` con método `login()`, pero:
  - El flujo real usa `LoginUser` (use case en `application/services/auth/login_user.py`)
  - `AuthService.login()` nunca es instanciado ni llamado
  - Representa un diseño paralelo abandonado que confunde la lectura del código

### 4.5 Endpoint `/auth/login` recibe `dict` sin validación Pydantic

- [ ] 🟡 `infrastructure/api/routes/auth.py:17` — `async def login(payload: dict)` accede a `payload["email"]` y `payload["password"]` sin validar su existencia.
  - **Síntoma**: `KeyError` si el cliente omite algún campo → 500 en lugar de 422.
  - **Solución**: Crear `LoginRequest(BaseModel)` con `email: EmailStr` y `password: str`.

### 4.6 `AuthRepositorySQL` instanciado fuera de la función factory

- [ ] 🟡 `infrastructure/api/routes/auth.py:9` — `auth_repository = AuthRepositorySQL()` se instancia a nivel de módulo, fuera de `get_auth_router()`. Esto impide inyección de dependencias real y hace la inicialización estática.

---

## BLOQUE 5 — Base de datos incompleta

### 5.1 Schema SQL — solo existe tabla `products` básica

- [ ] 🔴 `infra/docker/postgres/init.sql` — Solo crea tabla `products` con 3 columnas básicas (sin `tenant_id`, sin UUID). Faltan todas las tablas del dominio:
  - [ ] `tenants` (id UUID, name, is_active, created_at)
  - [ ] `users` (id UUID, tenant_id, username, email, password_hash, authority_level, is_active)
  - [ ] `roles` (id UUID, tenant_id, name, description)
  - [ ] `user_roles` (id UUID, user_id, role_id, assigned_at)
  - [ ] `products` — reemplazar por versión con UUID y tenant_id
  - [ ] `inventory_movements` (id UUID, tenant_id, product_id, movement_type, quantity, reason, created_by)
  - [ ] `audit_logs` (id UUID, tenant_id, actor_user_id, event_type, entity, entity_id, action, payload JSONB)
  - [ ] `permissions` (id UUID, tenant_id, name)
  - [ ] Índices en `tenant_id`, `created_at`, `product_id`, `user_id`

### 5.2 `AuthRepositorySQL` — usuario hardcodeado

- [ ] 🟡 `infrastructure/persistence/auth_repository_sql.py:31-38` — Solo acepta `admin@brixo.local` con hash bcrypt hardcodeado en el código fuente. Ningún usuario real puede autenticarse.
  - **Bloqueante**: Hasta que exista tabla `users` con datos reales.

### 5.3 `AccessRepositoryImpl` — roles y permisos hardcodeados

- [ ] 🟡 `infrastructure/persistence/access_repository_impl.py:6-18` — Retorna siempre `["ADMIN", "USER"]` sin consultar BD.
  - **Bloqueante**: Hasta que existan tablas `roles`, `user_roles`, `permissions`.

---

## BLOQUE 6 — Logging y auditoría incompleta

### 6.1 `handle_user_logged_in` crea LogEntry pero no la persiste

- [ ] 🟡 `application/handlers.py:36` — Crea un objeto `LogEntry` en memoria pero nunca lo guarda en BD, Redis ni ningún destino permanente.
  - **Consecuencia**: La auditoría de logins no se registra.
  - **Requiere**: `AuditLogRepositorySQL` implementado e inyectado en el handler.

### 6.2 `get_logger()` reinicia handlers en cada llamada

- [ ] 🟢 `infrastructure/logging.py` — Cada llamada a `get_logger()` ejecuta `logger.handlers = []` y agrega uno nuevo. Es ineficiente y el estado del logger se reinicia.
  - **Solución**: Verificar `if not logger.handlers` antes de agregar.

---

## BLOQUE 7 — Frontend

### 7.1 App.jsx — solo placeholder

- [ ] 🔴 `frontend/src/App.jsx` — Solo contiene `<h1>Brixo</h1>`. No existe ningún componente real.
  - [ ] `LoginPage` — formulario email/password, manejo de token JWT en localStorage
  - [ ] `ProductListPage` — tabla con stock actual
  - [ ] `ProductFormModal` — crear producto
  - [ ] `MovementFormModal` — registrar entrada/salida/ajuste
  - [ ] `DashboardPage` — resumen de stock con alertas de mínimo
  - [ ] `AuditLogPage` — historial de cambios con filtros

### 7.2 Sin cliente HTTP ni state management

- [ ] 🔴 No existen `src/services/` (cliente axios), `src/stores/` (Zustand), `src/hooks/` ni `src/pages/`.
  - **Dependencias faltantes en package.json**: `axios`, `react-router-dom`, `zustand`.

---

## BLOQUE 8 — Seguridad

### 8.1 JWT middleware no permite acceso a rutas públicas

- [ ] 🟢 `infrastructure/security/jwt_middleware.py:28-29` — Solo omite `/auth/login`. Las rutas `/docs`, `/openapi.json`, `/redoc` y `/health` requieren token actualmente.
  - **Consecuencia**: Swagger UI inaccesible sin token. Health check también bloqueado.
  - **Solución**: Agregar lista `PUBLIC_PATHS` configurable.

### 8.2 Sin rate limiting en endpoint de login

- [ ] 🟢 `infrastructure/api/routes/auth.py` — No hay protección contra fuerza bruta en el endpoint de login.

---

## TABLA RESUMEN — Prioridad de ejecución

| # | Ítem | Archivo | Criticidad | Bloquea |
| --- | --- | --- | --- | --- |
| 1 | EventBus no ejecuta handlers async | event_bus.py | 🔴 | Snapshot Redis, auditoría |
| 2 | decode() truncado en jwt_service | jwt_service.py | 🔴 | Autenticación segura |
| 3 | Schema SQL completo (8 tablas) | init.sql | 🔴 | Todo el CRUD |
| 4 | Pool de conexiones PostgreSQL | database.py (nuevo) | 🔴 | Repositorios reales |
| 5 | Repositorios reales (reemplazar stubs) | adapters/ | 🔴 | Casos de uso reales |
| 6 | Casos de uso de inventario | application/use_cases/ | 🔴 | API de productos |
| 7 | TTL incorrecto en aut_service | aut_service.py | 🔴 | Expiración de tokens |
| 8 | Endpoints de productos e inventario | infrastructure/api/routes/ | 🔴 | Frontend |
| 9 | Módulo domain/events.py duplicado | domain/events.py | 🟡 | Imports ambiguos |
| 10 | Typo Tenat → Tenant | contracts.py | 🟡 | Imports futuros |
| 11 | access_repository.py sin ABC | ports/access_repository.py | 🟡 | Contrato de interfaz |
| 12 | LoginRequest con Pydantic | routes/auth.py | 🟡 | Validación de entrada |
| 13 | handle_user_logged_in sin persistencia | handlers.py | 🟡 | Auditoría real |
| 14 | Archivo aut_service.py huérfano | auth/aut_service.py | 🟡 | Confusión arquitectural |
| 15 | JWT middleware sin rutas públicas | jwt_middleware.py | 🟢 | Swagger accesible |
| 16 | Frontend completo | frontend/src/ | 🔴 | UI del usuario |

---

## Estado de componentes (diagnóstico real)

```text
main.py                    ████████░░  Funcional pero bloquea event loop en startup
domain/contracts.py        █████████░  Typo Tenat, bien estructurado
domain/events/             ████████░░  Duplicado con events.py, typo ocurred_at
domain/logs.py             ██████████  100%
application/event_bus      ████████░░  Funcional pero no maneja async handlers
application/handlers       ██████░░░░  Existe, auditoría no persiste
application/use_cases      ░░░░░░░░░░  0% — ninguno implementado
application/ports/auth     ██████████  100% — interfaz correcta con ABC
application/ports/access   ██████░░░░  Sin ABC, patrón incorrecto
infrastructure/settings    ██████████  100%
infrastructure/jwt_service ████████░░  decode() incompleto/truncado
infrastructure/jwt_mw      █████████░  Bien, falta lista de rutas públicas
infrastructure/redis       ██████████  100%
infrastructure/logging     ████████░░  Funcional, problema con handlers reinicio
infrastructure/auth_repo   ██░░░░░░░░  Solo mock hardcodeado
infrastructure/access_repo ██░░░░░░░░  Solo mock hardcodeado
infrastructure/projection  ████████░░  Completo pero async no ejecuta en EventBus
infrastructure/routes      ████████░░  auth y access OK, sin validación Pydantic
adapters/                  ░░░░░░░░░░  0% — directorio vacío
mappers/                   ░░░░░░░░░░  0% — directorio vacío
database.py                ░░░░░░░░░░  0% — no existe
init.sql                   ██░░░░░░░░  10% — solo tabla products básica
frontend/src/              █░░░░░░░░░  5% — solo placeholder
```

---

## Próximos pasos sugeridos (orden óptimo)

### Semana 1 — Corregir bugs activos y completar infra

1. Corregir bugs del Bloque 1 (EventBus async, decode() truncado, TTL, rutas públicas)
2. Completar schema SQL — Bloque 5.1
3. Crear `infrastructure/database.py` con pool psycopg2

### Semana 2 — Data layer y casos de uso

1. Implementar repositorios reales en `adapters/repositories/`
2. Crear casos de uso de inventario — Bloque 3.5
3. Crear DTOs y validación Pydantic — Bloque 4.5

### Semana 3 — API y frontend

1. Endpoints de productos, movimientos, usuarios, auditoría
2. Frontend: componentes mínimos para flujo completo
3. Cleanup: typos, archivos huérfanos, duplicados — Bloques 2 y 4
