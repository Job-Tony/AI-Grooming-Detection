import uuid
from enum import Enum

from sqlalchemy import Boolean, Enum as SqlEnum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship

from app.database.database import Base
from app.models.base import TimestampMixin

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    MODERATOR = "MODERATOR"
    USER = "USER"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[UserRole] = mapped_column(
        SqlEnum(UserRole),
        default=UserRole.USER,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    uploads = relationship(
        "Upload",
        back_populates="user",
        cascade="all, delete-orphan",
    )