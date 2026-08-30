from uuid import UUID

from sqlalchemy.orm import Session

from app.repositories.incident import IncidentRepository
from app.schemas.incident import IncidentCreate, IncidentResponse


class IncidentService:
    """Business logic for creating and retrieving incidents."""

    @staticmethod
    def create_incident(
        db: Session,
        *,
        user_id: UUID | None = None,
        platform: str,
        guild_id: str | None = None,
        channel_id: str | None = None,
        channel_name: str | None = None,
        prediction: str,
        probability: float,
        confidence: float,
        risk_score: float,
        message_count: int,
        conversation_excerpt: str | None = None,
        model_version: str,
    ) -> IncidentResponse:
        """
        Create an incident from an AI prediction.
        """

        incident_data = IncidentCreate(
            user_id=user_id,
            platform=platform,
            guild_id=guild_id,
            channel_id=channel_id,
            channel_name=channel_name,
            prediction=prediction,
            probability=probability,
            confidence=confidence,
            risk_score=risk_score,
            message_count=message_count,
            conversation_excerpt=conversation_excerpt,
            model_version=model_version,
        )

        incident = IncidentRepository.create(
            db,
            incident_data,
        )

        return IncidentResponse.model_validate(incident)

    @staticmethod
    def get_incident(
        db: Session,
        incident_id: UUID,
    ) -> IncidentResponse | None:
        """Retrieve one incident."""

        incident = IncidentRepository.get_by_id(
            db,
            incident_id,
        )

        if incident is None:
            return None

        return IncidentResponse.model_validate(incident)

    @staticmethod
    def get_incidents(
        db: Session,
        limit: int = 100,
    ) -> list[IncidentResponse]:
        """Retrieve recent incidents."""

        incidents = IncidentRepository.get_all(
            db,
            limit,
        )

        return [
            IncidentResponse.model_validate(incident)
            for incident in incidents
        ]

    @staticmethod
    def review_incident(
        db: Session,
        incident_id: UUID,
        reviewed_by: UUID,
        notes: str | None = None,
    ) -> IncidentResponse | None:
        """Mark an incident as reviewed and save moderator notes."""

        incident = IncidentRepository.get_by_id(
            db,
            incident_id,
        )

        if incident is None:
            return None

        incident = IncidentRepository.update_review(
            db,
            incident,
            reviewed=True,
            reviewed_by=reviewed_by,
            notes=notes,
        )

        return IncidentResponse.model_validate(incident)