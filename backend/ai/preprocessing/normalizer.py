import unicodedata


def normalize_unicode(text: str) -> str:
    """
    Normalize Unicode characters to NFC form.
    """
    return unicodedata.normalize("NFC", text)


def normalize_newlines(text: str) -> str:
    """
    Convert Windows and old Mac newlines to Unix style.
    """
    return text.replace("\r\n", "\n").replace("\r", "\n")


def normalize_case(text: str, lowercase: bool = True) -> str:
    """
    Convert text to lowercase if enabled.
    """
    return text.lower() if lowercase else text


def normalize_text(text: str, lowercase: bool = True) -> str:
    """
    Apply all normalization steps in sequence.
    """
    text = normalize_unicode(text)
    text = normalize_newlines(text)
    text = normalize_case(text, lowercase)
    return text