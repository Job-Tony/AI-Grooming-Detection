from __future__ import annotations

from dataclasses import dataclass

import torch
from torch import nn
from torch.utils.data import DataLoader

from ai.training.metrics import (
    Metrics,
    MetricsResult,
)
from ai.training.config import DEVICE


@dataclass(slots=True)
class EvaluationResult:
    """
    Stores validation results.
    """

    loss: float
    metrics: MetricsResult


class Evaluator:
    """
    Evaluates a model on a validation or test dataset.
    """

    def __init__(
        self,
        criterion: nn.Module,
    ):
        self.criterion = criterion

    def evaluate(
        self,
        model: nn.Module,
        dataloader: DataLoader,
    ) -> EvaluationResult:
        """
        Evaluate the model.

        Args:
            model:
                PyTorch model.

            dataloader:
                Validation or test dataloader.

        Returns:
            EvaluationResult.
        """

        model.eval()

        total_loss = 0.0

        predictions: list[int] = []
        labels: list[int] = []
        probabilities: list[float] = []

        with torch.no_grad():

            for batch in dataloader:

                input_ids = batch["input_ids"].to(
                    DEVICE
                )

                attention_mask = batch[
                    "attention_mask"
                ].to(DEVICE)

                targets = batch["label"].to(
                    DEVICE
                )

                logits = model(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                )

                loss = self.criterion(
                    logits,
                    targets,
                )

                total_loss += loss.item()

                probs = torch.softmax(
                    logits,
                    dim=1,
                )[:, 1]

                preds = torch.argmax(
                    logits,
                    dim=1,
                )

                predictions.extend(
                    preds.cpu().tolist()
                )

                labels.extend(
                    targets.cpu().tolist()
                )

                probabilities.extend(
                    probs.cpu().tolist()
                )

        average_loss = (
            total_loss
            / len(dataloader)
        )

        metrics = Metrics.calculate(
            predictions=predictions,
            labels=labels,
            probabilities=probabilities,
        )

        return EvaluationResult(
            loss=average_loss,
            metrics=metrics,
        )