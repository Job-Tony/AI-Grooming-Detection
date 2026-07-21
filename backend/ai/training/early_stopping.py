from __future__ import annotations

from ai.training.config import (
    EARLY_STOPPING_PATIENCE,
    MINIMUM_IMPROVEMENT,
)


class EarlyStopping:
    """
    Early stopping based on validation F1-score.
    """

    def __init__(
        self,
        patience: int = EARLY_STOPPING_PATIENCE,
        minimum_improvement: float = MINIMUM_IMPROVEMENT,
    ):
        self.patience = patience
        self.minimum_improvement = minimum_improvement

        self.best_score = float("-inf")
        self.counter = 0
        self.should_stop = False

    def step(
        self,
        score: float,
    ) -> bool:
        """
        Update the early stopping state.

        Args:
            score:
                Current validation F1-score.

        Returns:
            True if the score improved.
            False otherwise.
        """

        if (
            score
            > self.best_score
            + self.minimum_improvement
        ):
            self.best_score = score
            self.counter = 0
            return True

        self.counter += 1

        if self.counter >= self.patience:
            self.should_stop = True

        return False

    def reset(self) -> None:
        """
        Reset the early stopping state.
        """

        self.best_score = float("-inf")
        self.counter = 0
        self.should_stop = False

    @property
    def remaining_patience(self) -> int:
        """
        Remaining epochs before stopping.
        """

        return max(
            0,
            self.patience - self.counter,
        )