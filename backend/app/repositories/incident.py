from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.incident import Incident
from app.schemas.incident import IncidentCreate


class IncidentRepository:
    """Database operations for incidents."""

    @staticmethod
    def create(
        db: Session,
        incident_data: IncidentCreate,
    ) -> Incident:
        """Create and persist a new incident."""

        incident = Incident(
            user_id=incident_data.user_id,
            platform=incident_data.platform,
            guild_id=incident_data.guild_id,
            channel_id=incident_data.channel_id,
            channel_name=incident_data.channel_name,
            prediction=incident_data.prediction,
            probability=incident_data.probability,
            confidence=incident_data.confidence,
            risk_score=incident_data.risk_score,
            message_count=incident_data.message_count,
            conversation_excerpt=incident_data.conversation_excerpt,
            model_version=incident_data.model_version,
            reviewed=incident_data.reviewed,
            reviewed_by=incident_data.reviewed_by,
            notes=incident_data.notes,
        )

        db.add(incident)
        db.commit()
        db.refresh(incident)

        return incident

    @staticmethod
    def get_by_id(
        db: Session,
        incident_id: UUID,
    ) -> Incident | None:
        """Retrieve an incident by ID."""

        statement = select(Incident).where(
            Incident.id == incident_id
        )

        return db.scalar(statement)

    @staticmethod
    def get_all(
        db: Session,
        limit: int = 100,
    ) -> list[Incident]:
        """Retrieve recent incidents."""

        statement = (
            select(Incident)
            .order_by(Incident.created_at.desc())
            .limit(limit)
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def update_review(
        db: Session,
        incident: Incident,
        reviewed: bool,
        reviewed_by: UUID | None,
        notes: str | None,
    ) -> Incident:
        """Update moderator review information."""

        incident.reviewed = reviewed
        incident.reviewed_by = reviewed_by
        incident.notes = notes

        db.commit()
        db.refresh(incident)

        return incident