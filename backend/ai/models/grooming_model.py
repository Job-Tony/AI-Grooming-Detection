from __future__ import annotations

import torch
from torch import nn

from ai.models.bilstm import BiLSTM
from ai.models.classifier import Classifier
from ai.models.distilbert_encoder import DistilBERTEncoder


class GroomingModel(nn.Module):
    """
    Complete DistilBERT + BiLSTM model
    for online grooming detection.
    """

    def __init__(self):
        super().__init__()

        self.encoder = DistilBERTEncoder()
        self.bilstm = BiLSTM()
        self.classifier = Classifier()

    def forward(
        self,
        *,
        input_ids: torch.Tensor | None = None,
        attention_mask: torch.Tensor | None = None,
        inputs_embeds: torch.Tensor | None = None,
    ) -> torch.Tensor:
        """
        Forward pass through the complete model.

        Exactly one of `input_ids` or `inputs_embeds`
        should be provided.

        Args
        ----
        input_ids:
            Token IDs produced by the tokenizer.

        attention_mask:
            Attention mask produced by the tokenizer.

        inputs_embeds:
            Precomputed token embeddings.
            Used by Captum during explainability.

        Returns
        -------
        logits:
            (batch_size, num_classes)
        """

        embeddings = self.encoder(
            input_ids=input_ids,
            attention_mask=attention_mask,
            inputs_embeds=inputs_embeds,
        )

        features = self.bilstm(
            embeddings
        )

        logits = self.classifier(
            features
        )

        return logits