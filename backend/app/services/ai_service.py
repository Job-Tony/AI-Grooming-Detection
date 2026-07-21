from __future__ import annotations

import time

from ai.inference.predictor import GroomingPredictor


MODEL_NAME = "DistilBERT + BiLSTM"
MODEL_VERSION = "1.0.0"
BEST_F1 = 0.9517
MAX_SEQUENCE_LENGTH = 512


class AIService:
    """
    Service layer for AI inference.
    """

    def __init__(self) -> None:
        self.predictor = GroomingPredictor()

    def predict(
        self,
        conversation: list[str],
    ) -> dict:
        """
        Predict grooming risk.
        """

        start = time.perf_counter()

        result = self.predictor.predict(conversation)

        elapsed = (time.perf_counter() - start) * 1000

        return {
            "label": result.label.value,
            "probability": round(result.probability, 4),
            "confidence": round(result.confidence, 2),
            "risk_score": round(result.risk_score, 2),
            "message_count": len(conversation),
            "prediction_time_ms": round(elapsed, 2),
            "model_version": MODEL_VERSION,
        }

    def predict_with_explanation(
        self,
        conversation: list[str],
    ) -> dict:
        """
        Predict grooming risk together with a SHAP explanation.
        """

        start = time.perf_counter()

        result = self.predictor.predict_with_explanation(
            conversation
        )

        elapsed = (time.perf_counter() - start) * 1000

        return {
            "prediction": {
                "label": result.prediction.label.value,
                "probability": round(
                    result.prediction.probability,
                    4,
                ),
                "confidence": round(
                    result.prediction.confidence,
                    2,
                ),
                "risk_score": round(
                    result.prediction.risk_score,
                    2,
                ),
                "message_count": len(conversation),
                "prediction_time_ms": round(
                    elapsed,
                    2,
                ),
                "model_version": MODEL_VERSION,
            },
            "explanation": {
                "summary": result.explanation.summary,
                "words": [
                    {
                        "token": word.token,
                        "score": round(word.score, 6),
                        "normalized_score": round(
                            word.normalized_score,
                            4,
                        ),
                        "importance": word.importance.value,
                        "color": word.color,
                    }
                    for word in result.explanation.words
                ],
            },
        }

    def get_model_info(self) -> dict:
        """
        Return metadata about the loaded AI model.
        """

        return {
            "model_name": MODEL_NAME,
            "model_version": MODEL_VERSION,
            "architecture": "DistilBERT Encoder + BiLSTM + Classifier",
            "best_validation_f1": BEST_F1,
            "max_sequence_length": MAX_SEQUENCE_LENGTH,
            "device": str(self.predictor.device),
            "labels": [
                "LOW_RISK",
                "MEDIUM_RISK",
                "HIGH_RISK",
            ],
        }


# Singleton instance
ai_service = AIService()