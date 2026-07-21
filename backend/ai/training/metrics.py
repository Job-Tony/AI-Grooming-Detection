from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)


@dataclass(slots=True)
class MetricsResult:
    """
    Stores evaluation metrics for a binary classification model.
    """

    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: np.ndarray
    auc: float | None = None


class Metrics:
    """
    Utility class for computing evaluation metrics.
    """

    @staticmethod
    def calculate(
        predictions: list[int],
        labels: list[int],
        probabilities: list[float] | None = None,
    ) -> MetricsResult:
        """
        Calculate evaluation metrics.

        Args:
            predictions:
                Predicted class labels.

            labels:
                Ground truth labels.

            probabilities:
                Predicted probabilities for the positive class.
                Used to compute ROC-AUC.

        Returns:
            MetricsResult containing all evaluation metrics.
        """

        auc = None

        if probabilities is not None:
            try:
                auc = roc_auc_score(
                    labels,
                    probabilities,
                )
            except ValueError:
                # ROC-AUC cannot be computed if only one class exists.
                auc = None

        return MetricsResult(
            accuracy=accuracy_score(
                labels,
                predictions,
            ),
            precision=precision_score(
                labels,
                predictions,
                zero_division=0,
            ),
            recall=recall_score(
                labels,
                predictions,
                zero_division=0,
            ),
            f1_score=f1_score(
                labels,
                predictions,
                zero_division=0,
            ),
            confusion_matrix=confusion_matrix(
                labels,
                predictions,
            ),
            auc=auc,
        )