from __future__ import annotations

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """
    Request body for AI prediction.
    """

    conversation: list[str] = Field(
        ...,
        min_length=1,
        description="Conversation messages in chronological order.",
    )


class PredictionResponse(BaseModel):
    """
    AI prediction response.
    """

    label: str

    probability: float

    confidence: float

    risk_score: float

    message_count: int

    prediction_time_ms: float

    model_version: str


class WordExplanationResponse(BaseModel):

    token: str

    score: float

    normalized_score: float

    importance: str

    color: str


class ExplanationResponse(BaseModel):
    """
    Collection of word explanations.
    """

    summary: str

    words: list[WordExplanationResponse]


class PredictionWithExplanationResponse(BaseModel):
    """
    Prediction together with SHAP explanations.
    """

    prediction: PredictionResponse

    explanation: ExplanationResponse


class ModelInfoResponse(BaseModel):
    """
    Information about the loaded AI model.
    """

    model_name: str

    model_version: str

    architecture: str

    best_validation_f1: float

    max_sequence_length: int

    device: str

    labels: list[str]