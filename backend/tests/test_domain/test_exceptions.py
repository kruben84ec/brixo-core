"""
Tests para domain/exceptions.py
Valida que las excepciones tengan los códigos y status HTTP correctos.
"""

import pytest

from domain.exceptions import (
    BrixoException,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    DomainValidationError,
    InternalError,
)


class TestBrixoException:
    """Tests para la excepción base BrixoException."""

    def test_exception_with_message_only(self):
        """Debe crear excepción solo con mensaje."""
        exc = BrixoException(message="Test error")
        assert exc.message == "Test error"
        assert exc.detail is None
        assert exc.status_code == 500
        assert exc.error_code == "INTERNAL_ERROR"

    def test_exception_with_detail(self):
        """Debe crear excepción con mensaje y detalle."""
        exc = BrixoException(
            message="User not found",
            detail="Email: user@test.com does not exist"
        )
        assert exc.message == "User not found"
        assert exc.detail == "Email: user@test.com does not exist"

    def test_exception_is_exception(self):
        """Debe ser instancia de Exception."""
        exc = BrixoException(message="Test")
        assert isinstance(exc, Exception)


class TestNotFoundError:
    """Tests para NotFoundError."""

    def test_not_found_error_status_code(self):
        """Debe tener status code 404."""
        exc = NotFoundError(message="User not found")
        assert exc.status_code == 404
        assert exc.error_code == "NOT_FOUND"

    def test_not_found_error_creation(self):
        """Debe crear error con mensaje y detail."""
        exc = NotFoundError(
            message="Resource not found",
            detail="ID: 123 does not exist"
        )
        assert exc.message == "Resource not found"
        assert exc.detail == "ID: 123 does not exist"


class TestUnauthorizedError:
    """Tests para UnauthorizedError."""

    def test_unauthorized_error_status_code(self):
        """Debe tener status code 401."""
        exc = UnauthorizedError(message="Invalid credentials")
        assert exc.status_code == 401
        assert exc.error_code == "UNAUTHORIZED"

    def test_unauthorized_error_creation(self):
        """Debe crear error con mensaje."""
        exc = UnauthorizedError(
            message="Invalid token",
            detail="Token expired"
        )
        assert exc.message == "Invalid token"
        assert exc.detail == "Token expired"


class TestForbiddenError:
    """Tests para ForbiddenError."""

    def test_forbidden_error_status_code(self):
        """Debe tener status code 403."""
        exc = ForbiddenError(message="Access denied")
        assert exc.status_code == 403
        assert exc.error_code == "FORBIDDEN"

    def test_forbidden_error_creation(self):
        """Debe crear error con mensaje."""
        exc = ForbiddenError(
            message="Insufficient permissions",
            detail="User requires ADMIN role"
        )
        assert exc.message == "Insufficient permissions"
        assert exc.detail == "User requires ADMIN role"


class TestConflictError:
    """Tests para ConflictError."""

    def test_conflict_error_status_code(self):
        """Debe tener status code 409."""
        exc = ConflictError(message="Conflict")
        assert exc.status_code == 409
        assert exc.error_code == "CONFLICT"

    def test_conflict_error_creation(self):
        """Debe crear error con mensaje."""
        exc = ConflictError(
            message="Email already exists",
            detail="user@test.com is already registered"
        )
        assert exc.message == "Email already exists"
        assert exc.detail == "user@test.com is already registered"


class TestDomainValidationError:
    """Tests para DomainValidationError."""

    def test_validation_error_status_code(self):
        """Debe tener status code 422."""
        exc = DomainValidationError(message="Invalid input")
        assert exc.status_code == 422
        assert exc.error_code == "VALIDATION_ERROR"

    def test_validation_error_creation(self):
        """Debe crear error con mensaje."""
        exc = DomainValidationError(
            message="Password too short",
            detail="Minimum length is 8 characters"
        )
        assert exc.message == "Password too short"
        assert exc.detail == "Minimum length is 8 characters"


class TestInternalError:
    """Tests para InternalError."""

    def test_internal_error_status_code(self):
        """Debe tener status code 500."""
        exc = InternalError(message="Internal error")
        assert exc.status_code == 500
        assert exc.error_code == "INTERNAL_ERROR"

    def test_internal_error_creation(self):
        """Debe crear error con mensaje."""
        exc = InternalError(
            message="Database connection failed",
            detail="Failed to connect to PostgreSQL"
        )
        assert exc.message == "Database connection failed"
        assert exc.detail == "Failed to connect to PostgreSQL"


class TestExceptionHierarchy:
    """Tests para la jerarquía de excepciones."""

    def test_all_exceptions_inherit_from_brixo(self):
        """Todas las excepciones deben heredar de BrixoException."""
        exceptions = [
            NotFoundError("test"),
            UnauthorizedError("test"),
            ForbiddenError("test"),
            ConflictError("test"),
            DomainValidationError("test"),
            InternalError("test"),
        ]

        for exc in exceptions:
            assert isinstance(exc, BrixoException)
            assert isinstance(exc, Exception)

    def test_exception_attributes(self):
        """Cada excepción debe tener status_code y error_code."""
        exceptions_info = [
            (NotFoundError("test"), 404, "NOT_FOUND"),
            (UnauthorizedError("test"), 401, "UNAUTHORIZED"),
            (ForbiddenError("test"), 403, "FORBIDDEN"),
            (ConflictError("test"), 409, "CONFLICT"),
            (DomainValidationError("test"), 422, "VALIDATION_ERROR"),
            (InternalError("test"), 500, "INTERNAL_ERROR"),
        ]

        for exc, expected_code, expected_error in exceptions_info:
            assert exc.status_code == expected_code
            assert exc.error_code == expected_error
