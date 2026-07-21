from __future__ import annotations

from transformers import AutoTokenizer

from ai.tokenizer.config import (
    MODEL_NAME,
    MAX_LENGTH,
    PADDING,
    TRUNCATION,
    RETURN_TENSORS,
)


class DistilBERTTokenizer:
    """
    Wrapper around the Hugging Face DistilBERT tokenizer.
    """

    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(
            MODEL_NAME
        )

    def encode(
        self,
        text: str,
    ) -> dict:
        """
        Encode a single conversation.
        """

        return self.tokenizer(
            text,
            max_length=MAX_LENGTH,
            padding=PADDING,
            truncation=TRUNCATION,
            return_tensors=RETURN_TENSORS,
        )

    def batch_encode(
        self,
        texts: list[str],
    ) -> dict:
        """
        Encode multiple conversations.
        """

        return self.tokenizer(
            texts,
            max_length=MAX_LENGTH,
            padding=PADDING,
            truncation=TRUNCATION,
            return_tensors=RETURN_TENSORS,
        )

    def decode(
        self,
        input_ids,
    ) -> str:
        """
        Decode token IDs back into text.
        """

        return self.tokenizer.decode(
            input_ids,
            skip_special_tokens=True,
        )