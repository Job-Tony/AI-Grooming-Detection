from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

from ai.explainability.schemas import (
    BehavioralIndicator,
    ExplanationResult,
)


class RiskLevel(str, Enum):
    """
    Supported prediction labels.
    """

    LOW = "LOW_RISK"
    MEDIUM = "MEDIUM_RISK"
    HIGH = "HIGH_RISK"


@dataclass(slots=True)
class PredictionResult:
    """
    Standard prediction output.
    """

    label: RiskLevel

    probability: float

    confidence: float

    risk_score: float


@dataclass(slots=True)
class PredictionWithExplanation:
    """
    Prediction together with SHAP and behavioral explanations.
    """

    prediction: PredictionResult

    explanation: ExplanationResult

    behavioral_indicators: list[BehavioralIndicator]