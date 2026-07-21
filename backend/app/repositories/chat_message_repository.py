from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.chat_message import ChatMessage
from app.schemas.chat_message import ChatMessageCreate


class ChatMessageRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        message: ChatMessageCreate,
    ) -> ChatMessage:
        db_message = ChatMessage(
            conversation_id=message.conversation_id,
            sender=message.sender,
            message=message.message,
            timestamp=message.timestamp,
            message_order=message.message_order,
        )

        self.db.add(db_message)
        self.db.commit()
        self.db.refresh(db_message)

        return db_message

    def bulk_create(
        self,
        messages: list[ChatMessageCreate],
    ) -> None:
        db_messages = [
            ChatMessage(
                conversation_id=message.conversation_id,
                sender=message.sender,
                message=message.message,
                timestamp=message.timestamp,
                message_order=message.message_order,
            )
            for message in messages
        ]

        self.db.add_all(db_messages)
        self.db.commit()

    def get_by_conversation_id(
        self,
        conversation_id: uuid.UUID,
    ) -> list[ChatMessage]:
        return list(
            self.db.scalars(
                select(ChatMessage)
                .where(
                    ChatMessage.conversation_id == conversation_id
                )
                .order_by(ChatMessage.message_order)
            )
        )

    def delete_by_conversation_id(
        self,
        conversation_id: uuid.UUID,
    ) -> None:
        messages = self.db.scalars(
            select(ChatMessage).where(
                ChatMessage.conversation_id == conversation_id
            )
        ).all()

        for message in messages:
            self.db.delete(message)

        self.db.commit()