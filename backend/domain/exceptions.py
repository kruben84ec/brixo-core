class BrixoException(Exception):
    """
    Base de todas las excepciones de dominio de Brixo.

    - message  → texto legible que se envía al frontend
    - detail   → contexto técnico que va al log (nunca expuesto al cliente)
    """
    status_code: int = 500
    error_code: str = "INTERNAL_ERROR"

    def __init__(self, message: str, detail: str | None = None) -> None:
        self.message = message
        self.detail = detail
        super().__init__(message)


class NotFoundError(BrixoException):
    status_code = 404
    error_code = "NOT_FOUND"


class UnauthorizedError(BrixoException):
    status_code = 401
    error_code = "UNAUTHORIZED"


class ForbiddenError(BrixoException):
    status_code = 403
    error_code = "FORBIDDEN"


class ConflictError(BrixoException):
    status_code = 409
    error_code = "CONFLICT"


class DomainValidationError(BrixoException):
    status_code = 422
    error_code = "VALIDATION_ERROR"


class InternalError(BrixoException):
    status_code = 500
    error_code = "INTERNAL_ERROR"
