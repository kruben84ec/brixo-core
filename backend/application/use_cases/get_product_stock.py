from dataclasses import dataclass

from application.ports.product_repository import Product, ProductRepository


@dataclass(frozen=True)
class GetProductStockQuery:
    tenant_id: str
    product_id: str


class GetProductStockUseCase:

    def __init__(self, product_repo: ProductRepository):
        self._product_repo = product_repo

    def execute(self, query: GetProductStockQuery) -> Product:
        product = self._product_repo.get_product_by_tenant_and_id(
            query.tenant_id, query.product_id
        )
        if not product:
            raise ValueError(f"Producto no encontrado: {query.product_id}")
        return product
