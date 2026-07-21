from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.upload_service import UploadService


def get_upload_service(
    db: Session = Depends(get_db),
) -> UploadService:
    return UploadService(db)