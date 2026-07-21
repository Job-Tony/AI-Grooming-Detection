from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.base import UploadStatus


class UploadResponse(BaseModel):
    upload_id: UUID
    filename: str
    status: UploadStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UploadDetail(BaseModel):
    upload_id: UUID
    filename: str
    file_type: str
    file_size: int
    status: UploadStatus
    upload_path: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UploadListResponse(BaseModel):
    upload_id: UUID
    filename: str
    status: UploadStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)