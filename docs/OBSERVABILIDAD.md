# OBSERVABILIDAD — BRIXO BACKEND

**Fecha**: 18 de abril de 2026  
**Estado**: Implementado en `dev` — activo desde sesión 3

---

## RESUMEN EJECUTIVO

Brixo dispone de una capa de observabilidad completa compuesta por tres componentes:

| Componente | Archivo | Propósito |
|------------|---------|-----------|
| Logger estructurado JSON | `infrastructure/logging.py` | Emisión de logs a stdout y archivo rotado |
| Middleware HTTP | `infrastructure/api/middleware/http_logging.py` | Registro de cada request con métricas |
| Exception Handlers | `infrastructure/api/exception_handlers.py` | Separación entre error de usuario y error técnico |

---

## 1. LOGGER ESTRUCTURADO — `infrastructure/logging.py`

### Qué hace

- Emite logs en formato **JSON** hacia dos destinos simultáneamente:
  - **stdout** → visible en `docker logs -f brixo-backend`
  - **archivo rotado** → `backend/logs/app.log` en el host

### Formato de cada línea de log

```json
{
  "timestamp": "2026-04-18T14:32:01.123456+00:00",
  "level": "INFO",
  "service": "brixo-backend",
  "module": "http_logging",
  "message": "http_request",
  "extra": {
    "method": "POST",
    "path": "/api/products/",
    "status_code": 201,
    "duration_ms": 42.7,
    "user_id": "a1b2c3d4-...",
    "tenant_id": "f9e8d7c6-..."
  }
}
```

### Rotación de archivos

| Parámetro | Valor |
|-----------|-------|
| Tamaño máximo por archivo | 10 MB |
| Archivos conservados | 5 (`app.log`, `app.log.1` … `app.log.5`) |
| Encoding | UTF-8 |

### Cómo se persiste en Docker

El bind mount `../backend:/app` ya cubre el directorio de logs:

```
Contenedor Docker          →   Host
/app/logs/app.log          →   backend/logs/app.log
/app/logs/app.log.1        →   backend/logs/app.log.1
```

No se necesita ningún volumen adicional. Los logs sobreviven `docker-compose restart`.

### Variables de entorno que controlan el logger

Definidas en `infra/env/logging.env`:

| Variable | Default | Efecto |
|----------|---------|--------|
| `LOGGING_LEVEL` | `INFO` | Nivel mínimo: `DEBUG`, `INFO`, `WARNING`, `ERROR` |
| `LOGGING_SERVICE_NAME` | `brixo-backend` | Campo `service` en cada línea JSON |
| `LOGGING_JSON_LOGS` | `true` | (reservado para future toggle texto plano) |

### Comandos útiles

```bash
# Ver logs en tiempo real desde Docker
docker logs -f brixo-backend

# Ver solo errores
docker logs brixo-backend 2>&1 | grep '"level":"ERROR"'

# Ver logs del archivo en el host
cat backend/logs/app.log | python -m json.tool

# Filtrar por tenant
grep '"tenant_id":"<UUID>"' backend/logs/app.log
```

---

## 2. MIDDLEWARE HTTP — `infrastructure/api/middleware/http_logging.py`

### Qué registra

Cada request HTTP genera una línea de log con:

| Campo | Descripción |
|-------|-------------|
| `method` | GET, POST, PUT, DELETE… |
| `path` | Ruta sin query string |
| `status_code` | Código de respuesta HTTP |
| `duration_ms` | Tiempo de procesamiento en milisegundos |
| `user_id` | UUID del usuario autenticado (null en 401) |
| `tenant_id` | UUID del tenant (null en 401) |

### Posición en el stack de middlewares

```text
REQUEST ENTRANTE
      │
      ▼
CORSMiddleware          ← outermost — responde preflight OPTIONS sin auth
      │
      ▼
HTTPLoggingMiddleware   ← captura TODOS los requests (incl. 401 y 403)
      │                    lee user_id/tenant_id del estado que JWT dejó
      ▼
JWTAuthMiddleware       ← valida RS256, inyecta user_id + tenant_id
      │                    publica UserAuthenticated en EventBus
      ▼
Handler / Use Case
      │
      ▼
Exception Handlers      ← interceptan errores antes de que suban al middleware
```

### Paths excluidos del log HTTP

Los siguientes paths no se registran para evitar ruido en el archivo:

```
/health   /docs   /redoc   /openapi.json
```

---

## 3. EXCEPTION HANDLERS — `infrastructure/api/exception_handlers.py`

### Filosofía: dos capas, dos audiencias

```
                ┌─────────────────────────────────┐
                │         EXCEPCIÓN                │
                └────────────┬────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │      Exception Handler       │
              └──────┬───────────────┬───────┘
                     │               │
            ┌────────▼──────┐ ┌──────▼──────────────┐
            │  FRONTEND     │ │  LOG TÉCNICO         │
            │  JSON limpio  │ │  stack trace + ctx   │
            │  sin detalles │ │  user_id, tenant_id  │
            └───────────────┘ └─────────────────────┘
```

