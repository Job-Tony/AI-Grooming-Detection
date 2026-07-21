from ai.preprocessing.normalizer import normalize_text
from ai.preprocessing.cleaner import clean_text


def preprocess_text(
    text: str,
    lowercase: bool = True,
) -> str:
    """
    Complete preprocessing pipeline.

    Steps:
    1. Normalize Unicode
    2. Normalize newlines
    3. Convert to lowercase (optional)
    4. Replace URLs
    5. Replace emails
    6. Replace phone numbers
    7. Clean whitespace
    """

    text = normalize_text(
        text,
        lowercase=lowercase,
    )

    text = clean_text(text)

    return text