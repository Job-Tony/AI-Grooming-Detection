from __future__ import annotations

from sklearn.model_selection import train_test_split

from ai.datasets.schemas import ConversationExample


class DatasetSplitter:
    """
    Splits ConversationExample objects into
    training, validation, and testing datasets.
    """

    def split(
        self,
        examples: list[ConversationExample],
        train_size: float = 0.8,
        validation_size: float = 0.1,
        test_size: float = 0.1,
        random_state: int = 42,
    ) -> tuple[
        list[ConversationExample],
        list[ConversationExample],
        list[ConversationExample],
    ]:
        """
        Split the dataset while preserving
        class distribution.
        """

        if abs(
            train_size
            + validation_size
            + test_size
            - 1.0
        ) > 1e-9:
            raise ValueError(
                "Split ratios must sum to 1."
            )

        labels = [
            example.label
            for example in examples
        ]

        train_examples, temp_examples = train_test_split(
            examples,
            train_size=train_size,
            stratify=labels,
            random_state=random_state,
            shuffle=True,
        )

        temp_labels = [
            example.label
            for example in temp_examples
        ]

        validation_ratio = (
            validation_size
            / (validation_size + test_size)
        )

        validation_examples, test_examples = train_test_split(
            temp_examples,
            train_size=validation_ratio,
            stratify=temp_labels,
            random_state=random_state,
            shuffle=True,
        )

        return (
            train_examples,
            validation_examples,
            test_examples,
        )