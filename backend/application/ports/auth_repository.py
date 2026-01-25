from abc import ABC, abstractmethod
from backend.domain.auth.user import User


class AuthRepository(ABC):

    @abstractmethod
    def get_user_by_email(self, email: str) -> User | None:
        pass