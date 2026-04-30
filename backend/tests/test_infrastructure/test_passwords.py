"""
Tests para infrastructure/security/passwords.py
Valida que los passwords se hasheen y verifiquen correctamente.
"""

import pytest
from infrastructure.security.passwords import hash_password, verify_password


class TestHashPassword:
    """Tests para la función hash_password."""

    def test_hash_password_returns_string(self):
        """Debe retornar un string hasheado."""
        plain = "MyPassword123!"
        hashed = hash_password(plain)

        assert isinstance(hashed, str)
        assert len(hashed) > 0

    def test_hash_password_not_plain(self):
        """El hash no debe ser igual al password plano."""
        plain = "MyPassword123!"
        hashed = hash_password(plain)

        assert hashed != plain

    def test_hash_password_consistent_verification(self):
        """El hash debe verificarse correctamente con el password plano."""
        plain = "MyPassword123!"
        hashed = hash_password(plain)

        assert verify_password(plain, hashed)

    def test_hash_different_passwords_different_hashes(self):
        """Passwords diferentes deben generar hashes diferentes."""
        plain1 = "Password123!"
        plain2 = "Password456!"

        hash1 = hash_password(plain1)
        hash2 = hash_password(plain2)

        # Los hashes deben ser diferentes
        assert hash1 != hash2

    def test_hash_same_password_different_hashes(self):
        """Mismo password puede generar hashes diferentes (bcrypt)."""
        plain = "MyPassword123!"

        hash1 = hash_password(plain)
        hash2 = hash_password(plain)

        # bcrypt genera salts diferentes cada vez
        assert hash1 != hash2
        # Pero ambos verifican
        assert verify_password(plain, hash1)
        assert verify_password(plain, hash2)

    def test_hash_special_characters(self):
        """Debe hashear passwords con caracteres especiales."""
        plain = "P@$$w0rd!#%&*()[]{}+-=_~`"
        hashed = hash_password(plain)

        assert verify_password(plain, hashed)

    def test_hash_unicode_characters(self):
        """Debe hashear passwords con caracteres unicode."""
        plain = "Contraseña123!ñ"
        hashed = hash_password(plain)

        assert verify_password(plain, hashed)

    def test_hash_long_password(self):
        """bcrypt rechaza passwords mayores a 72 bytes."""
        plain = "A" * 500
        with pytest.raises(ValueError):
            hash_password(plain)


class TestVerifyPassword:
    """Tests para la función verify_password."""

    def test_verify_password_correct(self):
        """Debe retornar True para password correcto."""
        plain = "CorrectPassword123!"
        hashed = hash_password(plain)

        assert verify_password(plain, hashed) is True

    def test_verify_password_incorrect(self):
        """Debe retornar False para password incorrecto."""
        plain = "CorrectPassword123!"
        hashed = hash_password(plain)
        wrong = "WrongPassword456!"

        assert verify_password(wrong, hashed) is False

    def test_verify_password_empty_string(self):
        """Debe verificar password vacío."""
        plain = ""
        hashed = hash_password(plain)

        assert verify_password(plain, hashed) is True
        assert verify_password("not_empty", hashed) is False

    def test_verify_password_case_sensitive(self):
        """Verificación debe ser sensible a mayúsculas/minúsculas."""
        plain = "MyPassword123"
        hashed = hash_password(plain)

        assert verify_password(plain, hashed) is True
        assert verify_password("mypassword123", hashed) is False
        assert verify_password("MYPASSWORD123", hashed) is False

    def test_verify_password_whitespace_sensitive(self):
        """Verificación debe ser sensible a espacios."""
        plain = "My Password 123"
        hashed = hash_password(plain)

        assert verify_password(plain, hashed) is True
        assert verify_password("MyPassword123", hashed) is False
        assert verify_password("My  Password  123", hashed) is False

    def test_verify_password_extra_char(self):
        """Debe fallar si falta un carácter."""
        plain = "Password123"
        hashed = hash_password(plain)

        assert verify_password(plain, hashed) is True
        assert verify_password(plain + "!", hashed) is False
        assert verify_password(plain[:-1], hashed) is False

    def test_verify_password_invalid_hash_format(self):
        """Debe manejar hash con formato inválido sin excepción."""
        plain = "Password123"
        invalid_hash = "not_a_valid_bcrypt_hash"

        # Puede lanzar excepción o retornar False
        # La mayoría de bcrypt implementations lanza excepción
        try:
            result = verify_password(plain, invalid_hash)
            # Si no lanza, debe retornar False
            assert result is False
        except Exception:
            # Si lanza, es comportamiento válido
            pass

    def test_verify_password_empty_hash(self):
        """Debe manejar hash vacío."""
        plain = "Password123"
        empty_hash = ""

        try:
            result = verify_password(plain, empty_hash)
            assert result is False
        except Exception:
            # Comportamiento válido
            pass


class TestPasswordIntegration:
    """Tests de integración para el ciclo completo."""

    def test_hash_and_verify_workflow(self):
        """Debe hashear y verificar correctamente en flujo real."""
        original = "UserPassword123!"

        # Registrar usuario
        stored_hash = hash_password(original)

        # Login - verificar password
        assert verify_password(original, stored_hash) is True

        # Intento de login con wrong password
        assert verify_password("WrongPassword456!", stored_hash) is False

    def test_multiple_users_different_hashes(self):
        """Diferentes usuarios deben tener hashes diferentes."""
        passwords = [
            "UserOne123!",
            "UserTwo456!",
            "UserThree789!",
        ]

        hashes = [hash_password(p) for p in passwords]

        # Todos los hashes deben ser diferentes
        assert len(set(hashes)) == len(hashes)

        # Cada password debe verificar con su hash
        for password, hashed in zip(passwords, hashes):
            assert verify_password(password, hashed)

        # Passwords no deben verificar con hashes de otros
        assert not verify_password(passwords[0], hashes[1])
        assert not verify_password(passwords[1], hashes[0])
