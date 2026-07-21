from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class ConversationSource(str, enum.Enum):
    TXT = "TXT"
    CSV = "CSV"
    JSON = "JSON"
    WHATSAPP = "WHATSAPP"
    DISCORD = "DISCORD"
    TELEGRAM = "TELEGRAM"
    OTHER = "OTHER"


class ConversationStatus(str, enum.Enum):
    UPLOADED = "UPLOADED"
    PROCESSING = "PROCESSING"
    PARSED = "PARSED"
    FAILED = "FAILED"


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    upload_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("uploads.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    source: Mapped[ConversationSource] = mapped_column(
        Enum(ConversationSource),
        default=ConversationSource.TXT,
        nullable=False,
    )

    status: Mapped[ConversationStatus] = mapped_column(
        Enum(ConversationStatus),
        default=ConversationStatus.UPLOADED,
        nullable=False,
    )

    message_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    upload = relationship(
        "Upload",
        back_populates="conversation",
    )

    messages = relationship(
        "ChatMessage",
        back_populates="conversation",
        cascade="all, delete-orphan",
    )