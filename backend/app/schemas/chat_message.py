from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ChatMessageBase(BaseModel):
    sender: str
    message: str
    timestamp: datetime | None = None
    message_order: int


class ChatMessageCreate(ChatMessageBase):
    conversation_id: uuid.UUID


class ChatMessageResponse(ChatMessageBase):
    id: uuid.UUID
    conversation_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)