import json
import logging
import os
import sys
from datetime import datetime, timezone
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Any, Dict


STANDARD_ATTRS = {
    "name", "msg", "args", "levelname", "levelno",
    "pathname", "filename", "module", "exc_info",
    "exc_text", "stack_info", "lineno", "funcName",
    "created", "msecs", "relativeCreated",
    "thread", "threadName", "processName", "process",
    "message", "taskName",
}

_LOG_DIR = Path("/app/logs")
_LOG_FILE = _LOG_DIR / "app.log"
_MAX_BYTES = 10 * 1024 * 1024  # 10 MB por archivo
_BACKUP_COUNT = 5               # conserva hasta 5 archivos rotados


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "service": os.getenv("LOGGING_SERVICE_NAME", "brixo-backend"),
            "module": record.module,
            "message": record.getMessage(),
        }

        extras = {
            k: v for k, v in record.__dict__.items()
            if k not in STANDARD_ATTRS
        }
        if extras:
            log["extra"] = extras

        if record.exc_info:
            log["exception"] = self.formatException(record.exc_info)

        return json.dumps(log, default=str)


def get_logger() -> logging.Logger:
    logger = logging.getLogger("brixo")

    if logger.handlers:
        return logger

    level_name = os.getenv("LOGGING_LEVEL", "INFO").upper()
    level = getattr(logging, level_name, logging.INFO)
    logger.setLevel(level)
    logger.propagate = False

    formatter = JsonFormatter()

    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setFormatter(formatter)
    logger.addHandler(stdout_handler)

    try:
        _LOG_DIR.mkdir(parents=True, exist_ok=True)
        file_handler = RotatingFileHandler(
            _LOG_FILE,
            maxBytes=_MAX_BYTES,
            backupCount=_BACKUP_COUNT,
            encoding="utf-8",
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except OSError as e:
        logger.warning(
            "File logging disabled — could not open log file",
            extra={"path": str(_LOG_FILE), "reason": str(e)},
        )

    return logger
