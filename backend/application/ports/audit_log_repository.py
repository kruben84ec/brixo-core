from abc import ABC, abstractmethod
from domain.logs import LogEntry


class AuditLogRepository(ABC):

    @abstractmethod
    def save_log_entry(self, log_entry: LogEntry) -> None:
        pass

    @abstractmethod
    def list_log_entries_by_tenant(self, tenant_id: str, limit: int = 100) -> list[LogEntry]:
        pass
