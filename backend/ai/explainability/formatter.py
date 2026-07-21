from __future__ import annotations

from collections.abc import Sequence

import numpy as np
import shap

from ai.explainability.schemas import (
    ExplanationResult,
    ImportanceLevel,
    WordAttribution,
)
from ai.explainability.utils import (
    filter_words,
    merge_tokens,
)


class ExplanationFormatter:

    @staticmethod
    def _importance(score: float) -> ImportanceLevel:

        if score >= 0.75:
            return ImportanceLevel.CRITICAL

        if score >= 0.50:
            return ImportanceLevel.HIGH

        if score >= 0.25:
            return ImportanceLevel.MEDIUM

        return ImportanceLevel.LOW

    @staticmethod
    def _color(level: ImportanceLevel) -> str:

        return {
            ImportanceLevel.LOW: "#22C55E",
            ImportanceLevel.MEDIUM: "#EAB308",
            ImportanceLevel.HIGH: "#F97316",
            ImportanceLevel.CRITICAL: "#DC2626",
        }[level]

    @staticmethod
    def _summary(words: list[WordAttribution]) -> str:

        if not words:
            return (
                "No significant words contributed strongly to the prediction."
            )

        top = [w.token for w in words[:5]]

        if len(top) == 1:
            keywords = f"'{top[0]}'"

        elif len(top) == 2:
            keywords = f"'{top[0]}' and '{top[1]}'"

        else:
            keywords = (
                ", ".join(f"'{w}'" for w in top[:-1])
                + f", and '{top[-1]}'"
            )

        return (
            "The model identified this conversation as potentially risky "
            f"because words such as {keywords} had the strongest positive "
            "influence on the prediction."
        )

    @staticmethod
    def format(
        explanation: shap.Explanation,
        class_index: int = 1,
    ) -> ExplanationResult:

        values = explanation.values[0]

        if values.ndim == 2:
            values = values[:, class_index]

        tokens: Sequence[str] = explanation.data[0]

        scores = np.abs(values)

        maximum = scores.max()

        normalized = scores / maximum if maximum > 0 else scores

        words: list[WordAttribution] = []

        for token, raw, norm in zip(tokens, values, normalized):

            token = str(token).strip()

            if not token:
                continue

            importance = ExplanationFormatter._importance(
                float(norm)
            )

            words.append(
                WordAttribution(
                    token=token,
                    score=float(raw),
                    normalized_score=float(norm),
                    importance=importance,
                    color=ExplanationFormatter._color(
                        importance
                    ),
                )
            )

        words = merge_tokens(words)

        words = filter_words(
            words,
            minimum_score=0.05,
            positive_only=True,
            top_k=10,
        )

        return ExplanationResult(
            summary=ExplanationFormatter._summary(words),
            words=words,
        )