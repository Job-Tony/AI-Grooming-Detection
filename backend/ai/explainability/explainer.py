from __future__ import annotations

from typing import Sequence

import numpy as np
import shap
import torch
import torch.nn.functional as F

from ai.inference.preprocessing import ConversationPreprocessor
from ai.models.grooming_model import GroomingModel


class SHAPExplainer:
    """
    SHAP explainer for the grooming detection model.

    This class explains model predictions by assigning an
    importance value to each token in the input conversation.
    """

    def __init__(
        self,
        model: GroomingModel,
        preprocessor: ConversationPreprocessor,
        device: torch.device,
    ) -> None:

        self.model = model
        self.preprocessor = preprocessor
        self.device = device

        self.model.eval()

        self.masker = shap.maskers.Text(
            self.preprocessor.tokenizer
        )

        self.explainer = shap.Explainer(
            self._predict,
            self.masker,
        )

    @torch.no_grad()
    def _predict(
        self,
        texts: Sequence[str],
    ) -> np.ndarray:
        """
        Prediction function used internally by SHAP.

        Parameters
        ----------
        texts:
            Batch of conversations.

        Returns
        -------
        ndarray
            Shape:
                (batch_size, 2)

            Class probabilities.
        """

        encoded = self.preprocessor.tokenizer(
            list(texts),
            truncation=True,
            padding=True,
            max_length=self.preprocessor.max_length,
            return_tensors="pt",
        )

        input_ids = encoded["input_ids"].to(self.device)
        attention_mask = encoded["attention_mask"].to(self.device)

        logits = self.model(
            input_ids=input_ids,
            attention_mask=attention_mask,
        )

        probabilities = F.softmax(
            logits,
            dim=1,
        )

        return probabilities.cpu().numpy()

    def explain(
        self,
        conversation: str,
    ) -> shap.Explanation:
        """
        Generate SHAP values for a conversation.
        """

        return self.explainer([conversation])