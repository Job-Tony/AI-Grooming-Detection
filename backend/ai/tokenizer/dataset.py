from __future__ import annotations

import torch
from torch.utils.data import Dataset

from ai.datasets.schemas import ConversationExample
from ai.tokenizer.tokenizer import DistilBERTTokenizer


class ConversationDataset(Dataset):
    """
    PyTorch Dataset for ConversationExample objects.
    """

    def __init__(
        self,
        examples: list[ConversationExample],
        tokenizer: DistilBERTTokenizer,
    ):
        self.examples = examples
        self.tokenizer = tokenizer

    def __len__(self) -> int:
        """
        Return the number of conversations.
        """

        return len(self.examples)

    def __getitem__(
        self,
        index: int,
    ) -> dict[str, torch.Tensor]:

        example = self.examples[index]

        encoding = self.tokenizer.encode(
            example.text
        )

        return {
            "input_ids": encoding["input_ids"].squeeze(0),
            "attention_mask": encoding[
                "attention_mask"
            ].squeeze(0),
            "label": torch.tensor(
                example.label,
                dtype=torch.long,
            ),
        }