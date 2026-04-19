# Brixo — Control de Inventario

Sistema web de control de inventario para pequeños negocios y pymes. Permite registrar productos, entradas, salidas y consultar el historial completo de movimientos con trazabilidad de actores.

**No es** un ERP ni sistema contable. **Es** control de stock: qué tengo, qué se movió, quién lo hizo.

---

## Stack

| Capa | Tecnología |
| --- | --- |
| Backend | Python 3.12, FastAPI, PostgreSQL 15, Redis 7 |
| Frontend | React 18, Vite 5 |
| Auth | JWT RS256, RBAC por permisos |
| Infra | Docker Compose |

---

## Inicio rápido

**Requisitos**: Docker y Docker Compose.

```bash
git clone https://github.com/kruben84ec/brixo-core.git
cd brixo-core/infra
docker-compose up -d
```

| Servicio   | URL                                     |
| ---------- | --------------------------------------- |
| Frontend   | <http://localhost:3000>                 |
| API        | <http://localhost:8000>                 |
| Swagger UI | <http://localhost:8000/docs>            |
| ReDoc      | <http://localhost:8000/redoc>           |

```bash
# Verificar que levantó
curl http://localhost:8000/health
# {"status": "ok", "db": "ok"}
```

---

## Desarrollo (hot reload)

El docker-compose está configurado con bind mounts. Los cambios en código se reflejan sin reiniciar contenedores:

- **Backend**: uvicorn `--reload` + watchfiles detecta cambios en `backend/`
- **Frontend**: Vite HMR detecta cambios en `frontend/src/`

```bash
docker logs -f brixo-backend
docker logs -f brixo-frontend
```

---

## Variables de entorno

Los archivos van en `infra/env/` y **no se versionan** (`.gitignore`). Crear uno por servicio antes de levantar:

| Archivo        | Variables clave                                    |
| -------------- | -------------------------------------------------- |
| `backend.env`  | `DATABASE_URL`, `BACKEND_ENVIRONMENT`              |
| `jwt.env`      | `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY` (PEM RS256)    |
| `redis.env`    | `REDIS_URL=redis://redis:6379`                     |
| `db.env`       | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`|
| `frontend.env` | `VITE_API_URL=http://localhost:8000`               |
| `logging.env`  | `LOGGING_LEVEL`, `LOGGING_JSON_LOGS`               |

---

## API — Documentación interactiva

Disponible en **<http://localhost:8000/docs>** (Swagger UI) sin autenticación.

Para probar endpoints protegidos:

1. `POST /api/auth/login` → copiar `access_token`
2. Clic en **Authorize** en Swagger → pegar el token

### Endpoints principales

| Método | Ruta                           | Permiso requerido  | Descripción                          |
| ------ | ------------------------------ | ------------------ | ------------------------------------ |
| POST   | `/api/auth/login`              | —                  | Login, retorna JWT                   |
| POST   | `/api/auth/refresh`            | auth               | Renueva token sin re-login           |
| GET    | `/api/products/`               | `INVENTORY_READ`   | Lista productos con stock actual     |
| POST   | `/api/products/`               | `INVENTORY_WRITE`  | Crea producto                        |
| POST   | `/api/products/{id}/movements` | `INVENTORY_WRITE`  | Registra entrada / salida / ajuste   |
| GET    | `/api/users/`                  | `USERS_READ`       | Lista usuarios del tenant            |
| POST   | `/api/users/`                  | `USERS_WRITE`      | Crea usuario                         |
| POST   | `/api/users/{id}/roles`        | `ROLES_WRITE`      | Asigna rol a usuario                 |
| GET    | `/api/audit/`                  | `AUDIT_READ`       | Historial de auditoría               |
| GET    | `/me/access`                   | auth               | Roles y permisos del usuario actual  |
| GET    | `/health`                      | —                  | Estado del servicio y BD             |

---

## Arquitectura

Hexagonal (puertos y adaptadores). Las dependencias apuntan siempre hacia el dominio:

```
Adapters → Application → Domain
               ↑
         Infrastructure
```

```
backend/
├── domain/          # Entidades y eventos — sin dependencias externas
├── application/     # Casos de uso, EventBus, handlers
├── infrastructure/  # BD, Redis, JWT, settings, rutas HTTP
├── adapters/        # Repositorios SQL
└── main.py
```

### Roles y permisos (RBAC)

Los permisos se evalúan en cada request leyendo el snapshot Redis del usuario (`user_access:{tenant_id}:{user_id}`).

| Permiso | Qué permite |
| --- | --- |
| `INVENTORY_READ` | Ver productos y stock |
| `INVENTORY_WRITE` | Crear productos y registrar movimientos |
| `USERS_READ` | Ver usuarios del tenant |
| `USERS_WRITE` | Crear usuarios |
| `ROLES_WRITE` | Asignar roles a usuarios |
| `AUDIT_READ` | Ver historial de auditoría |

---

## Estado del proyecto

```
Backend   ██████████  100%
Frontend  █░░░░░░░░░    5%  ← en curso
MVP total ████████░░   77%
```

Detalle por fase: [`docs/ROADMAP.md`](docs/ROADMAP.md) — Estado actual: [`docs/ESTATUS.md`](docs/ESTATUS.md)

---

## Contribuir

1. Rama desde `dev`: `git checkout -b feature/nombre`
2. El dominio nunca importa infraestructura
3. PR hacia `dev` con descripción del cambio
