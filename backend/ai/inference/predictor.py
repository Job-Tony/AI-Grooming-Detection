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

    def _apply_behavioral_safety_layer(
        self,
        conversation: str | list[str],
        ml_probability: float,
    ) -> float:
        """
        Adds a safety-oriented behavioral signal layer on top of
        the neural model prediction.

        The trained DistilBERT + BiLSTM probability remains the
        primary ML signal. This layer prevents obvious combinations
        of grooming indicators from being classified as low risk
        solely because the neural model missed the pattern.
        """

        text = self.preprocessor.prepare_text(conversation)
        text_lower = text.lower()

        # ---------------------------------------------------------
        # Grooming behavioral indicators
        # ---------------------------------------------------------

        secrecy_signals = [
            "don't tell your parents",
            "dont tell your parents",
            "don't tell anyone",
            "dont tell anyone",
            "don't tell your friends",
            "dont tell your friends",
            "keep this private",
            "keep this between us",
            "keep our conversations private",
            "private conversations",
            "somewhere private",
            "talk somewhere private",
            "move this somewhere private",
            "only we can talk",
            "don't tell your mom",
            "dont tell your mom",
            "don't tell your dad",
            "dont tell your dad",
        ]

        age_manipulation_signals = [
            "you seem really mature for your age",
            "you're mature for your age",
            "you are mature for your age",
            "mature for your age",
            "you're so mature",
            "you are so mature",
            "you seem mature",
        ]

        isolation_signals = [
            "don't tell your friends",
            "dont tell your friends",
            "don't tell anyone",
            "dont tell anyone",
            "your parents don't need to know",
            "your parents dont need to know",
            "no one needs to know",
            "keep this between us",
            "only we can talk",
        ]

        private_platform_signals = [
            "move this somewhere private",
            "talk somewhere private",
            "somewhere private",
            "private chat",
            "private message",
            "private messages",
            "do you have snapchat",
            "give me your username",
            "what's your snapchat",
            "whats your snapchat",
            "instagram username",
            "discord username",
        ]

        # ---------------------------------------------------------
        # Count distinct behavioral signals
        # ---------------------------------------------------------

        secrecy_count = sum(
            signal in text_lower
            for signal in secrecy_signals
        )

        age_manipulation_count = sum(
            signal in text_lower
            for signal in age_manipulation_signals
        )

        isolation_count = sum(
            signal in text_lower
            for signal in isolation_signals
        )

        private_platform_count = sum(
            signal in text_lower
            for signal in private_platform_signals
        )

        # ---------------------------------------------------------
        # Detect explicit minor age references
        # ---------------------------------------------------------

        minor_reference = any(
            phrase in text_lower
            for phrase in [
                "i'm 13",
                "im 13",
                "i am 13",
                "i'm 14",
                "im 14",
                "i am 14",
                "i'm 15",
                "im 15",
                "i am 15",
                "i'm 16",
                "im 16",
                "i am 16",
                "i'm 17",
                "im 17",
                "i am 17",
            ]
        )

        # ---------------------------------------------------------
        # Calculate behavioral risk
        # ---------------------------------------------------------

        behavioral_probability = ml_probability

        # Strongest pattern:
        #
        # Minor + secrecy/isolation/private communication
        #
        if minor_reference:
            strong_minor_signals = (
                secrecy_count
                + isolation_count
                + private_platform_count
                + age_manipulation_count
            )

            if strong_minor_signals >= 2:
                behavioral_probability = max(
                    behavioral_probability,
                    0.98,
                )

            elif strong_minor_signals >= 1:
                behavioral_probability = max(
                    behavioral_probability,
                    0.85,
                )

        # Multiple grooming behaviors even without an
        # explicit minor age reference.
        elif (
            secrecy_count >= 2
            and private_platform_count >= 1
        ):
            behavioral_probability = max(
                behavioral_probability,
                0.90,
            )

        elif (
            secrecy_count >= 3
            or (
                age_manipulation_count >= 1
                and private_platform_count >= 1
            )
        ):
            behavioral_probability = max(
                behavioral_probability,
                0.90,
            )

        # ---------------------------------------------------------
        # Debug information
        # ---------------------------------------------------------

        print("========== BEHAVIORAL SAFETY DEBUG ==========")
        print(
            "ML probability:",
            ml_probability,
        )
        print(
            "Minor reference:",
            minor_reference,
        )
        print(
            "Secrecy signals:",
            secrecy_count,
        )
        print(
            "Age manipulation signals:",
            age_manipulation_count,
        )
        print(
            "Isolation signals:",
            isolation_count,
        )
        print(
            "Private-platform signals:",
            private_platform_count,
        )
        print(
            "Final probability:",
            behavioral_probability,
        )
        print("=============================================")

        return behavioral_probability

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

        # ---------------------------------------------------------
        # Original neural model probability
        # ---------------------------------------------------------

        ml_probability = probabilities[0][1].item()

        print("========== MODEL DEBUG ==========")
        print("Conversation:", conversation)
        print("Logits:", logits)
        print("Probabilities:", probabilities)
        print(
            "ML positive probability:",
            ml_probability,
        )
        print("=================================")

        # ---------------------------------------------------------
        # Apply behavioral safety layer
        # ---------------------------------------------------------

        probability = self._apply_behavioral_safety_layer(
            conversation,
            ml_probability,
        )

        # ---------------------------------------------------------
        # Build final prediction
        # ---------------------------------------------------------

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