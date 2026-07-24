from __future__ import annotations

import uuid

from sqlalchemy.orm import Session

from app.models.analysis import Analysis


class AnalysisRepository:
    """
    Repository for Analysis CRUD operations.
    """

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(
        self,
        analysis: Analysis,
    ) -> Analysis:
        """
        Save an analysis.
        """

        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)

        return analysis

    def get_by_id(
        self,
        analysis_id: uuid.UUID,
    ) -> Analysis | None:
        """
        Retrieve an analysis by ID.
        """

        return (
            self.db.query(Analysis)
            .filter(Analysis.id == analysis_id)
            .first()
        )

    def get_by_user(
        self,
        user_id: uuid.UUID,
    ) -> list[Analysis]:
        """
        Retrieve all analyses for a user.
        """

        return (
            self.db.query(Analysis)
            .filter(Analysis.user_id == user_id)
            .order_by(Analysis.created_at.desc())
            .all()
        )

    def delete(
        self,
        analysis: Analysis,
    ) -> None:
        """
        Delete an analysis.
        """

        self.db.delete(analysis)
        self.db.commit()