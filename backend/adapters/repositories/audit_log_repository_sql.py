import json

from application.ports.audit_log_repository import AuditLogRepository
from domain.logs import Actor, LogEntry, LogEventType
from infrastructure.database import get_db_cursor
from infrastructure.logging import get_logger

logger = get_logger()


class AuditLogRepositorySQL(AuditLogRepository):

    def save_log_entry(self, log_entry: LogEntry) -> None:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO audit_logs
                    (id, tenant_id, actor_user_id, actor_ip, event_type,
                     entity, entity_id, action, payload, occurred_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    log_entry.id,
                    log_entry.tenant_id,
                    log_entry.actor.user_id,
                    log_entry.actor.ip,
                    log_entry.event_type.value,
                    log_entry.entity,
                    log_entry.entity_id,
                    log_entry.action,
                    json.dumps(log_entry.payload),
                    log_entry.occurred_at,
                ),
            )

    def list_log_entries_by_tenant(self, tenant_id: str, limit: int = 100) -> list[LogEntry]:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, tenant_id, actor_user_id, actor_ip, event_type,
                       entity, entity_id, action, payload, occurred_at
                FROM audit_logs
                WHERE tenant_id = %s
                ORDER BY occurred_at DESC
                LIMIT %s
                """,
                (tenant_id, limit),
            )
            rows = cursor.fetchall()

        return [self._row_to_log_entry(row) for row in rows]

    @staticmethod
    def _row_to_log_entry(row: tuple) -> LogEntry:
        return LogEntry(
            id=str(row[0]),
            tenant_id=str(row[1]),
            actor=Actor(user_id=str(row[2]), tenant_id=str(row[1]), ip=row[3]),
            event_type=LogEventType(row[4]),
            entity=row[5],
            entity_id=str(row[6]) if row[6] else None,
            action=row[7],
            payload=row[8] if row[8] else {},
            occurred_at=row[9],
        )
