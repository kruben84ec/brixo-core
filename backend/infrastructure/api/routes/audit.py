from datetime import datetime

from fastapi import APIRouter, HTTPException, Query, Request, status
from pydantic import BaseModel

from adapters.repositories.audit_log_repository_sql import AuditLogRepositorySQL
from application.use_cases.get_audit_log_by_tenant import (
    GetAuditLogByTenantUseCase,
    GetAuditLogQuery,
)


# ─── DTOs ────────────────────────────────────────────────────────────────────

class ActorResponse(BaseModel):
    user_id: str
    ip: str | None


class AuditLogEntryResponse(BaseModel):
    id: str
    tenant_id: str
    actor: ActorResponse
    event_type: str
    entity: str
    entity_id: str | None
    action: str
    payload: dict
    occurred_at: datetime


# ─── Factory ─────────────────────────────────────────────────────────────────

def create_audit_router() -> APIRouter:
    router = APIRouter(prefix="/audit", tags=["audit"])

    audit_log_repo = AuditLogRepositorySQL()
    get_audit_log_uc = GetAuditLogByTenantUseCase(audit_log_repo)

    @router.get("/", response_model=list[AuditLogEntryResponse])
    async def list_audit_log(
        request: Request,
        limit: int = Query(default=100, ge=1, le=1000),
    ):
        tenant_id: str = request.state.tenant_id
        try:
            entries = get_audit_log_uc.execute(
                GetAuditLogQuery(tenant_id=tenant_id, limit=limit)
            )
            return [
                AuditLogEntryResponse(
                    id=e.id,
                    tenant_id=e.tenant_id,
                    actor=ActorResponse(user_id=e.actor.user_id, ip=e.actor.ip),
                    event_type=e.event_type.value,
                    entity=e.entity,
                    entity_id=e.entity_id,
                    action=e.action,
                    payload=e.payload,
                    occurred_at=e.occurred_at,
                )
                for e in entries
            ]
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
            )

    return router
