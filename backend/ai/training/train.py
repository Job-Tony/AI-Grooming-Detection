from __future__ import annotations

from pathlib import Path
from collections import Counter

import torch
from torch import nn
from torch.optim import AdamW

from ai.datasets.serializer import DatasetSerializer
from ai.data.dataloader import create_dataloader
from ai.models.grooming_model import GroomingModel

from ai.training.config import (
    BATCH_SIZE,
    DEVICE,
    LEARNING_RATE,
    WEIGHT_DECAY,
)

from ai.training.trainer import Trainer


def main() -> None:

    print("=" * 60)
    print("AI Grooming Detection Training")
    print("=" * 60)

    serializer = DatasetSerializer()

    processed_directory = (
        Path("ai")
        / "datasets"
        / "processed"
    )

    print("\nLoading datasets...")

    train_examples = serializer.load(
        processed_directory / "train.json"
    )

    validation_examples = serializer.load(
        processed_directory / "validation.json"
    )

    print(
        f"Training samples   : {len(train_examples)}"
    )

    print(
        f"Validation samples : {len(validation_examples)}"
    )

    # --------------------------------------------------
    # Check class distribution
    # --------------------------------------------------

    train_counts = Counter(
        example.label
        for example in train_examples
    )

    print("\nTraining class distribution:")
    print(
        f"Non-grooming (0): {train_counts.get(0, 0)}"
    )
    print(
        f"Grooming    (1): {train_counts.get(1, 0)}"
    )

    # --------------------------------------------------
    # Calculate class weights
    # --------------------------------------------------

    total = sum(train_counts.values())

    class_0_count = train_counts.get(0, 0)
    class_1_count = train_counts.get(1, 0)

    if class_0_count == 0 or class_1_count == 0:
        raise ValueError(
            "Training dataset must contain both classes."
        )

    weight_0 = total / (2 * class_0_count)
    weight_1 = total / (2 * class_1_count)

    class_weights = torch.tensor(
        [weight_0, weight_1],
        dtype=torch.float32,
        device=DEVICE,
    )

    print("\nClass weights:")
    print(
        f"Class 0 weight: {weight_0:.4f}"
    )
    print(
        f"Class 1 weight: {weight_1:.4f}"
    )

    # --------------------------------------------------
    # Dataloaders
    # --------------------------------------------------

    print("\nCreating dataloaders...")

    train_loader = create_dataloader(
        train_examples,
        batch_size=BATCH_SIZE,
        shuffle=True,
    )

    validation_loader = create_dataloader(
        validation_examples,
        batch_size=BATCH_SIZE,
        shuffle=False,
    )

    # --------------------------------------------------
    # Model
    # --------------------------------------------------

    print("\nBuilding model...")

    model = GroomingModel()

    # --------------------------------------------------
    # Weighted loss
    # --------------------------------------------------

    criterion = nn.CrossEntropyLoss(
        weight=class_weights
    )

    # --------------------------------------------------
    # Optimizer
    # --------------------------------------------------

    optimizer = AdamW(
        model.parameters(),
        lr=LEARNING_RATE,
        weight_decay=WEIGHT_DECAY,
    )

    # --------------------------------------------------
    # Trainer
    # --------------------------------------------------

    trainer = Trainer(
        model=model,
        optimizer=optimizer,
        criterion=criterion,
        train_loader=train_loader,
        validation_loader=validation_loader,
    )

    print()

    print("=" * 60)
    print(
        f"Training on {DEVICE.upper()}"
    )
    print("=" * 60)

    history = trainer.train()

    print()

    print("=" * 60)
    print("Training Finished")
    print("=" * 60)

    print()

    print(
        f"Best Epoch   : {history.best_epoch()}"
    )

    print(
        f"Best F1 Score: {history.best_f1():.4f}"
    )


if __name__ == "__main__":
    main()