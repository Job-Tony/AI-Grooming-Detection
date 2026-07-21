from __future__ import annotations

import re
from datetime import datetime

from app.parsers.base_parser import BaseParser
from app.parsers.parser_models import ParsedMessage


class TXTParser(BaseParser):
    """
    Parser for chat logs in the format:

    [2026-07-15 18:30:12] Alex: Hi!
    """

    CHAT_PATTERN = re.compile(
        r"^\[(?P<timestamp>.*?)\]\s+(?P<sender>.*?):\s+(?P<message>.*)$"
    )

    def parse(
        self,
        file_path: str,
    ) -> list[ParsedMessage]:

        messages: list[ParsedMessage] = []

        with open(file_path, "r", encoding="utf-8") as file:

            for order, line in enumerate(file, start=1):

                line = line.strip()

                if not line:
                    continue

                match = self.CHAT_PATTERN.match(line)

                if not match:
                    continue

                timestamp = None

                timestamp_str = match.group("timestamp")

                try:
                    timestamp = datetime.strptime(
                        timestamp_str,
                        "%Y-%m-%d %H:%M:%S",
                    )
                except ValueError:
                    pass

                messages.append(
                    ParsedMessage(
                        sender=match.group("sender").strip(),
                        message=match.group("message").strip(),
                        timestamp=timestamp,
                        message_order=order,
                    )
                )

        return messages