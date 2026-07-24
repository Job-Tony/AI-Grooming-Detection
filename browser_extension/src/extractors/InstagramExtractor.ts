import { BaseExtractor } from "./BaseExtractor";
import type { Conversation } from "../types/Conversation";

export class InstagramExtractor extends BaseExtractor {
  canHandle(url: string): boolean {
    return url.includes("instagram.com");
  }

  async extractConversation(): Promise<Conversation> {
    const messageElements = Array.from(
      document.querySelectorAll('[role="row"]')
    );

    const messages = messageElements
      .map((element, index) => {
        const content = this.text(
          element.querySelector("span")
        );

        return this.createMessage(
          {
            id: `instagram_${index}`,
            author: "Unknown",
            content,
            timestamp: "",
            direction: "incoming",
          },
          "Instagram",
          index
        );
      })
      .filter((message) => message.content.length > 0);

    return {
      platform: "Instagram",
      messages: this.finalizeMessages(messages),
    };
  }
}