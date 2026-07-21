from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class ImportanceLevel(str, Enum):
    """
    Human-readable importance categories assigned to normalized
    attribution scores.
    """

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass(slots=True)
class WordAttribution:
    """
    Attribution information for a single word.
    """

    token: str
    score: float
    normalized_score: float
    importance: ImportanceLevel
    color: str


@dataclass(slots=True)
class ExplanationResult:
    """
    Complete explanation returned by SHAP.
    """

    summary: str
    words: list[WordAttribution]