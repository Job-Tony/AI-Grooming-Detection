from __future__ import annotations

import json
from pathlib import Path
from uuid import UUID

from ai.datasets.schemas import ConversationExample


class DatasetSerializer:
    """
    Saves and loads ConversationExample objects.
    """

    def save(
        self,
        examples: list[ConversationExample],
        output_path: str | Path,
    ) -> None:
        """
        Save ConversationExample objects as JSON.
        """

        output_path = Path(output_path)
        output_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        data = [
            {
                "conversation_id": str(
                    example.conversation_id
                ),
                "text": example.text,
                "label": example.label,
                "message_count": example.message_count,
            }
            for example in examples
        ]

        with output_path.open(
            "w",
            encoding="utf-8",
        ) as file:
            json.dump(
                data,
                file,
                indent=4,
                ensure_ascii=False,
            )

    def load(
        self,
        input_path: str | Path,
    ) -> list[ConversationExample]:
        """
        Load ConversationExample objects from JSON.
        """

        input_path = Path(input_path)

        with input_path.open(
            "r",
            encoding="utf-8",
        ) as file:
            data = json.load(file)

        examples: list[
            ConversationExample
        ] = []

        for item in data:

            conversation_id = item[
                "conversation_id"
            ]

            # Convert UUID strings back to UUID
            # when possible.
            try:
                conversation_id = UUID(
                    conversation_id
                )
            except (
                ValueError,
                TypeError,
            ):
                pass

            examples.append(
                ConversationExample(
                    conversation_id=conversation_id,
                    text=item["text"],
                    label=item["label"],
                    message_count=item[
                        "message_count"
                    ],
                )
            )

        return examples