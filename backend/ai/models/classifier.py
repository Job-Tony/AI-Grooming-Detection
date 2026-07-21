from __future__ import annotations

import torch
from torch import nn

from ai.models.config import (
    LSTM_HIDDEN_SIZE,
    BIDIRECTIONAL,
    NUM_CLASSES,
)


class Classifier(nn.Module):
    """
    Classification head for the grooming detection model.
    """

    def __init__(self):
        super().__init__()

        input_size = (
            LSTM_HIDDEN_SIZE * 2
            if BIDIRECTIONAL
            else LSTM_HIDDEN_SIZE
        )

        self.classifier = nn.Linear(
            input_size,
            NUM_CLASSES,
        )

    def forward(
        self,
        features: torch.Tensor,
    ) -> torch.Tensor:
        """
        Args:
            features:
                Shape:
                (batch_size, feature_size)

        Returns:
            logits:
                Shape:
                (batch_size, num_classes)
        """

        return self.classifier(features)