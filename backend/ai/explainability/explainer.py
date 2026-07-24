from __future__ import annotations

from threading import Lock
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

    Generates token-level explanations for a conversation using
    SHAP's Text masker.

    A threading lock is used because SHAP's Text explainer is not
    thread-safe. This prevents concurrent requests from causing
    intermittent failures.
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

        # Prevent concurrent SHAP executions.
        self._lock = Lock()

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

        return probabilities.detach().cpu().numpy()

    def explain(
        self,
        conversation: str,
    ) -> shap.Explanation:
        """
        Generate SHAP values for a conversation.

        A lock is used because SHAP's text explainer is not
        thread-safe.
        """

        with self._lock:
            try:
                return self.explainer([conversation])

            except Exception as e:
                import traceback

                print("\n" + "=" * 80)
                print("SHAP EXPLANATION FAILED")
                print("=" * 80)
                print(type(e).__name__)
                print(str(e))
                traceback.print_exc()
                print("=" * 80 + "\n")

                raise