from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, Field


# ==========================================================
# Request
# ==========================================================

class PredictionRequest(BaseModel):
    """
    Request body for AI prediction.
    """

    upload_id: UUID | None = Field(
        default=None,
        description="ID of the uploaded conversation.",
    )

    conversation: list[str] = Field(
        ...,
        min_length=1,
        description="Conversation messages in chronological order.",
    )


# ==========================================================
# Prediction
# ==========================================================

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


# ==========================================================
# SHAP Explanation
# ==========================================================

class WordExplanationResponse(BaseModel):
    token: str
    score: float
    normalized_score: float
    importance: str
    color: str


class ExplanationResponse(BaseModel):
    """
    Collection of SHAP word explanations.
    """

    summary: str
    words: list[WordExplanationResponse]


# ==========================================================
# Prediction Timeline
# ==========================================================

class PredictionTimelinePointResponse(BaseModel):
    """
    AI prediction after each checkpoint.
    """

    message_index: int
    label: str
    probability: float
    confidence: float
    risk_score: float


# ==========================================================
# Explanation Timeline
# ==========================================================

class ExplanationTimelinePointResponse(BaseModel):
    """
    SHAP evidence accumulation.
    """

    message_index: int
    risk_score: float


# ==========================================================
# Combined Response
# ==========================================================

class PredictionWithExplanationResponse(BaseModel):
    """
    Prediction together with SHAP explanations
    and both timelines.
    """

    prediction: PredictionResponse

    explanation: ExplanationResponse

    prediction_timeline: list[
        PredictionTimelinePointResponse
    ]

    explanation_timeline: list[
        ExplanationTimelinePointResponse
    ]


# ==========================================================
# Model Information
# ==========================================================

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