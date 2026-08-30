from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base


class Incident(Base):
    """
    Stores a detected grooming-risk incident from an external platform
    such as Discord.
    """

    __tablename__ = "incidents"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # User who owns/reported the incident.
    # Nullable because Discord incidents may not always map
    # directly to a SafeChat web user.
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Platform from which the incident originated.
    # Example: "discord"
    platform: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="discord",
    )

    # Discord server/guild identifier.
    guild_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    # Discord channel identifier.
    channel_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    # Human-readable channel name.
    channel_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    # AI prediction label.
    # Example: LOW_RISK, HIGH_RISK, GROOMING
    prediction: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    probability: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    confidence: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    risk_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    # Number of messages included in the analysis.
    message_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    # Short conversation excerpt associated with the detection.
    conversation_excerpt: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # AI model version used for the prediction.
    model_version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    # Whether a moderator has reviewed this incident.
    reviewed: Mapped[bool] = mapped_column(
        default=False,
        nullable=False,
        index=True,
    )

    # SafeChat user who reviewed the incident.
    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # Optional moderator notes.
    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )