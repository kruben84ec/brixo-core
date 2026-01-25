# backend/application/event_bus.py

from typing import Type, Callable, Dict, List
from abc import ABC, abstractmethod

from backend.domain.events import DomainEvent


class EventBus(ABC):
    """
    Contrato del EventBus.
    Define cómo se publican eventos de dominio
    y cómo se suscriben los handlers.
    """

    @abstractmethod
    def subscribe(
        self,
        event_type: Type[DomainEvent],
        handler: Callable[[DomainEvent], None]
    ) -> None:
        """
        Registra un handler para un tipo de evento.
        """
        raise NotImplementedError

    @abstractmethod
    def publish(self, event: DomainEvent) -> None:
        """
        Publica un evento para que sea procesado
        por todos los handlers suscritos.
        """
        raise NotImplementedError
