from __future__ import annotations

import string
from collections.abc import Sequence

import numpy as np
import shap

from ai.explainability.schemas import (
    ExplanationResult,
    ImportanceLevel,
    WordAttribution,
)
from ai.explainability.stopwords import STOP_WORDS
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
    def _clean_token(token: str) -> str:
        """
        Clean SHAP tokens before displaying them.
        """

        token = token.strip()

        token = token.strip(string.punctuation)

        return token

    @staticmethod
    def _summary(words: list[WordAttribution]) -> str:

        if not words:
            return (
                "The model did not identify any highly influential "
                "keywords for this prediction."
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
            "The model classified this conversation as potentially risky "
            "because the following keywords had the strongest influence on "
            f"its decision: {keywords}."
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

        seen: set[str] = set()

        for token, raw, norm in zip(tokens, values, normalized):

            token = ExplanationFormatter._clean_token(str(token))

            if not token:
                continue

            token_lower = token.lower()

            # Ignore stop words
            if token_lower in STOP_WORDS:
                continue

            # Ignore punctuation
            if all(c in string.punctuation for c in token):
                continue

            # Ignore single-character tokens
            if len(token) <= 1:
                continue

            # Ignore duplicates
            if token_lower in seen:
                continue

            seen.add(token_lower)

            importance = ExplanationFormatter._importance(float(norm))

            words.append(
                WordAttribution(
                    token=token,
                    score=float(raw),
                    normalized_score=float(norm),
                    importance=importance,
                    color=ExplanationFormatter._color(importance),
                )
            )

        words = merge_tokens(words)

        words = filter_words(
            words,
            minimum_score=0.05,
            positive_only=True,
            top_k=10,
        )

        # Highest importance first
        words.sort(
            key=lambda word: word.normalized_score,
            reverse=True,
        )

        return ExplanationResult(
            summary=ExplanationFormatter._summary(words),
            words=words,
        )