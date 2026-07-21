from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.core.security import ALGORITHM
from app.dependencies.database import get_db
from app.exceptions.auth import (
    InvalidCredentialsError,
    UserNotFoundError,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository

# HTTP Bearer Authentication
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Validate JWT and return the authenticated user.
    """

    token = credentials.credentials

    print("\n" + "=" * 70)
    print("=" * 70)

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[ALGORITHM],
        )


        user_id = payload.get("sub")

        if user_id is None:
            raise InvalidCredentialsError("Invalid authentication token.")

        user_id = UUID(user_id)

    except (JWTError, ValueError) as e:
        raise InvalidCredentialsError("Invalid authentication token.")

    repository = UserRepository(db)

    user = repository.get_by_id(user_id)

    print("=" * 70 + "\n")

    if user is None:
        raise UserNotFoundError("User not found.")

    return user