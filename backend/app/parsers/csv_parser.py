from __future__ import annotations

import csv
from datetime import datetime

from app.parsers.base_parser import BaseParser
from app.parsers.parser_models import ParsedMessage


class CSVParser(BaseParser):
    def parse(
        self,
        file_path: str,
    ) -> list[ParsedMessage]:

        messages: list[ParsedMessage] = []

        with open(file_path, "r", encoding="utf-8", newline="") as file:
            reader = csv.DictReader(file)

            required_columns = {"sender", "message"}

            if not required_columns.issubset(reader.fieldnames or []):
                raise ValueError(
                    "CSV must contain 'sender' and 'message' columns."
                )

            for order, row in enumerate(reader, start=1):
                sender = (row.get("sender") or "").strip()
                message = (row.get("message") or "").strip()

                if not sender or not message:
                    continue

                timestamp = None

                timestamp_str = (row.get("timestamp") or "").strip()

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