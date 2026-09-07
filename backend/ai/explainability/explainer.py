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

    Generates token-level explanations for a conversation.

    To keep explanation generation practical on CPU deployments,
    SHAP is limited to a fixed explanation window and evaluation
    budget.

    The complete conversation is still used for the actual
    grooming-risk prediction. Only the text supplied to SHAP is
    limited for performance.
    """

    # -------------------------------------------------------------
    # Performance limits
    # -------------------------------------------------------------

    # Maximum number of tokens that SHAP will explain.
    MAX_EXPLANATION_TOKENS = 64

    # Maximum number of SHAP model evaluations.
    MAX_SHAP_EVALS = 129

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
            Batch of conversation texts.

        Returns
        -------
        np.ndarray
            Class probabilities with shape:
            (batch_size, 2)
        """

        encoded = self.preprocessor.tokenizer(
            list(texts),
            truncation=True,
            padding=True,
            max_length=self.preprocessor.max_length,
            return_tensors="pt",
        )

        input_ids = encoded["input_ids"].to(
            self.device
        )

        attention_mask = encoded["attention_mask"].to(
            self.device
        )

        logits = self.model(
            input_ids=input_ids,
            attention_mask=attention_mask,
        )

        probabilities = F.softmax(
            logits,
            dim=1,
        )

        return probabilities.detach().cpu().numpy()

    def _prepare_explanation_text(
        self,
        conversation: str,
    ) -> str:
        """
        Limit the text sent to SHAP.

        The complete conversation is still used by the model for
        the final prediction.

        For long conversations, SHAP receives a balanced window:
        - first 32 tokens
        - last 32 tokens

        This keeps the explanation fast while preserving both
        the beginning and latest context of the conversation.
        """

        tokenized = self.preprocessor.tokenizer(
            conversation,
            truncation=False,
            add_special_tokens=False,
        )

        input_ids = tokenized["input_ids"]

        # ---------------------------------------------------------
        # Short conversation
        # ---------------------------------------------------------

        if len(input_ids) <= self.MAX_EXPLANATION_TOKENS:
            return conversation

        # ---------------------------------------------------------
        # Balanced explanation window
        # ---------------------------------------------------------

        half_window = (
            self.MAX_EXPLANATION_TOKENS // 2
        )

        first_ids = input_ids[:half_window]

        last_ids = input_ids[-half_window:]

        selected_ids = first_ids + last_ids

        explanation_text = self.preprocessor.tokenizer.decode(
            selected_ids,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True,
        )

        return explanation_text

    def explain(
        self,
        conversation: str,
    ) -> shap.Explanation:
        """
        Generate SHAP values for a conversation.

        The complete conversation is used for the actual prediction,
        while SHAP receives a bounded explanation window.

        This significantly reduces SHAP processing time for long
        conversations on CPU deployments such as Render.
        """

        with self._lock:

            try:

                # -------------------------------------------------
                # Prepare bounded SHAP input
                # -------------------------------------------------

                explanation_text = (
                    self._prepare_explanation_text(
                        conversation
                    )
                )

                # -------------------------------------------------
                # Count tokens used by SHAP
                # -------------------------------------------------

                tokenized = self.preprocessor.tokenizer(
                    explanation_text,
                    truncation=True,
                    max_length=self.MAX_EXPLANATION_TOKENS,
                    add_special_tokens=False,
                )

                num_tokens = len(
                    tokenized["input_ids"]
                )

                # -------------------------------------------------
                # Count original conversation tokens
                # -------------------------------------------------

                original_tokenized = (
                    self.preprocessor.tokenizer(
                        conversation,
                        truncation=False,
                        add_special_tokens=False,
                    )
                )

                original_num_tokens = len(
                    original_tokenized["input_ids"]
                )

                # -------------------------------------------------
                # Calculate SHAP evaluation budget
                #
                # Required evaluations grow with the number of
                # tokens. However, we impose a hard upper limit
                # for CPU performance.
                # -------------------------------------------------

                required_evals = (
                    2 * num_tokens + 1
                )

                max_evals = min(
                    max(
                        required_evals,
                        50,
                    ),
                    self.MAX_SHAP_EVALS,
                )

                # -------------------------------------------------
                # Debug information
                # -------------------------------------------------

                print("=" * 80)
                print("SHAP DEBUG")
                print("=" * 80)

                print(
                    f"Original conversation tokens: "
                    f"{original_num_tokens}"
                )

                print(
                    f"SHAP explanation tokens: "
                    f"{num_tokens}"
                )

                print(
                    f"SHAP max evaluations: "
                    f"{max_evals}"
                )

                if explanation_text != conversation:
                    print(
                        "SHAP explanation window: "
                        f"first "
                        f"{self.MAX_EXPLANATION_TOKENS // 2} "
                        f"+ last "
                        f"{self.MAX_EXPLANATION_TOKENS // 2} "
                        f"tokens"
                    )

                print("=" * 80)

                # -------------------------------------------------
                # Generate SHAP explanation
                # -------------------------------------------------

                explanation = self.explainer(
                    [explanation_text],
                    max_evals=max_evals,
                )

                print(
                    "SHAP explanation generated successfully."
                )

                return explanation

            except Exception as e:

                import traceback

                print("\n" + "=" * 80)
                print("SHAP EXPLANATION FAILED")
                print("=" * 80)

                print(
                    f"Error type: {type(e).__name__}"
                )

                print(
                    f"Error message: {str(e)}"
                )

                traceback.print_exc()

                print("=" * 80 + "\n")

                raise