import { BaseExtractor } from "./BaseExtractor";
import type { Conversation } from "../types/Conversation";

export class TelegramExtractor extends BaseExtractor {
  canHandle(url: string): boolean {
    return url.includes("web.telegram.org");
  }

  async extractConversation(): Promise<Conversation> {
    const messageElements = Array.from(
      document.querySelectorAll(".message")
    );

    const messages = messageElements
      .map((element, index) => {
        const content = this.text(
          element.querySelector(".text-content")
        );

        const author = this.text(
          element.querySelector(".sender-title")
        );

        const timestamp = this.text(
          element.querySelector("time")
        );

        return this.createMessage(
          {
            id: `telegram_${index}`,
            author,
            content,
            timestamp,
            direction: "incoming",
          },
          "Telegram",
          index
        );
      })
      .filter((message) => message.content.length > 0);

    return {
      platform: "Telegram",
      messages: this.finalizeMessages(messages),
    };
  }
}