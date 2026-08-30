from collections import deque

from discord import Message


class ConversationBuffer:
    """
    Maintains a rolling conversation history for each channel.
    """

    def __init__(self, max_messages: int = 20):
        self.max_messages = max_messages

        # channel_id -> deque[str]
        self.buffers: dict[int, deque[str]] = {}

    def add_message(self, message: Message) -> None:
        """Add a message to the appropriate channel buffer."""

        channel_id = message.channel.id

        if channel_id not in self.buffers:
            self.buffers[channel_id] = deque(maxlen=self.max_messages)

        content = message.content.strip()

        if content:
            self.buffers[channel_id].append(content)

    def get_conversation(self, channel_id: int) -> list[str]:
        """Return the buffered conversation."""

        return list(self.buffers.get(channel_id, []))

    def message_count(self, channel_id: int) -> int:
        """Return number of buffered messages."""

        return len(self.buffers.get(channel_id, []))

    def clear(self, channel_id: int) -> None:
        """Clear one channel buffer."""

        self.buffers.pop(channel_id, None)