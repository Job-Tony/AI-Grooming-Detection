from __future__ import annotations

from abc import ABC, abstractmethod

from app.parsers.parser_models import ParsedMessage


class BaseParser(ABC):
    @abstractmethod
    def parse(
        self,
        file_path: str,
    ) -> list[ParsedMessage]:
        """
        Parse a chat file and return a list of parsed messages.
        """
        raise NotImplementedError