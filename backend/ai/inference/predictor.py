from __future__ import annotations

from pathlib import Path

import torch
import torch.nn.functional as F

from ai.explainability.explainer import SHAPExplainer
from ai.explainability.formatter import ExplanationFormatter
from ai.inference.postprocessing import PredictionPostprocessor
from ai.inference.preprocessing import ConversationPreprocessor
from ai.inference.schemas import (
    PredictionResult,
    PredictionWithExplanation,
)
from ai.models.grooming_model import GroomingModel
from ai.training.config import DEVICE


class GroomingPredictor:
    """
    Loads the trained model and performs inference.

    Automatically selects the correct checkpoint path for:
    - Local development
    - Render deployment
    """

    def __init__(
        self,
        checkpoint_path: str | Path | None = None,
    ) -> None:

        self.device = torch.device(DEVICE)

        self.preprocessor = ConversationPreprocessor()

        self.model = GroomingModel().to(self.device)

        # ---------------------------------------------------------
        # Select model checkpoint
        # ---------------------------------------------------------
        #
        # Render persistent disk:
        #     /data/grooming_model.pt
        #
        # Local development:
        #     backend/checkpoints/grooming_model.pt
        #
        if checkpoint_path is None:

            render_path = Path("/data/grooming_model.pt")
            local_path = Path("checkpoints/grooming_model.pt")

            if render_path.exists():
                checkpoint_path = render_path

            elif local_path.exists():
                checkpoint_path = local_path

            else:
                raise FileNotFoundError(
                    "Grooming model checkpoint not found. "
                    f"Checked:\n"
                    f"  Render: {render_path}\n"
                    f"  Local:  {local_path}"
                )

        checkpoint_path = Path(checkpoint_path)

        print("=" * 80)
        print("LOADING GROOMING MODEL")
        print("=" * 80)
        print(f"Checkpoint: {checkpoint_path}")
        print(f"Device: {self.device}")
        print("=" * 80)

        # ---------------------------------------------------------
        # Load checkpoint
        # ---------------------------------------------------------

        checkpoint = torch.load(
            checkpoint_path,
            map_location=self.device,
            weights_only=False,
        )

        # ---------------------------------------------------------
        # Extract model state dictionary
        # ---------------------------------------------------------

        if "model_state_dict" in checkpoint:
            state_dict = checkpoint["model_state_dict"]

        elif "state_dict" in checkpoint:
            state_dict = checkpoint["state_dict"]

        else:
            state_dict = checkpoint

        self.model.load_state_dict(state_dict)

        self.model.eval()

        print("Grooming model loaded successfully.")

        # ---------------------------------------------------------
        # Initialize SHAP explainer
        # ---------------------------------------------------------

        print("Initializing SHAP explainer...")

        self.explainer = SHAPExplainer(
            model=self.model,
            preprocessor=self.preprocessor,
            device=self.device,
        )

        print("SHAP explainer initialized.")
        print("=" * 80)

    @torch.no_grad()
    def predict(
        self,
        conversation: str | list[str],
    ) -> PredictionResult:
        """
        Predict grooming risk for a conversation.
        """

        encoded = self.preprocessor.tokenize(conversation)

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

        # Probability of the positive (grooming) class
        probability = probabilities[0][1].item()

        print("========== MODEL DEBUG ==========")
        print("Conversation:", conversation)
        print("Logits:", logits)
        print("Probabilities:", probabilities)
        print("Positive probability:", probability)
        print("=================================")

        return PredictionPostprocessor.build_result(
            probability
        )

    def predict_with_explanation(
        self,
        conversation: str | list[str],
    ) -> PredictionWithExplanation:
        """
        Predict grooming risk together with a SHAP explanation.
        """

        print("=" * 80)
        print("STARTING AI EXPLANATION")
        print("=" * 80)

        prediction = self.predict(conversation)

        text = self.preprocessor.prepare_text(conversation)

        print("Generating SHAP explanation...")

        shap_explanation = self.explainer.explain(text)

        print("SHAP explanation generated successfully.")

        explanation = ExplanationFormatter.format(
            shap_explanation
        )

        print("Explanation formatted successfully.")
        print("=" * 80)

        return PredictionWithExplanation(
            prediction=prediction,
            explanation=explanation,
        )