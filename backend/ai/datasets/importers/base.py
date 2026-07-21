from __future__ import annotations

from abc import ABC, abstractmethod

from ai.datasets.schemas import ConversationExample


class DatasetImporter(ABC):
    """
    Base class for dataset importers.
    """

    @abstractmethod
    def build_examples(
        self,
    ) -> list[ConversationExample]:
        """
        Convert the dataset into ConversationExample objects.
        """
        raise NotImplementedError