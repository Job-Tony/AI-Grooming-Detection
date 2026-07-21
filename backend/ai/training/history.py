from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(slots=True)
class TrainingHistory:
    """
    Stores training and validation metrics
    for every epoch.
    """

    train_loss: list[float] = field(
        default_factory=list
    )

    validation_loss: list[float] = field(
        default_factory=list
    )

    accuracy: list[float] = field(
        default_factory=list
    )

    precision: list[float] = field(
        default_factory=list
    )

    recall: list[float] = field(
        default_factory=list
    )

    f1_score: list[float] = field(
        default_factory=list
    )

    auc: list[float | None] = field(
        default_factory=list
    )

    def add(
        self,
        train_loss: float,
        validation_loss: float,
        accuracy: float,
        precision: float,
        recall: float,
        f1_score: float,
        auc: float | None,
    ) -> None:
        """
        Add metrics from one epoch.
        """

        self.train_loss.append(
            train_loss
        )

        self.validation_loss.append(
            validation_loss
        )

        self.accuracy.append(
            accuracy
        )

        self.precision.append(
            precision
        )

        self.recall.append(
            recall
        )

        self.f1_score.append(
            f1_score
        )

        self.auc.append(
            auc
        )

    @property
    def epochs(self) -> int:
        """
        Number of completed epochs.
        """

        return len(
            self.train_loss
        )

    def best_epoch(self) -> int:
        """
        Returns the epoch with the highest
        validation F1-score.
        """

        if not self.f1_score:
            return 0

        return (
            self.f1_score.index(
                max(self.f1_score)
            )
            + 1
        )

    def best_f1(self) -> float:
        """
        Returns the highest recorded F1-score.
        """

        if not self.f1_score:
            return 0.0

        return max(
            self.f1_score
        )

    def as_dict(self) -> dict:
        """
        Convert history into a dictionary.
        Useful for JSON export or plotting.
        """

        return {
            "train_loss": self.train_loss,
            "validation_loss": self.validation_loss,
            "accuracy": self.accuracy,
            "precision": self.precision,
            "recall": self.recall,
            "f1_score": self.f1_score,
            "auc": self.auc,
        }