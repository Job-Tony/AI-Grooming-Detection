from __future__ import annotations

from pathlib import Path
from typing import Any

import torch
from torch import nn
from torch.optim import Optimizer

from ai.training.config import (
    MODEL_NAME,
    SAVE_DIRECTORY,
)
from ai.training.history import TrainingHistory


class ModelCheckpoint:
    """
    Utility class for saving and loading model checkpoints.
    """

    @staticmethod
    def save(
        model: nn.Module,
        optimizer: Optimizer,
        epoch: int,
        train_loss: float,
        validation_loss: float,
        validation_accuracy: float,
        validation_precision: float,
        validation_recall: float,
        validation_f1: float,
        validation_auc: float | None,
        history: TrainingHistory,
    ) -> Path:
        """
        Save the complete training checkpoint.

        Returns:
            Path to the saved checkpoint.
        """

        save_directory = Path(
            SAVE_DIRECTORY
        )

        save_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        checkpoint_path = (
            save_directory
            / MODEL_NAME
        )

        checkpoint = {
            "epoch": epoch,
            "model_state_dict": model.state_dict(),
            "optimizer_state_dict": optimizer.state_dict(),
            "train_loss": train_loss,
            "validation_loss": validation_loss,
            "validation_accuracy": validation_accuracy,
            "validation_precision": validation_precision,
            "validation_recall": validation_recall,
            "validation_f1": validation_f1,
            "validation_auc": validation_auc,
            "history": history.as_dict(),
        }

        torch.save(
            checkpoint,
            checkpoint_path,
        )

        return checkpoint_path

    @staticmethod
    def load(
        model: nn.Module,
        optimizer: Optimizer | None = None,
    ) -> dict[str, Any]:
        """
        Load a checkpoint.

        Returns:
            Dictionary containing checkpoint information.
        """

        checkpoint_path = (
            Path(SAVE_DIRECTORY)
            / MODEL_NAME
        )

        checkpoint = torch.load(
            checkpoint_path,
            map_location="cpu",
        )

        model.load_state_dict(
            checkpoint["model_state_dict"]
        )

        if (
            optimizer is not None
            and "optimizer_state_dict"
            in checkpoint
        ):
            optimizer.load_state_dict(
                checkpoint["optimizer_state_dict"]
            )

        model.eval()

        return checkpoint