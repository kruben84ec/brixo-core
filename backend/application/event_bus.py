from typing import Type, Callable, Dict, List

from backend.domain.events import DomainEvent
from backend.infrastructure.logging import get_logger
logger = get_logger()


class EventBus:
    
    def __init__(self) -> None:
        self._handlers: Dict[type[DomainEvent], List[Callable]] = {}
        
    def subscribe(self, event_type: Type[DomainEvent], handler: Callable):
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)
        logger.info(f"Subscribed handler {handler} to event {event_type}")
    
    def publish(self, event: DomainEvent):
        for handler in self._handlers.get(type(event), []):
            try:
                handler(event)
                logger.info(f"Handled event {event} with handler {handler}")
            except Exception as e:
                logger.error(f"Error handling event {event} with handler {handler}: {e}")   