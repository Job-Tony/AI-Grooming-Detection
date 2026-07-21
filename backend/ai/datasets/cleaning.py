from __future__ import annotations

from ai.datasets.schemas import ConversationExample


class DatasetCleaner:
    """
    Cleans and validates ConversationExample objects before training.
    """

    def clean(
        self,
        examples: list[ConversationExample],
    ) -> list[ConversationExample]:
        """
        Remove invalid conversations from the dataset.
        """

        cleaned: list[ConversationExample] = []
        seen_ids: set[str] = set()

        for example in examples:

            conversation_id = str(
                example.conversation_id
            )

            # Remove duplicate conversations.
            if conversation_id in seen_ids:
                continue

            seen_ids.add(conversation_id)

            # Remove conversations without text.
            if not example.text.strip():
                continue

            # Remove conversations without messages.
            if example.message_count <= 0:
                continue

            # Ignore invalid labels.
            if (
                example.label is not None
                and example.label not in (0, 1)
            ):
                continue

            cleaned.append(example)

        return cleaned