from __future__ import annotations

import torch
from torch.utils.data import Dataset

from ai.datasets.schemas import ConversationExample
from ai.tokenizer.tokenizer import DistilBERTTokenizer


class GroomingDataset(Dataset):
    """
    PyTorch Dataset for grooming detection.
    """

    def __init__(
        self,
        examples: list[ConversationExample],
    ):
        self.examples = examples
        self.tokenizer = DistilBERTTokenizer()

    def __len__(self):
        return len(self.examples)

    def __getitem__(self, index: int):
        example = self.examples[index]

        encoding = self.tokenizer.encode(
            example.text
        )

        item = {
            "input_ids": encoding["input_ids"].squeeze(0),
            "attention_mask": encoding["attention_mask"].squeeze(0),
        }

        if example.label is not None:
            item["label"] = torch.tensor(
                example.label,
                dtype=torch.long,
            )

        return item