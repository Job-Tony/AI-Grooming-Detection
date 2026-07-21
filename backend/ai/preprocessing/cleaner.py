import re

# Regular expression patterns
URL_PATTERN = re.compile(
    r"(https?://\S+|www\.\S+)",
    re.IGNORECASE
)

EMAIL_PATTERN = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
)

PHONE_PATTERN = re.compile(
    r"\+?\d[\d\s().-]{7,}\d"
)

WHITESPACE_PATTERN = re.compile(
    r"[ \t]+"
)


def replace_urls(text: str) -> str:
    """
    Replace URLs with a placeholder.
    """
    return URL_PATTERN.sub("<URL>", text)


def replace_emails(text: str) -> str:
    """
    Replace email addresses with a placeholder.
    """
    return EMAIL_PATTERN.sub("<EMAIL>", text)


def replace_phone_numbers(text: str) -> str:
    """
    Replace phone numbers with a placeholder.
    """
    return PHONE_PATTERN.sub("<PHONE>", text)


def clean_whitespace(text: str) -> str:
    """
    Remove extra spaces while preserving newlines.
    """
    text = WHITESPACE_PATTERN.sub(" ", text)
    return "\n".join(line.strip() for line in text.split("\n"))


def clean_text(text: str) -> str:
    """
    Apply all cleaning steps.
    """
    text = replace_urls(text)
    text = replace_emails(text)
    text = replace_phone_numbers(text)
    text = clean_whitespace(text)
    return text