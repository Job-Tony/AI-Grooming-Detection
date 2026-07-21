import uuid
from datetime import datetime

from sqlalchemy import Enum
from app.models.base import UploadStatus

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.orm import relationship

from app.database.database import Base


class Upload(Base):
    __tablename__ = "uploads"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    original_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    stored_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
    )

    file_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    file_size: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    upload_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    status: Mapped[UploadStatus] = mapped_column(
    Enum(UploadStatus, name="upload_status"),
    nullable=False,
    default=UploadStatus.UPLOADED,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # Relationship to User
    user = relationship(
        "User",
        back_populates="uploads",
    )

    conversation = relationship(
    "Conversation",
    back_populates="upload",
    uselist=False,
    cascade="all, delete-orphan",
    )