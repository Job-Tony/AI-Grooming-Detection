from __future__ import annotations

from dataclasses import dataclass
from uuid import UUID


@dataclass(slots=True)
class ConversationExample:
    """
    Represents one conversation used for training or inference.
    """

    conversation_id: str | UUID
    text: str
    label: int | None = None

    # Number of messages in the conversation.
    message_count: int = 0