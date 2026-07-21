from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.base import UploadStatus
from app.models.upload import Upload


class UploadRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_upload(self, upload: Upload) -> Upload:
        self.db.add(upload)
        self.db.commit()
        self.db.refresh(upload)
        return upload

    def get_upload_by_id(self, upload_id: UUID) -> Upload | None:
        stmt = select(Upload).where(Upload.id == upload_id)
        return self.db.scalar(stmt)

    def get_uploads_by_user(self, user_id: UUID) -> list[Upload]:
        stmt = (
            select(Upload)
            .where(Upload.user_id == user_id)
            .order_by(Upload.created_at.desc())
        )
        return list(self.db.scalars(stmt).all())

    def update_upload_status(
        self,
        upload: Upload,
        status: UploadStatus,
    ) -> Upload:
        upload.status = status
        self.db.commit()
        self.db.refresh(upload)
        return upload

    def delete_upload(self, upload: Upload) -> None:
        self.db.delete(upload)
        self.db.commit()