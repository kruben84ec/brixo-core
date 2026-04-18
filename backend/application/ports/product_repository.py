from abc import ABC, abstractmethod
from uuid import UUID
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Product:
    id: str
    tenant_id: str
    name: str
    description: str | None
    current_stock: int
    minimum_stock: int
    is_active: bool
    created_at: datetime


class ProductRepository(ABC):

    @abstractmethod
    def get_product_by_tenant_and_id(self, tenant_id: str, product_id: str) -> Product | None:
        pass

    @abstractmethod
    def list_active_products_by_tenant(self, tenant_id: str) -> list[Product]:
        pass

    @abstractmethod
    def create_product(
        self,
        tenant_id: str,
        name: str,
        description: str | None,
        initial_stock: int,
        minimum_stock: int,
    ) -> Product:
        pass

    @abstractmethod
    def update_product_stock(self, product_id: str, new_stock: int) -> None:
        pass
