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
      const element = parent.querySelector(selector);

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
    const element = this.findFirst(parent, selectors);

    return this.attr(element, attribute);
  }

  /**
   * Attempts to determine whether the message
   * is outgoing or incoming.
   */
  protected detectDirection(
    element: Element,
  ): MessageDirection {
    const className = element.className.toString().toLowerCase();

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
   * Generates a stable message ID if the platform
   * does not provide one.
   */
  protected generateId(
    platform: string,
    index: number,
  ): string {
    return `${platform.toLowerCase()}_${Date.now()}_${index}`;
  }

  /**
   * Creates a normalized ChatMessage.
   */
  protected createMessage(
    data: Partial<ChatMessage>,
    platform: string,
    index: number,
  ): ChatMessage {
    return {
      id:
        data.id ??
        this.generateId(platform, index),

      author:
        data.author?.trim() ||
        "Unknown",

      content:
        this.clean(
          data.content ?? "",
        ),

      timestamp:
        data.timestamp ?? "",

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
   */
  protected removeDuplicateMessages(
    messages: ChatMessage[],
  ): ChatMessage[] {
    const seen = new Set<string>();

    return messages.filter((message) => {
      const key =
        message.author +
        "|" +
        message.content +
        "|" +
        message.timestamp;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  /**
   * Finalizes extracted messages.
   */
  protected finalizeMessages(
    messages: ChatMessage[],
  ): ChatMessage[] {
    return this.removeDuplicateMessages(
      this.removeEmptyMessages(messages),
    );
  }
}