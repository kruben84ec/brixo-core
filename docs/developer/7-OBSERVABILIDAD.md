# OBSERVABILIDAD — Logging y Monitoreo

**Actualizado**: 29 de abril de 2026  
**Estado**: Implementado (Fase 4C)

---

## Componentes

| Componente | Archivo | Propósito |
|-----------|---------|-----------|
| **Logger JSON** | `infrastructure/logging.py` | Emisión a stdout + archivo rotado |
| **Middleware HTTP** | `infrastructure/api/middleware/http_logging.py` | Registro de cada request |
| **Exception Handlers** | `infrastructure/api/exception_handlers.py` | Separación error de usuario vs técnico |

---

## Logger Estructurado JSON

### Formato de Cada Línea

```json
{
  "timestamp": "2026-04-29T14:32:01.123456+00:00",
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

### Rotación de Archivos

| Parámetro | Valor |
|-----------|-------|
| Tamaño máximo | 10 MB |
| Archivos conservados | 5 (`app.log` ... `app.log.4`) |
| Encoding | UTF-8 |

**Persistencia en Docker**: Bind mount `backend:/app` → logs en `backend/logs/app.log` del host.

### Variables de Entorno

| Variable | Default | Efecto |
|----------|---------|--------|
| `LOGGING_LEVEL` | `INFO` | Nivel mínimo: DEBUG, INFO, WARNING, ERROR |
| `LOGGING_SERVICE_NAME` | `brixo-backend` | Campo `service` en cada línea |

---

## Middleware HTTP — Registra Cada Request

### Qué Registra

| Campo | Descripción |
|-------|-------------|
| `method` | GET, POST, PUT, DELETE… |
| `path` | Ruta sin query string |
| `status_code` | Código de respuesta HTTP |
| `duration_ms` | Tiempo de procesamiento |
| `user_id` | UUID del usuario (null en 401) |
| `tenant_id` | UUID del tenant (null en 401) |

### Orden de Middlewares

```
CORSMiddleware → HTTPLoggingMiddleware → JWTAuthMiddleware → Handler
```

**Nota**: HTTPLoggingMiddleware registra TODOS los requests, incluso 401 y 403.

### Paths Excluidos

```
/health, /docs, /redoc, /openapi.json
```

---

## Exception Handlers — Dos Audiencias

```
EXCEPCIÓN
  │
  ▼
Exception Handler
  ├─ FRONTEND: JSON limpio { error, message }
  └─ LOG TÉCNICO: stack trace + contexto
```

### Handlers Registrados

| Handler | Captura | Nivel | Status HTTP |
|---------|---------|-------|-------------|
| `brixo_exception_handler` | BrixoException + subclases | ERROR | Variable |
| `validation_exception_handler` | Pydantic RequestValidationError | WARNING | 422 |
| `http_exception_handler` | HTTPException | WARNING | Variable |
| `unhandled_exception_handler` | Exception (catch-all) | ERROR | 500 |

### Jerarquía de Excepciones de Dominio

```
BrixoException
├── NotFoundError              → 404 NOT_FOUND
├── UnauthorizedError          → 401 UNAUTHORIZED
├── ForbiddenError             → 403 FORBIDDEN
├── ConflictError              → 409 CONFLICT
├── DomainValidationError      → 422 UNPROCESSABLE_ENTITY
└── InternalError              → 500 INTERNAL_SERVER_ERROR
```

### Formato de Respuesta al Cliente

```json
{
  "error": "NOT_FOUND",
  "message": "El producto solicitado no existe."
}
```

**Para Pydantic errors**:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Los datos enviados no son válidos.",
  "fields": [
    { "field": "body.name", "issue": "field required" }
  ]
}
```

---

## Cómo Lanzar Excepciones de Dominio

```python
from domain.exceptions import ConflictError

class CreateProductUseCase:
    def execute(self, command: CreateProductCommand) -> Product:
        existing = self._repo.find_by_sku(command.sku, command.tenant_id)
        if existing:
            raise ConflictError(
                message="Ya existe un producto con ese SKU.",
                detail=f"SKU={command.sku!r} en tenant={command.tenant_id}"
            )
```

**Regla**: `message` llega al cliente, `detail` va al log técnico (nunca al cliente).

---

## Comandos Útiles

```bash
# Ver logs en tiempo real
docker logs -f brixo-backend

# Ver solo errores
docker logs brixo-backend 2>&1 | grep '"level":"ERROR"'

# Ver logs del archivo en el host
cat backend/logs/app.log | python -m json.tool

# Filtrar por tenant
grep '"tenant_id":"<UUID>"' backend/logs/app.log

# Filtrar por user
grep '"user_id":"<UUID>"' backend/logs/app.log

# Buscar por endpoint
grep '"/api/products' backend/logs/app.log
```

---

## Pendientes — Fase 6

| # | Ítem | Impacto |
|---|------|--------|
| 1 | `request_id` (UUID por request) — correlacionar entrada con excepción | HIGH |
| 2 | Header `X-Request-ID` en respuesta — mostrar en errores frontend | HIGH |
| 3 | Campo `ip` (IP del cliente) en log HTTP — auditoría de seguridad | MEDIUM |
| 4 | Nivel DEBUG en dev, WARNING en prod vía `LOGGING_LEVEL` | MEDIUM |
| 5 | Integración con Loki, Datadog, Sentry si el proyecto escala | LOW |

---

**Documento mantenido por**: Equipo Brixo  
**Última actualización**: 29 de abril de 2026
