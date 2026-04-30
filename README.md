# Brixo — Inventory Intelligence Platform

> **Real-time stock control today. AI-powered supply chain intelligence tomorrow.**

Brixo is a production-grade, multi-tenant inventory platform engineered for small and medium businesses that need professional control now — and the AI-ready foundation to grow into predictive, autonomous operations.

[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.12-009688?style=flat-square)](https://fastapi.tiangolo.com)
[![Auth](https://img.shields.io/badge/Auth-JWT%20RS256%20%7C%20RBAC-4A90D9?style=flat-square)](#seguridad)
[![Infra](https://img.shields.io/badge/Infra-Docker%20Compose-2496ED?style=flat-square)](https://docs.docker.com/compose)
[![Estado](https://img.shields.io/badge/MVP-Sprint%201--2%20completados-blue?style=flat-square)](docs/ESTATUS.md)

---

## ¿Por qué Brixo?

La mayoría de las pymes gestionan su inventario en hojas de cálculo o herramientas desconectadas. Cada movimiento de stock es información valiosa que se pierde, duplica o llega tarde.

**Brixo convierte cada entrada, salida y ajuste en un evento estructurado** — trazable, auditable, y listo para ser analizado por agentes de inteligencia artificial.

| Hoy | Próximamente |
|-----|--------------|
| Control de stock en tiempo real | Agente de reabastecimiento predictivo |
| Trazabilidad completa por actor | Alertas autónomas de stock bajo |
| RBAC multi-tenant | Análisis de patrones por tenant con LLMs |
| API REST con Swagger interactivo | Integración con modelos de demanda |
| Logs JSON estructurados | Pipeline de datos listo para fine-tuning |

---

## Arquitectura AI-Ready

Brixo está construido sobre **arquitectura hexagonal** (puertos y adaptadores). Esto no es solo buena ingeniería — es la base que hace posible conectar agentes de IA sin tocar el núcleo del negocio:

```text
┌─────────────────────────────────────────────────────┐
│                   AGENTES IA (futuro)                │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ Reabasteci-  │  │  Anomalías   │  │ Demanda   │  │
│  │ miento auto  │  │  de stock    │  │ forecast  │  │
│  └──────┬───────┘  └──────┬───────┘  └─────┬─────┘  │
└─────────┼────────────────┼────────────────┼─────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────┐
│              BRIXO API (FastAPI — activo)            │
│                                                      │
│  EventBus → Eventos estructurados JSON               │
│  AuditLog → Historial inmutable por tenant           │
│  RBAC     → Permisos granulares por operación        │
│  Logs     → JSON estructurado — nativo para LLMs     │
└─────────────────────────────────────────────────────┘
```

Cada evento de negocio — un movimiento de inventario, un cambio de rol, una autenticación fallida — se emite como un objeto inmutable y tipado. Los agentes de IA pueden suscribirse al `EventBus` o consultar el historial de auditoría directamente, sin modificar una línea de lógica de negocio.

---

## Inicio rápido

**Requisitos**: Docker y Docker Compose.

```bash
git clone https://github.com/kruben84ec/brixo-core.git
cd brixo-core/infra
docker-compose up -d
```

```bash
# Verificar que todos los servicios están saludables
curl http://localhost:8000/health
# {"status": "ok", "db": "ok"}
```

| Servicio   | URL                              |
|------------|----------------------------------|
| Frontend   | <http://localhost:3000>          |
| API REST   | <http://localhost:8000>          |
| Swagger UI | <http://localhost:8000/docs>     |
| ReDoc      | <http://localhost:8000/redoc>    |

---

## Stack tecnológico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Backend | Python 3.12 + FastAPI 0.128 | Alto rendimiento async, tipado estricto, OpenAPI nativo |
| Auth | JWT RS256 + RBAC | Firma asimétrica — el agente puede verificar sin conocer la clave privada |
| Base de datos | PostgreSQL 15 | Datos relacionales auditables, soporte para JSON nativo |
| Cache | Redis 7 | Snapshots de permisos en memoria — sub-milisegundo por request |
| Frontend | React 18 + Vite 5 | SPA moderna, lista para dashboards en tiempo real |
| Infra | Docker Compose | Un comando levanta todo el stack, incluidos los healthchecks |
| Logging | JSON estructurado + rotación | Formato nativo para ingestión por LLMs y herramientas de observabilidad |

---

## API — Referencia rápida

Documentación interactiva en **<http://localhost:8000/docs>** (sin autenticación).

**Flujo de autenticación:**

```bash
# 1. Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@brixo.local", "password": "admin123"}'

# 2. Usar el token en requests protegidos
curl http://localhost:8000/api/products/ \
  -H "Authorization: Bearer <access_token>"
```

### Endpoints

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| `POST` | `/api/auth/register` | — | Registro — crea empresa + OWNER + retorna JWT |
| `POST` | `/api/auth/login` | — | Login — retorna JWT RS256 |
| `POST` | `/api/auth/refresh` | auth | Renueva token sin re-login |
| `GET` | `/api/products/` | `INVENTORY_READ` | Lista productos con stock actual |
| `POST` | `/api/products/` | `INVENTORY_WRITE` | Crea producto |
| `GET` | `/api/products/{id}` | `INVENTORY_READ` | Detalle de producto |
| `POST` | `/api/products/{id}/movements` | `INVENTORY_WRITE` | Entrada / salida / ajuste |
| `GET` | `/api/products/{id}/movements` | `INVENTORY_READ` | Historial de movimientos |
| `GET` | `/api/users/` | `USERS_READ` | Lista usuarios del tenant |
| `POST` | `/api/users/` | `USERS_WRITE` | Crea usuario |
| `POST` | `/api/users/{id}/roles` | `ROLES_WRITE` | Asigna rol a usuario |
| `GET` | `/api/audit/` | `AUDIT_READ` | Historial de auditoría |
| `GET` | `/me/access` | auth | Permisos del usuario autenticado |
| `GET` | `/health` | — | Estado del servicio y BD |

---

## Seguridad

Brixo implementa seguridad en capas, sin puntos únicos de fallo:

```text
Request → CORS → HTTPLogging → JWT RS256 → RBAC (Redis) → Handler → AuditLog
```

- **JWT RS256**: firma asimétrica — la clave pública puede distribuirse a agentes sin riesgo.
- **RBAC por snapshot**: permisos cacheados en Redis, evaluados en sub-milisegundo.
- **Auditoría inmutable**: cada acción relevante genera un `LogEntry` en BD — no se edita, no se borra.
- **Multi-tenant nativo**: todo query filtra por `tenant_id` — los datos de un tenant nunca son visibles para otro.

---

## Observabilidad

Cada request HTTP y cada excepción queda registrada en formato JSON estructurado:

```bash
# Ver logs en tiempo real
docker logs -f brixo-backend

# Logs persistidos en el host (rotación automática 10 MB × 5 archivos)
tail -f backend/logs/app.log | python -m json.tool

# Filtrar errores
docker logs brixo-backend 2>&1 | grep '"level":"ERROR"'
```

Las excepciones de dominio devuelven mensajes legibles al frontend y detalles técnicos solo al log — el stack trace nunca se expone al cliente.

---

## Variables de entorno

Los archivos van en `infra/env/` y están en `.gitignore`. Crear uno por servicio antes de levantar:

| Archivo | Variables clave |
|---------|----------------|
| `backend.env` | `DATABASE_URL`, `BACKEND_ENVIRONMENT` |
| `jwt.env` | `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY` (PEM RS256) |
| `redis.env` | `REDIS_URL=redis://redis:6379` |
| `db.env` | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` |
| `logging.env` | `LOGGING_LEVEL=INFO`, `LOGGING_SERVICE_NAME=brixo-backend` |
| `frontend.env` | `VITE_API_URL=http://localhost:8000` |

---

## Estado del proyecto

```text
FASE 1   Infraestructura     ██████████  100%  ✅
FASE 2   Data Access Layer   ██████████  100%  ✅
FASE 3   Casos de uso        ██████████  100%  ✅
FASE 4   API REST + RBAC     ██████████  100%  ✅
FASE 4C  Observabilidad      ██████████  100%  ✅
FASE 5   Frontend MVP        ███████░░░   72%  ← Sprint 1-2 ✅ · Sprint 3 ⭕
FASE 6   QA + Hardening      ░░░░░░░░░░    0%  ← bloqueada
──────────────────────────────────────────────
MVP total                    ████████░░   78%
```

Detalle por fase: [ROADMAP.md](docs/ROADMAP.md) — Estado actual: [ESTATUS.md](docs/ESTATUS.md)

---

## Hoja de ruta hacia IA

```text
MVP v1.0 (Mayo 2026)
└─ Frontend completo + QA + deploy a staging

v1.1 — Inteligencia Básica (Junio 2026)
├─ Alertas de stock bajo por email/webhook
├─ Reportes PDF/CSV exportables
└─ Tests de integración en endpoints críticos

v2.0 — Agentes IA (Julio 2026+)
├─ Agente de reabastecimiento predictivo
│   Analiza historial de movimientos → sugiere órdenes de compra
├─ Detector de anomalías
│   Identifica patrones inusuales en salidas de stock por tenant
├─ Multi-almacén
│   Múltiples ubicaciones físicas por tenant con transferencias
└─ API mobile (React Native)
    Control de inventario desde dispositivos en el almacén
```

---

## Desarrollo local (hot reload)

```bash
# Levantar servicios
cd infra && docker-compose up -d

# Ver logs del backend en tiempo real
docker logs -f brixo-backend

# Acceso directo a la base de datos
docker exec -it brixo-postgres psql -U brixo_user -d brixo

# Swagger interactivo
start http://localhost:8000/docs
```

Los bind mounts están configurados — los cambios en `backend/` y `frontend/src/` se reflejan sin reiniciar contenedores.

---

## Contribuir

1. Crear rama desde `dev`: `git checkout -b feature/nombre`
2. Respetar la arquitectura hexagonal: el dominio nunca importa infraestructura
3. PR hacia `dev` con descripción del cambio y referencia al ítem del ROADMAP
