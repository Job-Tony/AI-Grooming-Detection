import { BaseExtractor } from "./BaseExtractor";
import type { Conversation } from "../types/Conversation";
import type { ChatMessage } from "../types/Conversation";

export class GenericExtractor
  extends BaseExtractor {

  canHandle(): boolean {
    return true;
  }

  async extractConversation(): Promise<Conversation> {
    const selectors = [
      '[data-message-id]',
      '[data-testid*="message" i]',
      '[data-testid*="chat-message" i]',
      '[class*="message" i]',
      '[class*="chat-bubble" i]',
      '[class*="bubble" i]',
      '[role="article"]',
      '[role="log"] > *',
    ];

    let candidates: Element[] = [];

    /*
     * Find the first selector that gives us
     * a reasonable number of candidates.
     */
    for (const selector of selectors) {
      const found =
        Array.from(
          document.querySelectorAll(
            selector,
          ),
        );

      if (found.length >= 2) {
        candidates = found;
        break;
      }
    }

    /*
     * Fallback to common chat containers.
     */
    if (candidates.length < 2) {
      const containers =
        Array.from(
          document.querySelectorAll(
            `
            [role="main"],
            [role="log"],
            main,
            [class*="chat" i],
            [class*="conversation" i]
            `,
          ),
        );

      for (const container of containers) {
        const children =
          Array.from(
            container.children,
          ).filter(
            (child) => {
              const text =
                this.clean(
                  child.textContent ??
                    "",
                );

              return (
                text.length >= 1 &&
                text.length <= 2000
              );
            },
          );

        if (children.length >= 2) {
          candidates =
            children;
          break;
        }
      }
    }

    const messages =
      this.normalizeCandidates(
        candidates,
      );

    console.log(
      `[GenericExtractor] Found ${messages.length} probable messages`,
    );

    return {
      platform: "Generic",
      messages,
    };
  }

  private normalizeCandidates(
    elements: Element[],
  ): ChatMessage[] {
    const messages: ChatMessage[] =
      [];

    for (
      const [index, element] of
        elements.entries()
    ) {
      /*
       * Ignore nested candidates when their
       * parent is already a message candidate.
       */
      if (
        element.parentElement?.closest(
          `
          [data-message-id],
          [data-testid*="message" i],
          [data-testid*="chat-message" i],
          [class*="message" i],
          [class*="chat-bubble" i],
          [class*="bubble" i],
          [role="article"]
          `,
        )
      ) {
        continue;
      }

      const content =
        this.clean(
          element.textContent ??
            "",
        );

      /*
       * Ignore empty or extremely large
       * elements.
       */
      if (
        !content ||
        content.length > 2000
      ) {
        continue;
      }

      /*
       * Ignore obvious UI text.
       */
      if (
        this.looksLikeUiText(
          content,
        )
      ) {
        continue;
      }

      /*
       * Prefer a real DOM ID.
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

      const author =
        this.findAuthor(
          element,
        );

      const timestamp =
        this.findTimestamp(
          element,
        );

      /*
       * If there is no real DOM ID,
       * createMessage() generates a stable
       * deterministic ID from the message data.
       */
      const message =
        this.createMessage(
          {
            id:
              domId || undefined,

            author,

            content,

            timestamp,

            direction:
              this.detectDirection(
                element,
              ),
          },
          "Generic",
          index,
        );

      messages.push(message);
    }

    return this
      .finalizeMessages(
        messages,
      )
      .slice(-100);
  }

  private findAuthor(
    element: Element,
  ): string {
    const author =
      this.findFirst(
        element,
        [
          "[data-author]",
          '[class*="author" i]',
          '[class*="username" i]',
          '[class*="sender" i]',
          '[aria-label*="author" i]',
        ],
      );

    return this.clean(
      author?.getAttribute(
        "data-author",
      ) ||
        author?.getAttribute(
          "aria-label",
        ) ||
        author?.textContent ||
        "Unknown",
    );
  }

  private findTimestamp(
    element: Element,
  ): string {
    const time =
      this.findFirst(
        element,
        [
          "time",
          "[datetime]",
        ],
      );

    return (
      time?.getAttribute(
        "datetime",
      ) ||
      this.clean(
        time?.textContent ||
          "",
      )
    );
  }

  private looksLikeUiText(
    text: string,
  ): boolean {
    const lower =
      text.toLowerCase();

    const uiOnly = [
      "settings",
      "notifications",
      "search",
      "home",
      "login",
      "sign in",
      "sign up",
      "download",
      "share",
      "copy",
      "delete",
    ];

    return (
      text.length < 2 ||
      uiOnly.includes(lower)
    );
  }
}