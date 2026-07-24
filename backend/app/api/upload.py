from uuid import UUID

from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models.user import User
from app.schemas.conversation import UploadedConversationResponse
from app.schemas.upload import UploadResponse
from app.services.upload_service import UploadService

router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"],
)


@router.post(
    "",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_chat(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a chat file for AI analysis.
    """

    service = UploadService(db)

    upload = service.upload_chat_file(
        user=current_user,
        upload_file=file,
    )

    return UploadResponse(
        upload_id=upload.id,
        filename=upload.original_filename,
        status=upload.status,
        created_at=upload.created_at,
    )


@router.get(
    "/{upload_id}",
    response_model=UploadedConversationResponse,
    status_code=status.HTTP_200_OK,
)
def get_uploaded_conversation(
    upload_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve the parsed conversation associated with an uploaded file.
    """

    service = UploadService(db)

    return service.get_uploaded_conversation(upload_id)