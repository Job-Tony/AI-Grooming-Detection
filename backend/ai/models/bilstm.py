from __future__ import annotations

import torch
from torch import nn

from ai.models.config import (
    HIDDEN_SIZE,
    LSTM_HIDDEN_SIZE,
    LSTM_NUM_LAYERS,
    BIDIRECTIONAL,
    DROPOUT,
)


class BiLSTM(nn.Module):
    """
    Bidirectional LSTM for processing DistilBERT embeddings.
    """

    def __init__(self):
        super().__init__()

        self.lstm = nn.LSTM(
            input_size=HIDDEN_SIZE,
            hidden_size=LSTM_HIDDEN_SIZE,
            num_layers=LSTM_NUM_LAYERS,
            batch_first=True,
            bidirectional=BIDIRECTIONAL,
        )

        self.dropout = nn.Dropout(
            p=DROPOUT
        )

    def forward(
        self,
        embeddings: torch.Tensor,
    ) -> torch.Tensor:
        """
        Args:
            embeddings:
                Shape:
                (batch_size, sequence_length, hidden_size)

        Returns:
            Shape:
            (batch_size, lstm_output_size)
        """

        output, (hidden, _) = self.lstm(
            embeddings
        )

        if BIDIRECTIONAL:
            forward_hidden = hidden[-2]
            backward_hidden = hidden[-1]

            features = torch.cat(
                (
                    forward_hidden,
                    backward_hidden,
                ),
                dim=1,
            )
        else:
            features = hidden[-1]

        return self.dropout(
            features
        )