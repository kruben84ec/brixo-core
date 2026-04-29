# Arquitectura — Hexagonal (Puertos y Adaptadores) — 2026-04-29

## Flujo de Dependencias

Siempre hacia adentro:

```
Adapters → Application → Domain
              ↑
        Infrastructure
```

## Matriz de Permisos de Importación

| Capa | Puede importar de |
|------|------------------|
| Domain | Nadie |
| Application | Solo Domain |
| Infrastructure | Domain + Application |
| Adapters | Todas las capas |

## Ejemplos

### ❌ MAL — dominio importa infraestructura
```python
from infrastructure.database import db_session
```

### ✅ BIEN — interfaz en application, implementación en infrastructure
```python
class ProductRepository(ABC):
    @abstractmethod
    def get_by_id(self, product_id: UUID) -> Product: ...
```

## Principios Clave

- Nunca importar infraestructura desde el dominio
- Las interfaces en Application, implementaciones en Infrastructure
- El dominio debe ser completamente independiente de detalles técnicos
