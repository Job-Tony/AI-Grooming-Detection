from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from ai.datasets.schemas import ConversationExample
from ai.preprocessing.preprocess import preprocess_text


class DatasetBuilder:
    """
    Builds training examples from conversations stored in PostgreSQL.
    """

    def __init__(self, db: Session):
        self.db = db

    def build_example(
        self,
        conversation_id: UUID,
        messages: list[str],
        label: int | None = None,
    ) -> ConversationExample:
        """
        Build a ConversationExample from a list of messages.
        Useful for testing without a database.
        """

        processed_messages = [
            preprocess_text(message)
            for message in messages
        ]

        conversation_text = "\n".join(processed_messages)

        return ConversationExample(
            conversation_id=conversation_id,
            text=conversation_text,
            label=label,
            message_count=len(messages),
        )

    def build_from_conversation(
        self,
        conversation_id: UUID,
        label: int | None = None,
    ) -> ConversationExample:
        """
        Build a ConversationExample from a conversation stored
        in the PostgreSQL database.
        """

        conversation = self.db.get(
            Conversation,
            conversation_id,
        )

        if conversation is None:
            raise ValueError(
                f"Conversation '{conversation_id}' not found."
            )

        messages = sorted(
            conversation.messages,
            key=lambda message: message.message_order,
        )

        processed_messages: list[str] = []

        for message in messages:
            processed = preprocess_text(
                message.message
            )

            formatted_message = (
                f"{message.sender}: {processed}"
            )

            processed_messages.append(
                formatted_message
            )

        conversation_text = "\n".join(
            processed_messages
        )

        return ConversationExample(
            conversation_id=conversation.id,
            text=conversation_text,
            label=label,
            message_count=len(messages),
        )

    def build_all(
        self,
    ) -> list[ConversationExample]:
        """
        Build ConversationExample objects for every conversation
        stored in the database.
        """

        conversations = self.db.scalars(
            select(Conversation)
        ).all()

        dataset: list[ConversationExample] = []

        for conversation in conversations:
            dataset.append(
                self.build_from_conversation(
                    conversation.id
                )
            )

        return dataset

    def build_from_conversations(
        self,
        conversation_ids: list[UUID],
    ) -> list[ConversationExample]:
        """
        Build ConversationExample objects for a selected list
        of conversation IDs.
        """

        dataset: list[
            ConversationExample
        ] = []

        for conversation_id in conversation_ids:
            dataset.append(
                self.build_from_conversation(
                    conversation_id
                )
            )

        return dataset

    def build_text_only_dataset(
        self,
    ) -> list[str]:
        """
        Return only the processed conversation texts.

        Useful for tokenizer training or inference.
        """

        examples = self.build_all()

        return [
            example.text
            for example in examples
        ]