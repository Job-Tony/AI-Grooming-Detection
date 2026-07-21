from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.exceptions.auth import (
    InvalidCredentialsError,
    UserAlreadyExistsError,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class AuthService:
    """Business logic for user authentication."""

    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def register_user(self, user_data: UserCreate) -> User:
        """Register a new user."""


        if self.repository.get_by_email(user_data.email):
            raise UserAlreadyExistsError("Email already registered.")

        if self.repository.get_by_username(user_data.username):
            raise UserAlreadyExistsError("Username already exists.")

        hashed = hash_password(user_data.password)


        user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed,
        )

        return self.repository.create(user)

    def authenticate_user(
        self,
        email: str,
        password: str,
    ) -> str:
        """Authenticate a user and return a JWT access token."""

        user = self.repository.get_by_email(email)


        if user is None:
            raise InvalidCredentialsError("Invalid email or password.")

        if not verify_password(password, user.hashed_password):
            raise InvalidCredentialsError("Invalid email or password.")

        return create_access_token(subject=str(user.id))