### Handlers registrados (orden de precedencia)

| Handler | Tipo capturado | Nivel log | Status HTTP |
|---------|---------------|-----------|-------------|
| `brixo_exception_handler` | `BrixoException` y subclases | ERROR | Variable (ver tabla) |
| `validation_exception_handler` | `RequestValidationError` (Pydantic) | WARNING | 422 |
| `http_exception_handler` | `HTTPException` de FastAPI/Starlette | WARNING | Variable |
| `unhandled_exception_handler` | `Exception` (catch-all) | ERROR | 500 |

### Jerarquía de excepciones de dominio — `domain/exceptions.py`

```
BrixoException (base)
├── NotFoundError        → 404  NOT_FOUND
├── UnauthorizedError    → 401  UNAUTHORIZED
├── ForbiddenError       → 403  FORBIDDEN
├── ConflictError        → 409  CONFLICT
├── DomainValidationError→ 422  VALIDATION_ERROR
└── InternalError        → 500  INTERNAL_ERROR
```

### Formato de respuesta al frontend

Todas las respuestas de error siguen el mismo contrato JSON:

```json
{
  "error": "NOT_FOUND",
  "message": "El producto solicitado no existe."
}
```

Para errores de validación Pydantic:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Los datos enviados no son válidos.",
  "fields": [
    { "field": "body.name", "issue": "field required" },
    { "field": "body.price", "issue": "value is not a valid float" }
  ]
}
```

### Cómo lanzar una excepción de dominio desde un use case

```python
from domain.exceptions import NotFoundError, ConflictError

class CreateProductUseCase:
    def execute(self, command: CreateProductCommand) -> Product:
        existing = self._repo.find_by_sku(command.sku, command.tenant_id)
        if existing:
            raise ConflictError(
                message="Ya existe un producto con ese SKU.",
                detail=f"SKU duplicado: {command.sku!r} en tenant {command.tenant_id}",
            )
```

El campo `message` llega al frontend. El campo `detail` va al log técnico y **nunca** se expone al cliente.

---

## 4. COMPONENTES DE SOFTWARE — MAPA COMPLETO

```
backend/
├── domain/
│   ├── exceptions.py              ← jerarquía de excepciones tipadas
│   └── logs.py                    ← entidades de dominio: LogEntry, Actor, LogEventType
│
├── infrastructure/
│   ├── logging.py                 ← get_logger() — JSON a stdout + archivo rotado
│   └── api/
│       ├── middleware/
│       │   └── http_logging.py    ← HTTPLoggingMiddleware — registra cada HTTP request
│       ├── exception_handlers.py  ← 4 handlers globales para FastAPI
│       └── routes/
│           └── audit.py           ← GET /api/audit/ — consulta audit_log en BD
│
├── adapters/
│   └── repositories/
│       └── audit_log_repository_sql.py  ← persiste LogEntry en tabla audit_logs
│
└── main.py                        ← registra middlewares y exception handlers
```

---

## 5. VERIFICACIÓN — CHECKLIST DE ARRANQUE

Después de `docker-compose up -d`, verificar:

```bash
# 1. Logs aparecen en stdout (JSON)
docker logs brixo-backend | head -20

# 2. Archivo de log creado en el host
ls -la backend/logs/app.log

# 3. Request de prueba genera entrada en log
curl http://localhost:8000/health
docker logs brixo-backend | grep "http_request"

# 4. Error 401 queda registrado
curl -H "Authorization: Bearer invalid" http://localhost:8000/api/products/
docker logs brixo-backend | grep '"status_code":401'

# 5. Error de validación tiene formato consistente
curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "not-an-email"}'
# Esperado: {"error":"VALIDATION_ERROR","message":"...","fields":[...]}
```

---

## 6. PENDIENTES Y DEUDA TÉCNICA

| # | Ítem | Fase |
|---|------|------|
| 1 | Añadir `request_id` (UUID por request) en HTTPLoggingMiddleware para correlacionar log de entrada con excepción | Fase 6 |
| 2 | Emitir `request_id` como header de respuesta `X-Request-ID` para que el frontend lo muestre en errores | Fase 6 |
| 3 | Agregar campo `ip` (IP del cliente) al log HTTP para auditoría de seguridad | Fase 6 |
| 4 | Configurar nivel `DEBUG` en dev y `WARNING` en producción vía `LOGGING_LEVEL` | Fase 6 |
| 5 | Integrar con herramienta externa (Loki, Datadog, Sentry) si el proyecto escala | Post-MVP |

---

**Documento generado**: 18 de abril de 2026 (sesión 3)  
**Próxima revisión**: Al completar Fase 6 QA + Hardening
