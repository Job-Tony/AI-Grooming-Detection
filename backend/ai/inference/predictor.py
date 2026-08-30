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
    """

    def __init__(
        self,
        checkpoint_path: str | Path = "/data/checkpoints/grooming_model.pt",
    ) -> None:

        self.device = torch.device(DEVICE)

        self.preprocessor = ConversationPreprocessor()

        self.model = GroomingModel().to(self.device)

        checkpoint = torch.load(
            checkpoint_path,
            map_location=self.device,
            weights_only=False,
        )

        if "model_state_dict" in checkpoint:
            state_dict = checkpoint["model_state_dict"]

        elif "state_dict" in checkpoint:
            state_dict = checkpoint["state_dict"]

        else:
            state_dict = checkpoint

        self.model.load_state_dict(state_dict)

        self.model.eval()

        # Initialize SHAP explainer
        self.explainer = SHAPExplainer(
            model=self.model,
            preprocessor=self.preprocessor,
            device=self.device,
        )

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

        prediction = self.predict(conversation)

        text = self.preprocessor.prepare_text(conversation)

        shap_explanation = self.explainer.explain(text)

        explanation = ExplanationFormatter.format(
            shap_explanation
        )

        return PredictionWithExplanation(
            prediction=prediction,
            explanation=explanation,
        )
