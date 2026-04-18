import logging
import sys
import json
from datetime import datetime, timezone
from typing import Any, Dict


STANDARD_ATTRS = {
    "name", "msg", "args", "levelname", "levelno",
    "pathname", "filename", "module", "exc_info",
    "exc_text", "stack_info", "lineno", "funcName",
    "created", "msecs", "relativeCreated",
    "thread", "threadName", "processName", "process"
}

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log: Dict[str, Any]  = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "service": "brixo-backend",
            "module": record.module,
            "message": record.getMessage(),
        }

        # Captura los extras reales
        extras = {
            k: v for k, v in record.__dict__.items()
            if k not in STANDARD_ATTRS
        }

        if extras:
            log["extra"] = extras

        if record.exc_info:
            log["exception"] = self.formatException(record.exc_info)

        return json.dumps(log)


def get_logger():
    logger = logging.getLogger("brixo")
    logger.setLevel(logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())

    logger.handlers = []
    logger.addHandler(handler)

    return logger
