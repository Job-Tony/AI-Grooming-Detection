from __future__ import annotations

import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path

from ai.datasets.importers.base import DatasetImporter
from ai.datasets.schemas import ConversationExample


@dataclass(slots=True)
class PAN12Message:
    """
    Represents a single message in a PAN12 conversation.
    """

    author: str
    timestamp: str
    text: str


@dataclass(slots=True)
class PAN12Conversation:
    """
    Represents a single PAN12 conversation.
    """

    conversation_id: str
    messages: list[PAN12Message]


class PAN12Importer(DatasetImporter):
    """
    Imports the PAN12 training dataset.
    """

    def __init__(
        self,
        dataset_dir: str | Path,
    ):
        self.dataset_dir = Path(dataset_dir)

        self.xml_path = (
            self.dataset_dir
            / "pan12-sexual-predator-identification-training-corpus-2012-05-01.xml"
        )

        self.predators_path = (
            self.dataset_dir
            / "pan12-sexual-predator-identification-training-corpus-predators-2012-05-01.txt"
        )

    def load_predators(self) -> set[str]:
        """
        Load predator user IDs from the PAN12 label file.
        """

        with self.predators_path.open(
            mode="r",
            encoding="utf-8",
        ) as file:

            predators = {
                line.strip()
                for line in file
                if line.strip()
            }

        return predators

    def parse_xml(self):
        """
        Stream the PAN12 XML file and yield one conversation at a time.
        """

        context = ET.iterparse(
            self.xml_path,
            events=("end",),
        )

        for _, elem in context:

            if elem.tag != "conversation":
                continue

            conversation_id = elem.attrib.get("id", "")

            messages: list[PAN12Message] = []

            for message in elem.findall("message"):

                messages.append(
                    PAN12Message(
                        author=message.findtext("author", default=""),
                        timestamp=message.findtext("time", default=""),
                        text=message.findtext("text", default=""),
                    )
                )

            yield PAN12Conversation(
                conversation_id=conversation_id,
                messages=messages,
            )

            # Free memory after processing this conversation
            elem.clear()

    def build_examples(self) -> list[ConversationExample]:
        """
        Convert the PAN12 dataset into ConversationExample objects.
        """

        predators = self.load_predators()

        examples: list[ConversationExample] = []

        for conversation in self.parse_xml():

            label = any(
                message.author in predators
                for message in conversation.messages
            )

            conversation_text = "\n".join(
                f"{message.author}: {message.text}"
                for message in conversation.messages
            )

            examples.append(
                ConversationExample(
                    conversation_id=conversation.conversation_id,
                    text=conversation_text,
                    label=int(label),
                    message_count=len(conversation.messages),
                )
            )

        return examples