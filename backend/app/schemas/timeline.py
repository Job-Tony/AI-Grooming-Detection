from pydantic import BaseModel

from app.schemas.ai import PredictionResponse


class TimelinePoint(BaseModel):
    """
    Risk after processing the conversation
    up to message_index.
    """

    message_index: int
    risk_score: float
    confidence: float
    label: str


class TimelineResponse(BaseModel):
    """
    Timeline of progressive predictions.
    """

    timeline: list[TimelinePoint]
    final_prediction: PredictionResponse