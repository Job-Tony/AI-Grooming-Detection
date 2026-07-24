from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class AnalysisResponse(BaseModel):
    """
    Represents a saved AI analysis.
    """

    id: UUID

    user_id: UUID

    upload_id: UUID | None

    prediction: str

    probability: float

    confidence: float

    risk_score: float

    processing_time_ms: float

    summary: str

    model_version: str

    created_at: datetime

    model_config = {
        "from_attributes": True,
    }


class AnalysisListResponse(BaseModel):
    """
    Response returned when listing analyses.
    """

    analyses: list[AnalysisResponse]