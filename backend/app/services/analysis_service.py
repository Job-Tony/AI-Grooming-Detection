from __future__ import annotations

import uuid

from sqlalchemy.orm import Session

from app.models.analysis import Analysis
from app.repositories.analysis_repository import AnalysisRepository


class AnalysisService:
    """
    Business logic for Analysis operations.
    """

    def __init__(self, db: Session) -> None:
        self.repository = AnalysisRepository(db)

    def create_analysis(
        self,
        *,
        user_id: uuid.UUID,
        upload_id: uuid.UUID | None,
        prediction: str,
        probability: float,
        confidence: float,
        risk_score: float,
        processing_time_ms: float,
        summary: str,
        model_version: str,
    ) -> Analysis:
        """
        Save an AI analysis.
        """

        analysis = Analysis(
            user_id=user_id,
            upload_id=upload_id,
            prediction=prediction,
            probability=probability,
            confidence=confidence,
            risk_score=risk_score,
            processing_time_ms=processing_time_ms,
            summary=summary,
            model_version=model_version,
        )

        return self.repository.create(analysis)

    def get_analysis(
        self,
        analysis_id: uuid.UUID,
        current_user_id: uuid.UUID,
    ) -> Analysis:
        """
        Retrieve one analysis belonging to the current user.
        """

        analysis = self.repository.get_by_id(analysis_id)

        if analysis is None:
            raise ValueError("Analysis not found.")

        if analysis.user_id != current_user_id:
            raise PermissionError(
                "You do not have permission to access this analysis."
            )

        return analysis

    def list_analyses(
        self,
        current_user_id: uuid.UUID,
    ) -> list[Analysis]:
        """
        Return all analyses for the current user.
        """

        return self.repository.get_by_user(current_user_id)

    def delete_analysis(
        self,
        analysis_id: uuid.UUID,
        current_user_id: uuid.UUID,
    ) -> None:
        """
        Delete an analysis.
        """

        analysis = self.get_analysis(
            analysis_id,
            current_user_id,
        )

        self.repository.delete(analysis)