import type {
  ChatMessage,
  Conversation,
} from "../types/Conversation";

import { BaseExtractor } from "./BaseExtractor";

export class DiscordExtractor extends BaseExtractor {
  readonly platform = "Discord";

  canHandle(url: string): boolean {
    return url.includes("discord.com");
  }

  async extractConversation(): Promise<Conversation> {
    const messages: ChatMessage[] = [];

    const messageElements = document.querySelectorAll<HTMLElement>(
      'li[id^="chat-messages-"]',
    );

    console.log(
      `[DiscordExtractor] Found ${messageElements.length} messages`,
    );

    messageElements.forEach((element, index) => {
      try {
        // -----------------------------
        // Username
        // -----------------------------
        const username =
          this.textFromSelectors(element, [
            '[id^="message-username-"]',
            "[data-text]",
          ]) ||
          this.attrFromSelectors(
            element,
            ["[data-text]"],
            "data-text",
          ) ||
          "Unknown";

        // -----------------------------
        // Message Content
        // -----------------------------
        const content = this.textFromSelectors(
          element,
          ['[id^="message-content-"]'],
        );

        if (!content) {
          return;
        }

        // -----------------------------
        // Timestamp
        // -----------------------------
        const timestamp =
          this.attrFromSelectors(
            element,
            ['[id^="message-timestamp-"]'],
            "datetime",
          ) || new Date().toISOString();

        // -----------------------------
        // Direction
        // -----------------------------
        const direction =
          this.detectDirection(element);

        messages.push(
          this.createMessage(
            {
              author: username,
              content,
              timestamp,
              direction,
            },
            this.platform,
            index,
          ),
        );
      } catch (err) {
        console.warn(
          "[DiscordExtractor] Failed to parse message",
          err,
        );
      }
    });

    return {
      platform: this.platform,
      messages: this.finalizeMessages(messages),
    };
  }
}

export default DiscordExtractor;