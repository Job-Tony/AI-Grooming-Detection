from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
)


class ConversationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        conversation: ConversationCreate,
    ) -> Conversation:
        db_conversation = Conversation(
            upload_id=conversation.upload_id,
            title=conversation.title,
            source=conversation.source,
        )

        self.db.add(db_conversation)
        self.db.commit()
        self.db.refresh(db_conversation)

        return db_conversation

    def get_by_id(
        self,
        conversation_id: uuid.UUID,
    ) -> Conversation | None:
        return self.db.scalar(
            select(Conversation).where(
                Conversation.id == conversation_id
            )
        )

    def get_by_upload_id(
        self,
        upload_id: uuid.UUID,
    ) -> Conversation | None:
        return self.db.scalar(
            select(Conversation).where(
                Conversation.upload_id == upload_id
            )
        )

    def update(
        self,
        conversation: Conversation,
        update_data: ConversationUpdate,
    ) -> Conversation:

        values = update_data.model_dump(exclude_unset=True)

        for key, value in values.items():
            setattr(conversation, key, value)

        self.db.commit()
        self.db.refresh(conversation)

        return conversation

    def delete(
        self,
        conversation: Conversation,
    ) -> None:
        self.db.delete(conversation)
        self.db.commit()