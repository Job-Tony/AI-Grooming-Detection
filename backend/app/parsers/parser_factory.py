from __future__ import annotations

from pathlib import Path

from app.parsers.base_parser import BaseParser
from app.parsers.csv_parser import CSVParser
from app.parsers.json_parser import JSONParser
from app.parsers.txt_parser import TXTParser


class ParserFactory:
    @staticmethod
    def get_parser(file_path: str) -> BaseParser:
        extension = Path(file_path).suffix.lower()

        match extension:
            case ".txt":
                return TXTParser()

            case ".csv":
                return CSVParser()

            case ".json":
                return JSONParser()

            case _:
                raise ValueError(
                    f"Unsupported file format: {extension}"
                )