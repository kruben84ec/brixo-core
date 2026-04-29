# Flujo de Seguridad (Activo) — 2026-04-29

## Diagrama de Flujo

```
REQUEST
 │
 ▼
CORSMiddleware               ← capa exterior — preflight OPTIONS sin auth
 │
 ▼
JWTAuthMiddleware            ← valida RS256, inyecta user_id + tenant_id
 │                             publica UserAuthenticated en EventBus
 ▼
UserAccessProjection         ← escucha UserAuthenticated
 │                             consulta roles + permisos en BD
 │                             guarda snapshot en Redis: user_access:{tenant}:{user}
 ▼
require_permission(code)     ← lee snapshot de Redis
 │                             lanza 403 si el código no está en permissions[]
 ▼
Handler / Use Case
 │
 ▼
AuditLogRepository           ← persiste cada acción relevante
```

## Componentes Clave

### CORSMiddleware
- Capa exterior del flujo
- Preflight OPTIONS sin requerir autenticación
- Habilitado para localhost:3000

### JWTAuthMiddleware
- Valida tokens RS256
- Inyecta user_id + tenant_id en el contexto
- Publica evento UserAuthenticated en EventBus

### UserAccessProjection
- Escucha eventos UserAuthenticated
- Consulta roles + permisos en base de datos
- Guarda snapshot en Redis con clave: `user_access:{tenant}:{user}`

### require_permission(code)
- FastAPI dependency
- Lee snapshot de Redis
- Lanza 403 (Forbidden) si el código no está en permissions[]

### AuditLogRepository
- Persiste cada acción relevante
- Proporciona trazabilidad completa

## Tokens

- **Algoritmo**: RS256 (RSA Signature with SHA-256)
- **Tipo**: JWT (JSON Web Token)
- **Almacenamiento de permisos**: Redis snapshots por usuario/tenant

## Seguridad Multi-Tenant

Todos los queries filtran por tenant_id para aislar datos entre clientes.
