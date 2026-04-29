# Convenciones de Código — 2026-04-29

## Nombres de Funciones — Específicos y Descriptivos

### ❌ MAL
```python
def get_data(): ...
def process(): ...
```

### ✅ BIEN
```python
def get_product_current_stock(product_id: UUID) -> int: ...
def register_inventory_entry(product_id: UUID, quantity: int, actor: Actor) -> InventoryMovement: ...
```

## Casos de Uso — Siempre Clase con execute()

```python
class RegisterInventoryEntryUseCase:
    def __init__(self, product_repo: ProductRepository, event_bus: EventBus): ...
    def execute(self, command: RegisterInventoryEntryCommand) -> InventoryMovement: ...
```

## Entidades de Dominio — Dataclasses Inmutables

```python
@dataclass(frozen=True)
class Product:
    id: UUID
    tenant_id: UUID
    name: str
    current_stock: int
```

## Routers FastAPI — Factory Functions

```python
def create_product_router(event_bus: EventBus) -> APIRouter: ...
```

## Principios

- Nombres deben explicar qué hace sin leer el cuerpo
- Sin comentarios obvios — solo WHY cuando no es evidente
- Sin sobre-ingeniería — 3 líneas similares > una abstracción prematura
- Evaluar antes de implementar — señalar problemas arquitecturales primero
