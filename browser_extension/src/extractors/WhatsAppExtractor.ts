import { BaseExtractor } from "./BaseExtractor";
import type { Conversation } from "../types/Conversation";

export class WhatsAppExtractor extends BaseExtractor {
  canHandle(url: string): boolean {
    return url.includes("web.whatsapp.com");
  }

  async extractConversation(): Promise<Conversation> {
    const messageElements = Array.from(
      document.querySelectorAll(".copyable-text")
    );

    const messages = messageElements
      .map((element, index) => {
        const meta =
          element.getAttribute("data-pre-plain-text") ?? "";

        let author = "Unknown";
        let timestamp = "";

        const match = meta.match(
          /^\[(.*?)\]\s*(.*?):\s*$/
        );

        if (match) {
          timestamp = match[1];
          author = match[2];
        }

        const content =
          this.text(
            element.querySelector(
              '[data-testid="selectable-text"]'
            )
          );

        return this.createMessage(
          {
            id: `whatsapp_${index}`,
            author,
            content,
            timestamp,
            direction: "incoming",
          },
          "WhatsApp",
          index
        );
      })
      .filter(
        (message) =>
          message.content.length > 0
      );

    return {
      platform: "WhatsApp",
      messages: this.finalizeMessages(messages),
    };
  }
}