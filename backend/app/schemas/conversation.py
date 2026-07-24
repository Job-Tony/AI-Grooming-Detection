from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.conversation import (
    ConversationSource,
    ConversationStatus,
)


class ConversationBase(BaseModel):
    title: str
    source: ConversationSource


class ConversationCreate(ConversationBase):
    upload_id: uuid.UUID


class ConversationUpdate(BaseModel):
    status: ConversationStatus | None = None
    message_count: int | None = None


class ConversationResponse(ConversationBase):
    id: uuid.UUID
    upload_id: uuid.UUID
    status: ConversationStatus
    message_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UploadedConversationResponse(BaseModel):
    upload_id: uuid.UUID
    filename: str
    conversation: list[str]
    message_count: int
    created_at: datetime