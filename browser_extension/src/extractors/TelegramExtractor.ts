import { BaseExtractor } from "./BaseExtractor";
import type { Conversation } from "../types/Conversation";

export class TelegramExtractor
  extends BaseExtractor {

  canHandle(url: string): boolean {
    return url.includes(
      "web.telegram.org",
    );
  }

  async extractConversation(): Promise<Conversation> {
    const messageElements =
      Array.from(
        document.querySelectorAll(
          ".message",
        ),
      );

    console.log(
      `[TelegramExtractor] Found ${messageElements.length} message elements`,
    );

    const messages =
      messageElements
        .map(
          (element, index) => {
            /*
             * Telegram normally places message text
             * inside .text-content.
             */
            const contentElement =
              this.findFirst(
                element,
                [
                  ".text-content",
                  ".message-text",
                  ".text",
                ],
              );

            const content =
              this.clean(
                contentElement
                  ?.textContent ??
                  element.textContent ??
                  "",
              );

            if (!content) {
              return null;
            }

            /*
             * Author.
             */
            const authorElement =
              this.findFirst(
                element,
                [
                  ".sender-title",
                  ".peer-title",
                  '[class*="sender" i]',
                  '[class*="author" i]',
                ],
              );

            const author =
              this.clean(
                authorElement
                  ?.textContent ||
                  "Unknown",
              );

            /*
             * Timestamp.
             */
            const timeElement =
              this.findFirst(
                element,
                [
                  "time",
                  "[datetime]",
                ],
              );

            const timestamp =
              timeElement
                ?.getAttribute(
                  "datetime",
                ) ||
              this.clean(
                timeElement
                  ?.textContent ||
                  "",
              );

            /*
             * Try Telegram's own message IDs.
             */
            const id =
              element.getAttribute(
                "data-message-id",
              ) ||
              element.getAttribute(
                "data-id",
              ) ||
              "";

            const message =
              this.createMessage(
                {
                  id:
                    id || undefined,

                  author,

                  content,

                  timestamp,

                  direction:
                    this.detectDirection(
                      element,
                    ),
                },
                "Telegram",
                index,
              );

            console.log(
              "[TelegramExtractor] Parsed message:",
              message,
            );

            return message;
          },
        )
        .filter(
          (
            message,
          ): message is NonNullable<
            typeof message
          > =>
            message !== null,
        );

    const finalMessages =
      this.finalizeMessages(
        messages,
      );

    console.log(
      `[TelegramExtractor] Extracted ${finalMessages.length} messages`,
    );

    return {
      platform: "Telegram",
      messages: finalMessages,
    };
  }
}