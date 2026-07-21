from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.schemas.ai import (
    ModelInfoResponse,
    PredictionRequest,
    PredictionResponse,
    PredictionWithExplanationResponse,
)
from app.services.ai_service import ai_service

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
)
def predict(
    request: PredictionRequest,
) -> PredictionResponse:
    """
    Predict grooming risk for a conversation.
    """

    try:
        result = ai_service.predict(
            request.conversation
        )

        return PredictionResponse(
            **result
        )

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.post(
    "/predict/explain",
    response_model=PredictionWithExplanationResponse,
    status_code=status.HTTP_200_OK,
)
def predict_with_explanation(
    request: PredictionRequest,
) -> PredictionWithExplanationResponse:
    """
    Predict grooming risk and return SHAP explanations.
    """

    try:
        result = ai_service.predict_with_explanation(
            request.conversation
        )

        return PredictionWithExplanationResponse(
            **result
        )

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get(
    "/info",
    response_model=ModelInfoResponse,
    status_code=status.HTTP_200_OK,
)
def model_info() -> ModelInfoResponse:
    """
    Return information about the loaded AI model.
    """

    try:
        return ModelInfoResponse(
            **ai_service.get_model_info()
        )

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )