# backend/infrastructure/security/passwords.py

import bcrypt


def hash_password(plain_password: str) -> str:
    """
    Genera un hash seguro para almacenar en base de datos.
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(
        plain_password.encode("utf-8"),
        salt
    )
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica que el password plano coincida con el hash almacenado.
    """
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )
