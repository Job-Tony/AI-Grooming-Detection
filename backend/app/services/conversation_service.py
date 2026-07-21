from __future__ import annotations

import uuid
from pathlib import Path

from sqlalchemy.orm import Session

from app.models.conversation import (
    Conversation,
    ConversationSource,
    ConversationStatus,
)
from app.parsers.parser_factory import ParserFactory
from app.repositories.chat_message_repository import (
    ChatMessageRepository,
)
from app.repositories.conversation_repository import (
    ConversationRepository,
)
from app.schemas.chat_message import ChatMessageCreate
from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
)


class ConversationService:
    def __init__(self, db: Session):
        self.db = db
        self.conversation_repository = ConversationRepository(db)
        self.chat_message_repository = ChatMessageRepository(db)

    def process_file(
        self,
        upload_id: uuid.UUID,
        file_path: str,
    ) -> Conversation:
        """
        Process an uploaded chat file:
        1. Select the appropriate parser.
        2. Parse the file into messages.
        3. Create a Conversation record.
        4. Save all chat messages.
        5. Update the conversation status and message count.
        """

        # Select the appropriate parser
        parser = ParserFactory.get_parser(file_path)

        # Parse the uploaded file
        parsed_messages = parser.parse(file_path)

        # Determine conversation source
        extension = Path(file_path).suffix.lower()

        source_map = {
            ".txt": ConversationSource.TXT,
            ".csv": ConversationSource.CSV,
            ".json": ConversationSource.JSON,
        }

        source = source_map.get(extension, ConversationSource.OTHER)

        # Create conversation
        conversation = self.conversation_repository.create(
            ConversationCreate(
                upload_id=upload_id,
                title=Path(file_path).stem,
                source=source,
            )
        )

        # Convert parsed messages into ChatMessageCreate objects
        chat_messages = [
            ChatMessageCreate(
                conversation_id=conversation.id,
                sender=message.sender,
                message=message.message,
                timestamp=message.timestamp,
                message_order=message.message_order,
            )
            for message in parsed_messages
        ]

        # Save all messages
        self.chat_message_repository.bulk_create(chat_messages)

        # Update conversation metadata
        conversation = self.conversation_repository.update(
            conversation,
            ConversationUpdate(
                status=ConversationStatus.PARSED,
                message_count=len(chat_messages),
            ),
        )

        return conversation

    def get_conversation(
        self,
        conversation_id: uuid.UUID,
    ) -> Conversation | None:
        """
        Retrieve a conversation by its ID.
        """
        return self.conversation_repository.get_by_id(conversation_id)

    def get_conversation_by_upload(
        self,
        upload_id: uuid.UUID,
    ) -> Conversation | None:
        """
        Retrieve a conversation associated with an upload.
        """
        return self.conversation_repository.get_by_upload_id(upload_id)

    def delete_conversation(
        self,
        conversation: Conversation,
    ) -> None:
        """
        Delete a conversation and all associated chat messages.
        """
        self.conversation_repository.delete(conversation)