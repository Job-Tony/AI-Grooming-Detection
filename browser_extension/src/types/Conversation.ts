export type MessageDirection = "incoming" | "outgoing";

export interface ChatMessage {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  direction: MessageDirection;
  platform: string;
}

export interface Conversation {
  platform: string;
  messages: ChatMessage[];
}