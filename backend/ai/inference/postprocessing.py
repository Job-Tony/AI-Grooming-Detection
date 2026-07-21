from __future__ import annotations

from ai.inference.schemas import PredictionResult, RiskLevel


class PredictionPostprocessor:
    """
    Converts raw model probabilities into
    user-friendly prediction results.
    """

    LOW_THRESHOLD = 0.50
    HIGH_THRESHOLD = 0.80

    @classmethod
    def get_label(cls, probability: float) -> RiskLevel:
        """
        Determine risk category.
        """

        if probability >= cls.HIGH_THRESHOLD:
            return RiskLevel.HIGH

        if probability >= cls.LOW_THRESHOLD:
            return RiskLevel.MEDIUM

        return RiskLevel.LOW

    @classmethod
    def build_result(
        cls,
        probability: float,
    ) -> PredictionResult:
        """
        Create a PredictionResult object.
        """

        risk_score = probability * 100

        return PredictionResult(
            label=cls.get_label(probability),
            probability=probability,
            confidence=risk_score,
            risk_score=risk_score,
        )