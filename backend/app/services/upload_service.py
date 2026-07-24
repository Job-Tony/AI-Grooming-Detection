from pathlib import Path
from uuid import UUID

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.base import UploadStatus
from app.models.upload import Upload
from app.models.user import User
from app.repositories.upload_repository import UploadRepository
from app.services.conversation_service import ConversationService
from app.utils.file_utils import (
    generate_filename,
    get_file_size,
    save_file,
    validate_extension,
    validate_file_size,
)


class UploadService:
    """Business logic for chat file uploads."""

    def __init__(self, db: Session):
        self.db = db
        self.repository = UploadRepository(db)
        self.conversation_service = ConversationService(db)

    def upload_chat_file(
        self,
        user: User,
        upload_file: UploadFile,
    ) -> Upload:
        """
        Validate, store, register and process an uploaded chat file.
        """

        # Validate file extension
        extension = validate_extension(upload_file.filename)

        # Validate file size
        file_size = get_file_size(upload_file)
        validate_file_size(file_size)

        # Generate a unique filename
        stored_filename = generate_filename(extension)

        # Save the file to disk
        upload_path = save_file(
            upload_file=upload_file,
            stored_filename=stored_filename,
        )

        # Create upload model
        upload = Upload(
            user_id=user.id,
            original_filename=upload_file.filename,
            stored_filename=stored_filename,
            file_type=extension.lstrip("."),
            file_size=file_size,
            upload_path=upload_path,
            status=UploadStatus.UPLOADED,
        )

        try:
            # Save upload metadata
            upload = self.repository.create_upload(upload)

            # Automatically parse and save the conversation
            self.conversation_service.process_file(
                upload_id=upload.id,
                file_path=upload.upload_path,
            )

            return upload

        except Exception:
            # Remove uploaded file if anything fails
            file_path = Path(upload_path)

            if file_path.exists():
                file_path.unlink()

            raise

    def get_uploaded_conversation(
        self,
        upload_id: UUID,
    ):
        """
        Retrieve the parsed conversation associated with an upload.
        """

        upload = self.repository.get_upload_by_id(upload_id)

        if upload is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Upload not found.",
            )

        if upload.conversation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found.",
            )

        messages = sorted(
            upload.conversation.messages,
            key=lambda message: message.message_order,
        )

        return {
            "upload_id": upload.id,
            "filename": upload.original_filename,
            "conversation": [
                message.message
                for message in messages
            ],
            "message_count": upload.conversation.message_count,
            "created_at": upload.created_at,
        }