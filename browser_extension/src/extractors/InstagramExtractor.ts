import { BaseExtractor } from "./BaseExtractor";
import type { Conversation } from "../types/Conversation";

export class InstagramExtractor
  extends BaseExtractor {

  canHandle(url: string): boolean {
    return url.includes(
      "instagram.com",
    );
  }

  async extractConversation(): Promise<Conversation> {
    const messageElements =
      Array.from(
        document.querySelectorAll(
          '[role="row"]',
        ),
      );

    console.log(
      `[InstagramExtractor] Found ${messageElements.length} message elements`,
    );

    const messages =
      messageElements
        .map(
          (element, index) => {
            /*
             * Instagram may contain multiple
             * spans inside a row.
             *
             * We use the row text as the fallback
             * because the exact DOM structure can
             * change between Instagram versions.
             */
            const content =
              this.clean(
                element.textContent ??
                  "",
              );

            if (!content) {
              return null;
            }

            /*
             * Try to obtain a real DOM ID first.
             */
            const domId =
              element.getAttribute(
                "data-message-id",
              ) ||
              element.getAttribute(
                "data-id",
              ) ||
              element.getAttribute(
                "id",
              ) ||
              "";

            /*
             * Try common author selectors.
             */
            const authorElement =
              this.findFirst(
                element,
                [
                  '[data-author]',
                  '[class*="username" i]',
                  '[class*="sender" i]',
                  '[aria-label*="author" i]',
                ],
              );

            const author =
              this.clean(
                authorElement
                  ?.getAttribute(
                    "data-author",
                  ) ||
                  authorElement
                    ?.getAttribute(
                      "aria-label",
                    ) ||
                  authorElement
                    ?.textContent ||
                  "Unknown",
              );

            /*
             * Try to obtain a timestamp.
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
             * If Instagram provides an ID,
             * use it.
             *
             * Otherwise createMessage() creates
             * a deterministic fallback ID.
             */
            const id =
              domId ||
              undefined;

            const message =
              this.createMessage(
                {
                  id,
                  author,
                  content,
                  timestamp,
                  direction:
                    this.detectDirection(
                      element,
                    ),
                },
                "Instagram",
                index,
              );

            console.log(
              "[InstagramExtractor] Parsed message:",
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
      `[InstagramExtractor] Extracted ${finalMessages.length} messages`,
    );

    return {
      platform: "Instagram",
      messages: finalMessages,
    };
  }
}