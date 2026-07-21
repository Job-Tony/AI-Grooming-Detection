from __future__ import annotations

import re

from ai.explainability.schemas import WordAttribution


# Ignore punctuation and special tokens.
SPECIAL_TOKENS = {
    "[CLS]",
    "[SEP]",
    "[PAD]",
    "[MASK]",
}

PUNCTUATION = {
    ".",
    ",",
    "?",
    "!",
    ":",
    ";",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "\"",
    "'",
    "`",
    "...",
    "-",
    "--",
}


def is_valid_token(token: str) -> bool:
    """
    Return True if the token should appear in the explanation.
    """

    token = token.strip()

    if not token:
        return False

    if token in SPECIAL_TOKENS:
        return False

    if token in PUNCTUATION:
        return False

    # Remove tokens consisting only of punctuation.
    if re.fullmatch(r"[^\w]+", token):
        return False

    return True


def merge_tokens(
    words: list[WordAttribution],
) -> list[WordAttribution]:
    """
    Merge WordPiece tokens and English contractions.

    Examples
    --------
    play ##ing -> playing

    you ' re -> you're

    don ' t -> don't

    I ' m -> I'm
    """

    if not words:
        return []

    merged: list[WordAttribution] = []

    i = 0

    while i < len(words):

        current = words[i]

        # Ignore punctuation/special tokens immediately.
        if not is_valid_token(current.token):
            i += 1
            continue

        token = current.token

        # Merge ##wordpieces
        while (
            i + 1 < len(words)
            and words[i + 1].token.startswith("##")
        ):
            nxt = words[i + 1]

            token += nxt.token[2:]

            if abs(nxt.score) > abs(current.score):
                current.score = nxt.score
                current.normalized_score = nxt.normalized_score
                current.importance = nxt.importance

            i += 1

        # Merge contractions:
        #
        # you ' re
        # don ' t
        # I ' m
        #
        if (
            i + 2 < len(words)
            and words[i + 1].token == "'"
            and words[i + 2].token.isalpha()
        ):
            token += "'" + words[i + 2].token

            nxt = words[i + 2]

            if abs(nxt.score) > abs(current.score):
                current.score = nxt.score
                current.normalized_score = nxt.normalized_score
                current.importance = nxt.importance

            i += 2

        current.token = token

        merged.append(current)

        i += 1

    return merged


def filter_words(
    words: list[WordAttribution],
    *,
    minimum_score: float = 0.05,
    positive_only: bool = True,
    top_k: int | None = 10,
) -> list[WordAttribution]:
    """
    Filter insignificant words.

    Parameters
    ----------
    minimum_score
        Minimum normalized score.

    positive_only
        Keep only positive SHAP contributions.

    top_k
        Maximum number of words returned.
    """

    filtered = []

    for word in words:

        if word.normalized_score < minimum_score:
            continue

        if positive_only and word.score <= 0:
            continue

        filtered.append(word)

    filtered.sort(
        key=lambda w: w.normalized_score,
        reverse=True,
    )

    if top_k is not None:
        filtered = filtered[:top_k]

    return filtered