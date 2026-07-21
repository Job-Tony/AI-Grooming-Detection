from datetime import datetime

from enum import Enum

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column


class TimestampMixin:
    """Provides created_at and updated_at timestamps."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

class UploadStatus(str, Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"