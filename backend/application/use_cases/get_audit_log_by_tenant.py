from dataclasses import dataclass, field

from application.ports.audit_log_repository import AuditLogRepository
from domain.logs import LogEntry


@dataclass(frozen=True)
class GetAuditLogQuery:
    tenant_id: str
    limit: int = field(default=100)


class GetAuditLogByTenantUseCase:
    def __init__(self, audit_log_repo: AuditLogRepository):
        self._audit_log_repo = audit_log_repo

    def execute(self, query: GetAuditLogQuery) -> list[LogEntry]:
        if not query.tenant_id:
            raise ValueError("tenant_id es requerido")
        if not (1 <= query.limit <= 1000):
            raise ValueError("El límite debe estar entre 1 y 1000")

        return self._audit_log_repo.list_log_entries_by_tenant(
            query.tenant_id, limit=query.limit
        )
