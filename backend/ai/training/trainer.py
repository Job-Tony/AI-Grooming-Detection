from __future__ import annotations

import torch
from torch import nn
from torch.optim import Optimizer
from torch.utils.data import DataLoader
from tqdm import tqdm
from transformers import get_linear_schedule_with_warmup

from ai.training.checkpoint import ModelCheckpoint
from ai.training.config import (
    DEVICE,
    EPOCHS,
    MAX_GRAD_NORM,
    WARMUP_RATIO,
)
from ai.training.early_stopping import EarlyStopping
from ai.training.evaluator import Evaluator
from ai.training.history import TrainingHistory


class Trainer:
    """
    Handles model training.
    """

    def __init__(
        self,
        model: nn.Module,
        optimizer: Optimizer,
        criterion: nn.Module,
        train_loader: DataLoader,
        validation_loader: DataLoader,
    ):
        self.model = model.to(DEVICE)

        self.optimizer = optimizer

        self.criterion = criterion

        self.train_loader = train_loader

        self.validation_loader = validation_loader

        self.evaluator = Evaluator(
            criterion
        )

        self.history = TrainingHistory()

        self.early_stopping = EarlyStopping()

        total_training_steps = (
            EPOCHS * len(train_loader)
        )

        warmup_steps = int(
            total_training_steps
            * WARMUP_RATIO
        )

        self.scheduler = (
            get_linear_schedule_with_warmup(
                optimizer=self.optimizer,
                num_warmup_steps=warmup_steps,
                num_training_steps=total_training_steps,
            )
        )

    def train(
        self,
    ) -> TrainingHistory:
        """
        Train the model.
        """

        for epoch in range(
            1,
            EPOCHS + 1,
        ):

            self.model.train()

            running_loss = 0.0

            progress_bar = tqdm(
                self.train_loader,
                desc=f"Epoch {epoch}/{EPOCHS}",
                leave=False,
            )

            for batch in progress_bar:

                input_ids = batch[
                    "input_ids"
                ].to(DEVICE)

                attention_mask = batch[
                    "attention_mask"
                ].to(DEVICE)

                labels = batch[
                    "label"
                ].to(DEVICE)

                self.optimizer.zero_grad()

                logits = self.model(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                )

                loss = self.criterion(
                    logits,
                    labels,
                )

                loss.backward()

                torch.nn.utils.clip_grad_norm_(
                    self.model.parameters(),
                    MAX_GRAD_NORM,
                )

                self.optimizer.step()

                self.scheduler.step()

                running_loss += loss.item()

                progress_bar.set_postfix(
                    loss=f"{loss.item():.4f}"
                )

            train_loss = (
                running_loss
                / len(self.train_loader)
            )

            evaluation = (
                self.evaluator.evaluate(
                    self.model,
                    self.validation_loader,
                )
            )

            self.history.add(
                train_loss=train_loss,
                validation_loss=evaluation.loss,
                accuracy=evaluation.metrics.accuracy,
                precision=evaluation.metrics.precision,
                recall=evaluation.metrics.recall,
                f1_score=evaluation.metrics.f1_score,
                auc=evaluation.metrics.auc,
            )

            print()

            print(
                "=" * 60
            )

            print(
                f"Epoch {epoch}/{EPOCHS}"
            )

            print(
                "=" * 60
            )

            print(
                f"Train Loss      : {train_loss:.4f}"
            )

            print(
                f"Validation Loss : {evaluation.loss:.4f}"
            )

            print(
                f"Accuracy        : {evaluation.metrics.accuracy:.4f}"
            )

            print(
                f"Precision       : {evaluation.metrics.precision:.4f}"
            )

            print(
                f"Recall          : {evaluation.metrics.recall:.4f}"
            )

            print(
                f"F1 Score        : {evaluation.metrics.f1_score:.4f}"
            )

            print(
                f"ROC-AUC         : {evaluation.metrics.auc}"
            )

            print()

            improved = self.early_stopping.step(
                evaluation.metrics.f1_score
            )

            if improved:

                ModelCheckpoint.save(
                    model=self.model,
                    optimizer=self.optimizer,
                    epoch=epoch,
                    train_loss=train_loss,
                    validation_loss=evaluation.loss,
                    validation_accuracy=evaluation.metrics.accuracy,
                    validation_precision=evaluation.metrics.precision,
                    validation_recall=evaluation.metrics.recall,
                    validation_f1=evaluation.metrics.f1_score,
                    validation_auc=evaluation.metrics.auc,
                    history=self.history,
                )

                print(
                    "✓ Best model saved."
                )

            if (
                self.early_stopping.should_stop
            ):

                print()

                print(
                    "Early stopping triggered."
                )

                break

        return self.history