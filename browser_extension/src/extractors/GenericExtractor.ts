import { BaseExtractor } from "./BaseExtractor";
import type { Conversation } from "../types/Conversation";

export class GenericExtractor extends BaseExtractor {
  canHandle(): boolean {
    return true;
  }

  async extractConversation(): Promise<Conversation> {
    const elements = Array.from(
      document.querySelectorAll("p, span, div")
    );

    const messages = elements
      .map((element, index) =>
        this.createMessage(
          {
            content: element.textContent ?? "",
          },
          "Generic",
          index
        )
      )
      .filter((message) => message.content.length > 0)
      .slice(0, 100);

    console.log("Generic Extractor:", messages);

    return {
      platform: "Generic",
      messages,
    };
  }
}