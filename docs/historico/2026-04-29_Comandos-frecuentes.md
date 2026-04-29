# Comandos Frecuentes — 2026-04-29

## Levantar Todos los Servicios
```bash
cd infra && docker-compose up -d
```

## Ver Logs del Backend
```bash
docker logs -f brixo-backend
```

## Verificar que Levantó
```bash
curl http://localhost:8000/health
```

## Acceso Directo a la BD
```bash
docker exec -it brixo-postgres psql -U brixo_user -d brixo
```

## Swagger UI
```bash
start http://localhost:8000/docs
```

## Frontend
```bash
start http://localhost:3000
```

## Notas

- Usar desde la raíz del proyecto
- Docker debe estar corriendo
- Los servicios tienen healthchecks configurados
