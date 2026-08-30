from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.schemas.incident import IncidentCreate, IncidentResponse
from app.services.incident import IncidentService
from app.dependencies.auth import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/incidents",
    tags=["Incidents"],
)


def get_db():
    """Provide a database session for the request."""

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post(
    "",
    response_model=IncidentResponse,
    status_code=201,
)
def create_incident(
    incident_data: IncidentCreate,
    db: Session = Depends(get_db),
):
    """Create a new incident."""

    return IncidentService.create_incident(
        db,
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
    )


@router.get(
    "",
    response_model=list[IncidentResponse],
)
def get_incidents(
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    db: Session = Depends(get_db),
):
    """Return recent incidents."""

    return IncidentService.get_incidents(
        db,
        limit=limit,
    )


@router.get(
    "/{incident_id}",
    response_model=IncidentResponse,
)
def get_incident(
    incident_id: UUID,
    db: Session = Depends(get_db),
):
    """Return a single incident."""

    incident = IncidentService.get_incident(
        db,
        incident_id,
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found.",
        )

    return incident

@router.patch(
    "/{incident_id}/review",
    response_model=IncidentResponse,
)
def review_incident(
    incident_id: UUID,
    notes: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark an incident as reviewed by the current user."""

    incident = IncidentService.review_incident(
        db,
        incident_id=incident_id,
        reviewed_by=current_user.id,
        notes=notes,
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found.",
        )

    return incident