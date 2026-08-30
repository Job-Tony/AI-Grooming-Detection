from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class IncidentBase(BaseModel):
    """Common incident fields."""

    platform: str
    guild_id: str | None = None
    channel_id: str | None = None
    channel_name: str | None = None

    prediction: str
    probability: float
    confidence: float
    risk_score: float

    message_count: int
    conversation_excerpt: str | None = None

    model_version: str

    reviewed: bool = False
    reviewed_by: UUID | None = None
    notes: str | None = None


class IncidentCreate(IncidentBase):
    """Data required to create an incident."""

    user_id: UUID | None = None


class IncidentResponse(IncidentBase):
    """Incident returned by the API."""

    id: UUID
    user_id: UUID | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)