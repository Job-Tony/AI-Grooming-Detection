import type { Conversation } from "../types/Conversation";

export interface ConversationExtractor {
  canHandle(url: string): boolean;

  extractConversation(): Promise<Conversation>;
}