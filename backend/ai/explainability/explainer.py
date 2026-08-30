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

    A threading lock is used because SHAP's text explainer is not
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

        # ---------------------------------------------------------
        # SHAP text masker
        # ---------------------------------------------------------

        self.masker = shap.maskers.Text(
            self.preprocessor.tokenizer
        )

        # ---------------------------------------------------------
        # SHAP explainer
        # ---------------------------------------------------------

        self.explainer = shap.Explainer(
            self._predict,
            self.masker,
        )

        # ---------------------------------------------------------
        # SHAP is not thread-safe.
        # ---------------------------------------------------------

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

        SHAP TextExplainer can become extremely expensive for long
        conversations. Therefore, the number of evaluations is
        limited to keep API requests practical.

        A lock is used because SHAP's text explainer is not
        thread-safe.
        """

        with self._lock:

            try:

                # -------------------------------------------------
                # Determine the number of model tokens.
                # -------------------------------------------------

                tokenized = self.preprocessor.tokenizer(
                    conversation,
                    truncation=True,
                    max_length=self.preprocessor.max_length,
                    add_special_tokens=False,
                )

                num_tokens = len(
                    tokenized["input_ids"]
                )

                # -------------------------------------------------
                # Limit SHAP evaluations.
                #
                # At least enough evaluations for a small text,
                # but never exceed 500.
                # -------------------------------------------------

                max_evals = min(
                    max(
                        2 * num_tokens + 1,
                        100,
                    ),
                    500,
                )

                print("=" * 80)
                print("SHAP DEBUG")
                print("=" * 80)
                print(f"Conversation tokens: {num_tokens}")
                print(f"SHAP max evaluations: {max_evals}")
                print("=" * 80)

                # -------------------------------------------------
                # Generate explanation.
                # -------------------------------------------------

                return self.explainer(
                    [conversation],
                    max_evals=max_evals,
                )

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