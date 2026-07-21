from __future__ import annotations

from dataclasses import dataclass

from ai.datasets.schemas import ConversationExample


@dataclass(slots=True)
class DatasetStatistics:
    """
    Stores summary statistics for a dataset.
    """

    total_conversations: int
    positive_conversations: int
    negative_conversations: int

    average_messages: float
    average_words: float
    average_characters: float

    longest_conversation_words: int
    shortest_conversation_words: int


class DatasetAnalyzer:
    """
    Computes statistics for a collection of ConversationExample objects.
    """

    def analyze(
        self,
        examples: list[ConversationExample],
    ) -> DatasetStatistics:
        """
        Analyze a dataset and return summary statistics.
        """

        if not examples:
            raise ValueError(
                "Dataset is empty."
            )

        total = len(examples)

        positive = sum(
            example.label == 1
            for example in examples
        )

        negative = sum(
            example.label == 0
            for example in examples
        )

        total_messages = sum(
            example.message_count
            for example in examples
        )

        word_counts = [
            len(example.text.split())
            for example in examples
        ]

        character_counts = [
            len(example.text)
            for example in examples
        ]

        return DatasetStatistics(
            total_conversations=total,
            positive_conversations=positive,
            negative_conversations=negative,
            average_messages=(
                total_messages / total
            ),
            average_words=(
                sum(word_counts) / total
            ),
            average_characters=(
                sum(character_counts) / total
            ),
            longest_conversation_words=max(
                word_counts
            ),
            shortest_conversation_words=min(
                word_counts
            ),
        )