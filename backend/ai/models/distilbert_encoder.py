from __future__ import annotations

import torch
import torch.nn as nn
from transformers import DistilBertModel

from ai.models.config import MODEL_NAME


class DistilBERTEncoder(nn.Module):
    """
    Wrapper around Hugging Face DistilBERT.

    Responsibilities
    ----------------
    - Load the pretrained DistilBERT model.
    - Produce contextual token embeddings.
    - Expose the embedding layer for explainability.
    """

    def __init__(self):
        super().__init__()

        self.encoder = DistilBertModel.from_pretrained(
            MODEL_NAME
        )

    def forward(
        self,
        *,
        input_ids: torch.Tensor | None = None,
        attention_mask: torch.Tensor | None = None,
        inputs_embeds: torch.Tensor | None = None,
    ) -> torch.Tensor:
        """
        Produce contextual token representations.

        Exactly one of `input_ids` or `inputs_embeds`
        must be provided.

        Args
        ----
        input_ids:
            (batch_size, sequence_length)

        attention_mask:
            (batch_size, sequence_length)

        inputs_embeds:
            (batch_size, sequence_length, hidden_size)

        Returns
        -------
        last_hidden_state:
            (batch_size, sequence_length, hidden_size)
        """

        if (input_ids is None) == (inputs_embeds is None):
            raise ValueError(
                "Exactly one of input_ids or inputs_embeds must be provided."
            )

        outputs = self.encoder(
            input_ids=input_ids,
            inputs_embeds=inputs_embeds,
            attention_mask=attention_mask,
            return_dict=True,
        )

        return outputs.last_hidden_state

    def get_input_embeddings(self) -> nn.Module:
        """
        Return the DistilBERT input embedding layer.

        Used by Captum LayerIntegratedGradients.
        """

        return self.encoder.get_input_embeddings()

    @property
    def hidden_size(self) -> int:
        """
        Hidden dimension of DistilBERT.
        """

        return self.encoder.config.hidden_size