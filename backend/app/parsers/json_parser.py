from __future__ import annotations

import json
from datetime import datetime

from app.parsers.base_parser import BaseParser
from app.parsers.parser_models import ParsedMessage


class JSONParser(BaseParser):
    def parse(
        self,
        file_path: str,
    ) -> list[ParsedMessage]:

        messages: list[ParsedMessage] = []

        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        if not isinstance(data, list):
            raise ValueError(
                "JSON file must contain a list of messages."
            )

        for order, item in enumerate(data, start=1):

            if not isinstance(item, dict):
                continue

            sender = str(item.get("sender", "")).strip()
            message = str(item.get("message", "")).strip()

            if not sender or not message:
                continue

            timestamp = None

            timestamp_str = str(item.get("timestamp", "")).strip()

            if timestamp_str:
                try:
                    timestamp = datetime.fromisoformat(timestamp_str)
                except ValueError:
                    pass

            messages.append(
                ParsedMessage(
                    sender=sender,
                    message=message,
                    timestamp=timestamp,
                    message_order=order,
                )
            )

        return messages