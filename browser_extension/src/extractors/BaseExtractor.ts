import type {
  ChatMessage,
  Conversation,
  MessageDirection,
} from "../types/Conversation";

export abstract class BaseExtractor {
  /**
   * Returns true if this extractor supports the given URL.
   */
  abstract canHandle(url: string): boolean;

  /**
   * Extracts a conversation from the current page.
   */
  abstract extractConversation(): Promise<Conversation>;

  /**
   * Safely returns trimmed text from an element.
   */
  protected text(element: Element | null): string {
    return element?.textContent?.trim() ?? "";
  }

  /**
   * Safely returns an attribute value.
   */
  protected attr(
    element: Element | null,
    attribute: string,
  ): string {
    return element?.getAttribute(attribute) ?? "";
  }

  /**
   * Normalizes whitespace.
   */
  protected clean(text: string): string {
    return text
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Finds the first element matching any selector.
   */
  protected findFirst(
    parent: ParentNode,
    selectors: string[],
  ): Element | null {
    for (const selector of selectors) {
      const element =
        parent.querySelector(selector);

      if (element) {
        return element;
      }
    }

    return null;
  }

  /**
   * Reads text using multiple fallback selectors.
   */
  protected textFromSelectors(
    parent: ParentNode,
    selectors: string[],
  ): string {
    return this.text(
      this.findFirst(parent, selectors),
    );
  }

  /**
   * Reads an attribute using multiple fallback selectors.
   */
  protected attrFromSelectors(
    parent: ParentNode,
    selectors: string[],
    attribute: string,
  ): string {
    const element =
      this.findFirst(parent, selectors);

    return this.attr(element, attribute);
  }

  /**
   * Attempts to determine whether the message
   * is outgoing or incoming.
   */
  protected detectDirection(
    element: Element,
  ): MessageDirection {
    const className =
      element.className
        .toString()
        .toLowerCase();

    if (
      className.includes("outgoing") ||
      className.includes("message-out") ||
      className.includes("sent") ||
      className.includes("self")
    ) {
      return "outgoing";
    }

    return "incoming";
  }

  /**
   * Creates a deterministic hash.
   *
   * This is intentionally synchronous and does not
   * use Date.now(), random values, or array indexes.
   *
   * Therefore the same message produces the same
   * fallback ID every time it is extracted.
   */
  protected stableHash(value: string): string {
    let hash = 0;

    for (let i = 0; i < value.length; i++) {
      hash =
        (hash << 5) -
        hash +
        value.charCodeAt(i);

      hash |= 0;
    }

    return Math.abs(hash)
      .toString(36);
  }

  /**
   * Generates a stable fallback message ID.
   *
   * IMPORTANT:
   * Do NOT use Date.now() here.
   *
   * AutoMonitor extracts the conversation repeatedly.
   * If the fallback ID changed every time, AutoMonitor
   * would think every old message is a new message.
   */
  protected generateId(
    platform: string,
    index: number,
    author = "",
    content = "",
    timestamp = "",
  ): string {
    const normalizedAuthor =
      this.clean(author);

    const normalizedContent =
      this.clean(content);

    const normalizedTimestamp =
      this.clean(timestamp);

    const fingerprint =
      [
        platform.toLowerCase(),
        normalizedAuthor,
        normalizedContent,
        normalizedTimestamp,
      ].join("|");

    /*
     * Index is only used as a final fallback when
     * absolutely no message information exists.
     *
     * Normal messages should always have content.
     */
    if (
      !normalizedAuthor &&
      !normalizedContent &&
      !normalizedTimestamp
    ) {
      return `${platform.toLowerCase()}_${index}`;
    }

    return `${platform.toLowerCase()}_${this.stableHash(
      fingerprint,
    )}`;
  }

  /**
   * Creates a normalized ChatMessage.
   */
  protected createMessage(
    data: Partial<ChatMessage>,
    platform: string,
    index: number,
  ): ChatMessage {
    const author =
      data.author?.trim() ||
      "Unknown";

    const content =
      this.clean(
        data.content ?? "",
      );

    const timestamp =
      data.timestamp ?? "";

    return {
      id:
        data.id ??
        this.generateId(
          platform,
          index,
          author,
          content,
          timestamp,
        ),

      author,

      content,

      timestamp,

      direction:
        data.direction ??
        "incoming",

      platform,
    };
  }

  /**
   * Removes empty messages.
   */
  protected removeEmptyMessages(
    messages: ChatMessage[],
  ): ChatMessage[] {
    return messages.filter(
      (message) =>
        message.content.length > 0,
    );
  }

  /**
   * Removes duplicate messages.
   *
   * Prefer the message ID when it is available.
   *
   * Content is also used as a fallback because some
   * platforms may expose the same DOM message more
   * than once with slightly different metadata.
   */
  protected removeDuplicateMessages(
    messages: ChatMessage[],
  ): ChatMessage[] {
    const seenIds = new Set<string>();
    const seenFallbackKeys =
      new Set<string>();

    return messages.filter(
      (message) => {
        if (message.id) {
          if (seenIds.has(message.id)) {
            return false;
          }

          seenIds.add(message.id);
          return true;
        }

        const key =
          [
            message.author,
            message.content,
            message.timestamp,
          ].join("|");

        if (seenFallbackKeys.has(key)) {
          return false;
        }

        seenFallbackKeys.add(key);

        return true;
      },
    );
  }

  /**
   * Finalizes extracted messages.
   */
  protected finalizeMessages(
    messages: ChatMessage[],
  ): ChatMessage[] {
    const nonEmpty =
      this.removeEmptyMessages(
        messages,
      );

    return this.removeDuplicateMessages(
      nonEmpty,
    );
  }
}