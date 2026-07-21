from __future__ import annotations

from typing import List, Union

import torch
from transformers import AutoTokenizer


class ConversationPreprocessor:
    """
    Prepares conversations for inference using the same tokenizer
    and preprocessing strategy as training.
    """

    def __init__(
        self,
        model_name: str = "distilbert-base-uncased",
        max_length: int = 512,
    ) -> None:
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.max_length = max_length

    @staticmethod
    def clean_messages(messages: List[str]) -> List[str]:
        """
        Remove empty messages and trim whitespace.
        """
        cleaned = []

        for message in messages:
            message = message.strip()

            if message:
                cleaned.append(message)

        return cleaned

    @staticmethod
    def merge_messages(messages: List[str]) -> str:
        """
        Merge conversation into a single text block.
        """
        return "\n".join(messages)

    def prepare_text(self, conversation: Union[str, List[str]]) -> str:
        """
        Convert input into one cleaned conversation string.
        """

        if isinstance(conversation, str):
            conversation = [conversation]

        cleaned = self.clean_messages(conversation)

        return self.merge_messages(cleaned)

    def tokenize(self, conversation: Union[str, List[str]]) -> dict[str, torch.Tensor]:
        """
        Convert conversation into tensors for the model.
        """

        text = self.prepare_text(conversation)

        encoded = self.tokenizer(
            text,
            truncation=True,
            padding="max_length",
            max_length=self.max_length,
            return_tensors="pt",
        )

        return encoded