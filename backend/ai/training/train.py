from __future__ import annotations

from pathlib import Path

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

    print("\nBuilding model...")

    model = GroomingModel()

    criterion = nn.CrossEntropyLoss()

    optimizer = AdamW(
        model.parameters(),
        lr=LEARNING_RATE,
        weight_decay=WEIGHT_DECAY,
    )

    trainer = Trainer(
        model=model,
        optimizer=optimizer,
        criterion=criterion,
        train_loader=train_loader,
        validation_loader=validation_loader,
    )

    print()

    print("=" * 60)
    print(f"Training on {DEVICE.upper()}")
    print("=" * 60)

    history = trainer.train()

    print()

    print("=" * 60)
    print("Training Finished")
    print("=" * 60)

    print()

    print(
        f"Best Epoch : {history.best_epoch()}"
    )

    print(
        f"Best F1 Score : {history.best_f1():.4f}"
    )


if __name__ == "__main__":
    main()