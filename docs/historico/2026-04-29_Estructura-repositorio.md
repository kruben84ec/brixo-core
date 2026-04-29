# Estructura del Repositorio — 2026-04-29

```
brixo-core/
├── backend/
│   ├── domain/          # Entidades, eventos, contratos — SIN dependencias externas
│   ├── application/     # Casos de uso, event bus, handlers
│   ├── infrastructure/  # BD, Redis, JWT, logging, settings, rutas HTTP
│   ├── adapters/        # Repositorios SQL
│   └── main.py          # Punto de entrada FastAPI
├── frontend/
│   └── src/             # React SPA — Sprint 1-3 completados, MVP funcional
├── infra/
│   ├── docker-compose.yml
│   ├── docker/postgres/init.sql
│   └── env/             # Variables de entorno por servicio (no versionadas)
└── docs/                # Toda la documentación del proyecto
```

## Descripción por Capa

- **backend/domain/**: Entidades, eventos, contratos — SIN dependencias externas
- **backend/application/**: Casos de uso, event bus, handlers
- **backend/infrastructure/**: BD, Redis, JWT, logging, settings, rutas HTTP
- **backend/adapters/**: Repositorios SQL
- **frontend/src/**: React SPA — Sprint 1-3 completados, MVP funcional
- **infra/**: Docker Compose, configuración PostgreSQL, variables de entorno
- **docs/**: Documentación completa del proyecto
