from dataclasses import dataclass

from application.ports.product_repository import Product, ProductRepository
from application.event_bus import EventBus


@dataclass(frozen=True)
class CreateProductCommand:
    tenant_id: str
    name: str
    description: str | None
    initial_stock: int
    minimum_stock: int


class CreateProductUseCase:

    def __init__(self, product_repo: ProductRepository, event_bus: EventBus):
        self._product_repo = product_repo
        self._event_bus = event_bus

    def execute(self, command: CreateProductCommand) -> Product:
        if command.initial_stock < 0:
            raise ValueError("El stock inicial no puede ser negativo")
        if not command.name or not command.name.strip():
            raise ValueError("El nombre del producto no puede estar vacío")

        return self._product_repo.create_product(
            tenant_id=command.tenant_id,
            name=command.name.strip(),
            description=command.description,
            initial_stock=command.initial_stock,
            minimum_stock=command.minimum_stock,
        )
