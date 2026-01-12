import asyncio
from collections import defaultdict
from typing import Type, Callable, Dict, List, Any
from backend.domain.events import DomainEvent
from backend.infrastructure.logging import get_logger

logger = get_logger()


class EventBus:
    def __init__(self):
        self._handlers: Dict[Type[DomainEvent], List[Callable]] = defaultdict(list)

    def subscribe(self, event_type: Type[DomainEvent], handler: Callable):
        self._handlers[event_type].append(handler)
        logger.info(
            "Handler subscribed",
            extra={
                "event": event_type.__name__,
                "handler": handler.__name__,
            },
        )

    async def publish(self, event: DomainEvent):
        handlers = self._handlers.get(type(event), [])

        if not handlers:
            logger.warning(
                "No handlers for event",
                extra={"event": type(event).__name__},
            )
            return

        for handler in handlers:
            try:
                result = handler(event)

                # Si el handler es async, lo await
                if asyncio.iscoroutine(result):
                    await result

            except Exception as e:
                logger.error(
                    "Event handler failed",
                    extra={
                        "event": type(event).__name__,
                        "handler": handler.__name__,
                        "error": str(e),
                    },
                )
