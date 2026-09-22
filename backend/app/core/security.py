from datetime import datetime, timedelta, timezone

import jwt
# Import CryptContext from passlib instead of pwdlib
from passlib.context import CryptContext

from app.core.config import settings

# Setup CryptContext with bcrypt to handle password hashing safely
password_hash = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    # Hash a plain text password
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    # Verify if the plain password matches the hashed password
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    subject: str,
) -> str:
    # Create an expiration time for the JWT token
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    payload = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }

    # Encode the payload into a JWT token
    token = jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )

    return token

def decode_access_token(
    token: str,
) -> dict:
    # Decode the JWT token to extract the payload
    payload = jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )

    return payload