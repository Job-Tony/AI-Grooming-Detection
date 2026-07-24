from __future__ import annotations

import traceback

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models.user import User
from app.schemas.ai import (
    ModelInfoResponse,
    PredictionRequest,
    PredictionResponse,
    PredictionWithExplanationResponse,
)
from app.services.ai_service import ai_service
from app.services.analysis_service import AnalysisService

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


# ==========================================================
# Prediction
# ==========================================================

@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
)
def predict(
    request: PredictionRequest,
) -> PredictionResponse:
    """
    Predict grooming risk.
    """

    try:
        result = ai_service.predict(
            request.conversation
        )

        return PredictionResponse(**result)

    except Exception as exc:
        print("\n" + "=" * 80)
        print("AI PREDICTION FAILED")
        print("=" * 80)
        traceback.print_exc()
        print("=" * 80 + "\n")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


# ==========================================================
# Prediction + Explanation (Authenticated)
# ==========================================================

@router.post(
    "/predict/explain",
    response_model=PredictionWithExplanationResponse,
    status_code=status.HTTP_200_OK,
)
def predict_with_explanation(
    request: PredictionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PredictionWithExplanationResponse:
    """
    Predict grooming risk, generate SHAP explanations,
    build both timelines and save the analysis.
    """

    try:
        result = ai_service.predict_with_explanation(
            request.conversation
        )

        AnalysisService(db).create_analysis(
            user_id=current_user.id,
            upload_id=request.upload_id,
            prediction=result["prediction"]["label"],
            probability=result["prediction"]["probability"],
            confidence=result["prediction"]["confidence"],
            risk_score=result["prediction"]["risk_score"],
            processing_time_ms=result["prediction"]["prediction_time_ms"],
            summary=result["explanation"]["summary"],
            model_version=result["prediction"]["model_version"],
        )

        return PredictionWithExplanationResponse(
            **result
        )

    except Exception as exc:
        print("\n" + "=" * 80)
        print("AI EXPLANATION FAILED")
        print("=" * 80)
        traceback.print_exc()
        print("=" * 80 + "\n")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


# ==========================================================
# Prediction + Explanation (Public)
# ==========================================================

@router.post(
    "/predict/explain/public",
    response_model=PredictionWithExplanationResponse,
    status_code=status.HTTP_200_OK,
)
def predict_with_explanation_public(
    request: PredictionRequest,
) -> PredictionWithExplanationResponse:
    """
    Browser extension endpoint.

    Returns:

    - Prediction
    - SHAP explanation
    - Prediction timeline
    - Explanation timeline
    """

    try:
        result = ai_service.predict_with_explanation(
            request.conversation
        )

        return PredictionWithExplanationResponse(
            **result
        )

    except Exception as exc:
        print("\n" + "=" * 80)
        print("PUBLIC AI EXPLANATION FAILED")
        print("=" * 80)
        traceback.print_exc()
        print("=" * 80 + "\n")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


# ==========================================================
# Model Info
# ==========================================================

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
        print("\n" + "=" * 80)
        print("MODEL INFO FAILED")
        print("=" * 80)
        traceback.print_exc()
        print("=" * 80 + "\n")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )