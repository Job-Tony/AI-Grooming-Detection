from __future__ import annotations

from pathlib import Path

from ai.datasets.cleaning import DatasetCleaner
from ai.datasets.importers.pan12 import PAN12Importer
from ai.datasets.serializer import DatasetSerializer
from ai.datasets.splitter import DatasetSplitter


# Project root
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# PAN12 dataset directory
DATASET_DIRECTORY = (
    PROJECT_ROOT
    / "datasets"
    / "raw"
    / "pan12"
    / "pan12-sexual-predator-identification-training-corpus-2012-05-01"
)

# Output directory
OUTPUT_DIRECTORY = (
    Path(__file__).resolve().parent.parent
    / "ai"
    / "datasets"
    / "processed"
)


def main() -> None:

    print("=" * 60)
    print("Building PAN12 Dataset")
    print("=" * 60)

    print()

    print(f"Dataset directory : {DATASET_DIRECTORY}")

    if not DATASET_DIRECTORY.exists():
        raise FileNotFoundError(
            f"Dataset directory not found:\n{DATASET_DIRECTORY}"
        )

    print("Loading PAN12 dataset...")

    importer = PAN12Importer(
        DATASET_DIRECTORY
    )

    examples = importer.build_examples()

    print(
        f"Loaded {len(examples)} conversations."
    )

    print()

    print("Cleaning dataset...")

    cleaner = DatasetCleaner()

    examples = cleaner.clean(examples)

    print(
        f"Remaining {len(examples)} conversations."
    )

    print()

    print("Splitting dataset...")

    splitter = DatasetSplitter()

    (
        train_examples,
        validation_examples,
        test_examples,
    ) = splitter.split(examples)

    OUTPUT_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True,
    )

    serializer = DatasetSerializer()

    print()

    print("Saving datasets...")

    serializer.save(
        train_examples,
        OUTPUT_DIRECTORY / "train.json",
    )

    serializer.save(
        validation_examples,
        OUTPUT_DIRECTORY / "validation.json",
    )

    serializer.save(
        test_examples,
        OUTPUT_DIRECTORY / "test.json",
    )

    print()

    print("=" * 60)
    print("Dataset Build Completed")
    print("=" * 60)

    print(f"Training     : {len(train_examples)}")
    print(f"Validation   : {len(validation_examples)}")
    print(f"Testing      : {len(test_examples)}")

    print()

    print("Files saved to:")

    print(
        OUTPUT_DIRECTORY / "train.json"
    )

    print(
        OUTPUT_DIRECTORY / "validation.json"
    )

    print(
        OUTPUT_DIRECTORY / "test.json"
    )


if __name__ == "__main__":
    main()