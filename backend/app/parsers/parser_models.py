from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass
class ParsedMessage:
    sender: str
    message: str
    timestamp: datetime | None = None
    message_order: int = 0