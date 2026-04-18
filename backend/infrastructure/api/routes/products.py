from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, Field

from adapters.repositories.product_repository_sql import ProductRepositorySQL
from adapters.repositories.inventory_movement_repository_sql import InventoryMovementRepositorySQL
from application.use_cases.create_product import CreateProductCommand, CreateProductUseCase
from application.use_cases.get_product_stock import GetProductStockQuery, GetProductStockUseCase
from application.use_cases.register_inventory_movement import (
    RegisterInventoryMovementCommand,
    RegisterInventoryMovementUseCase,
)
from application.event_bus import EventBus
from infrastructure.security.permissions import require_permission


# ─── DTOs ────────────────────────────────────────────────────────────────────

class CreateProductRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    initial_stock: int = Field(default=0, ge=0)
    minimum_stock: int = Field(default=0, ge=0)


class ProductResponse(BaseModel):
    id: str
    tenant_id: str
    name: str
    description: str | None
    current_stock: int
    minimum_stock: int
    is_active: bool


class RegisterMovementRequest(BaseModel):
    movement_type: str = Field(..., pattern="^(ENTRADA|SALIDA|AJUSTE)$")
    quantity: int = Field(..., gt=0)
    reason: str | None = None


class MovementResponse(BaseModel):
    id: str
    product_id: str
    movement_type: str
    quantity: int
    reason: str | None
    created_by: str


# ─── Factory ─────────────────────────────────────────────────────────────────

def create_product_router(event_bus: EventBus) -> APIRouter:
    router = APIRouter(prefix="/products", tags=["products"])

    product_repo = ProductRepositorySQL()
    movement_repo = InventoryMovementRepositorySQL()

    create_product_uc = CreateProductUseCase(product_repo, event_bus)
    get_stock_uc = GetProductStockUseCase(product_repo)
    register_movement_uc = RegisterInventoryMovementUseCase(product_repo, movement_repo, event_bus)

    @router.get("/", response_model=list[ProductResponse], dependencies=[require_permission("INVENTORY_READ")])
    async def list_products(request: Request):
        tenant_id: str = request.state.tenant_id
        products = product_repo.list_active_products_by_tenant(tenant_id)
        return [ProductResponse(**p.__dict__) for p in products]

    @router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED, dependencies=[require_permission("INVENTORY_WRITE")])
    async def create_product(payload: CreateProductRequest, request: Request):
        tenant_id: str = request.state.tenant_id
        try:
            product = create_product_uc.execute(
                CreateProductCommand(
                    tenant_id=tenant_id,
                    name=payload.name,
                    description=payload.description,
                    initial_stock=payload.initial_stock,
                    minimum_stock=payload.minimum_stock,
                )
            )
            return ProductResponse(**product.__dict__)
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

    @router.get("/{product_id}", response_model=ProductResponse)
    async def get_product(product_id: str, request: Request):
        tenant_id: str = request.state.tenant_id
        try:
            product = get_stock_uc.execute(GetProductStockQuery(tenant_id, product_id))
            return ProductResponse(**product.__dict__)
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    @router.post("/{product_id}/movements", response_model=MovementResponse, status_code=status.HTTP_201_CREATED, dependencies=[require_permission("INVENTORY_WRITE")])
    async def register_inventory_movement(
        product_id: str, payload: RegisterMovementRequest, request: Request
    ):
        tenant_id: str = request.state.tenant_id
        actor_user_id: str = request.state.user_id
        try:
            movement = register_movement_uc.execute(
                RegisterInventoryMovementCommand(
                    tenant_id=tenant_id,
                    product_id=product_id,
                    movement_type=payload.movement_type,
                    quantity=payload.quantity,
                    reason=payload.reason,
                    actor_user_id=actor_user_id,
                )
            )
            return MovementResponse(**movement.__dict__)
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

    @router.get("/{product_id}/movements", response_model=list[MovementResponse])
    async def list_product_movements(product_id: str, request: Request):
        movements = movement_repo.list_movements_by_product(product_id)
        return [MovementResponse(**m.__dict__) for m in movements]

    return router
