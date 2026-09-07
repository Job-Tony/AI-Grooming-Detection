from __future__ import annotations

import time
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ai.inference.predictor import GroomingPredictor

MODEL_NAME = "DistilBERT + BiLSTM"
MODEL_VERSION = "1.0.0"
BEST_F1 = 0.9517
MAX_SEQUENCE_LENGTH = 512


class AIService:
    """
    Service layer for AI inference.

    The AI model is loaded lazily when it is first needed.
    """

    def __init__(self) -> None:
        self._predictor: GroomingPredictor | None = None

    @property
    def predictor(self) -> GroomingPredictor:
        """
        Lazily create the predictor.

        Heavy AI libraries (PyTorch, Transformers, SHAP, etc.)
        are imported only when the first prediction request
        is received.
        """

        if self._predictor is None:
            from ai.inference.predictor import GroomingPredictor

            self._predictor = GroomingPredictor()

        return self._predictor

    # ------------------------------------------------------------------
    # Basic Prediction
    # ------------------------------------------------------------------

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

    # ------------------------------------------------------------------
    # SHAP Explanation Timeline
    # ------------------------------------------------------------------

    def build_explanation_timeline(
        self,
        conversation: list[str],
        explanation,
    ) -> list[dict]:
        """
        Build cumulative SHAP evidence across the conversation.
        """

        timeline: list[dict] = []

        cumulative_score = 0.0

        for index, message in enumerate(conversation):

            message_score = 0.0

            message_lower = message.lower()

            for word in explanation.words:

                if word.token.lower() in message_lower:
                    message_score += word.normalized_score

            cumulative_score += message_score

            timeline.append(
                {
                    "message_index": index + 1,
                    "risk_score": round(
                        min(cumulative_score * 100, 100),
                        2,
                    ),
                }
            )

        return timeline

    # ------------------------------------------------------------------
    # Prediction + Explanation
    # ------------------------------------------------------------------

    def predict_with_explanation(
        self,
        conversation: list[str],
    ) -> dict:
        """
        Predict grooming risk together with SHAP explanations
        and both timelines.
        """

        start = time.perf_counter()

        result = self.predictor.predict_with_explanation(
            conversation
        )

        elapsed = (time.perf_counter() - start) * 1000

        prediction_timeline = self.build_prediction_timeline(
            conversation
        )

        explanation_timeline = self.build_explanation_timeline(
            conversation,
            result.explanation,
        )

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
            "behavioral_indicators": [
                {
                    "indicator_type": indicator.indicator_type,
                    "title": indicator.title,
                    "description": indicator.description,
                    "severity": indicator.severity.value,
                    "count": indicator.count,
                }
                for indicator in result.behavioral_indicators
            ],
            "prediction_timeline": prediction_timeline,
            "explanation_timeline": explanation_timeline,
        }
    # ------------------------------------------------------------------
    # Prediction Timeline
    # ------------------------------------------------------------------

    def build_prediction_timeline(
        self,
        conversation: list[str],
    ) -> list[dict]:
        """
        Build an early-detection prediction timeline by
        repeatedly predicting progressively larger prefixes
        of the conversation.
        """

        timeline: list[dict] = []

        if not conversation:
            return timeline

        total_messages = len(conversation)

        step = 1 if total_messages <= 20 else 5

        checkpoints = list(
            range(step, total_messages + 1, step)
        )

        if checkpoints[-1] != total_messages:
            checkpoints.append(total_messages)

        for count in checkpoints:

            partial_conversation = conversation[:count]

            prediction = self.predictor.predict(
                partial_conversation
            )

            timeline.append(
                {
                    "message_index": count,
                    "label": prediction.label.value,
                    "probability": round(
                        prediction.probability,
                        4,
                    ),
                    "confidence": round(
                        prediction.confidence,
                        2,
                    ),
                    "risk_score": round(
                        prediction.risk_score,
                        2,
                    ),
                }
            )

        return timeline

    # ------------------------------------------------------------------
    # Model Information
    # ------------------------------------------------------------------

    def get_model_info(self) -> dict:
        """
        Return metadata about the AI model.
        """

        return {
            "model_name": MODEL_NAME,
            "model_version": MODEL_VERSION,
            "architecture": (
                "DistilBERT Encoder + BiLSTM + Classifier"
            ),
            "best_validation_f1": BEST_F1,
            "max_sequence_length": MAX_SEQUENCE_LENGTH,
            "device": (
                str(self._predictor.device)
                if self._predictor is not None
                else "Not Loaded"
            ),
            "labels": [
                "LOW_RISK",
                "MEDIUM_RISK",
                "HIGH_RISK",
            ],
            "model_loaded": self._predictor is not None,
        }


# ----------------------------------------------------------------------
# Singleton
# ----------------------------------------------------------------------

ai_service = AIService()