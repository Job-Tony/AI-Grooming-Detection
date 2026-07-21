from __future__ import annotations

from torch.utils.data import DataLoader

from ai.tokenizer.dataset import ConversationDataset


class ConversationDataLoader:
    """
    Factory for creating PyTorch DataLoaders.
    """

    @staticmethod
    def create(
        dataset: ConversationDataset,
        batch_size: int = 16,
        shuffle: bool = True,
    ) -> DataLoader:
        """
        Create a DataLoader for the given dataset.
        """

        return DataLoader(
            dataset=dataset,
            batch_size=batch_size,
            shuffle=shuffle,
        )