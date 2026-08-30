import { BaseExtractor } from "./BaseExtractor";

import type { Conversation } from "../types/Conversation";

export class WhatsAppExtractor extends BaseExtractor {
  canHandle(url: string): boolean {
    return url.includes("web.whatsapp.com");
  }

  async extractConversation(): Promise<Conversation> {
    // -----------------------------------------
    // Find WhatsApp message elements
    // -----------------------------------------

    const messageElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-testid="msg-container"] .copyable-text'
      )
    );

    console.log(
      `[WhatsAppExtractor] Found ${messageElements.length} message elements`
    );

    const messages = messageElements
      .map((element, index) => {
        try {
          // -----------------------------------------
          // Get actual message text
          // -----------------------------------------

          const selectableText =
            element.querySelector<HTMLElement>(
              '[data-testid="selectable-text"]'
            );

          const rawContent =
            selectableText?.textContent ?? "";

          const content = this.clean(rawContent);

          // -----------------------------------------
          // Debug raw extracted content
          // -----------------------------------------

          console.log(
            `[WhatsAppExtractor] Message ${index} raw:`,
            rawContent
          );

          console.log(
            `[WhatsAppExtractor] Message ${index} cleaned:`,
            content
          );

          // Ignore empty messages
          if (!content) {
            console.log(
              `[WhatsAppExtractor] Skipping empty message ${index}`
            );

            return null;
          }

          // -----------------------------------------
          // Reject WhatsApp UI / media messages
          // -----------------------------------------

          const lowerContent = content.toLowerCase();

          const isWhatsAppUiMessage =
            lowerContent.includes(
              "you received a view once message"
            ) ||
            lowerContent.includes(
              "you sent a view once message"
            ) ||
            lowerContent.includes(
              "for added privacy, you can only open it on your phone"
            ) ||
            lowerContent.includes(
              "you sent a view once message from another device"
            ) ||
            lowerContent.includes(
              "learn more"
            );

          if (isWhatsAppUiMessage) {
            console.log(
              "[WhatsAppExtractor] Skipping WhatsApp UI/media message:",
              content
            );

            return null;
          }

          // -----------------------------------------
          // Metadata
          // -----------------------------------------

          const meta =
            element.getAttribute(
              "data-pre-plain-text"
            ) ?? "";

          let timestamp = "";
          let author = "Unknown";

          /*
           * Typical WhatsApp format:
           *
           * [10:23 pm, 29/08/2026] John:
           *
           * Keep the parser tolerant because WhatsApp
           * can change its exact formatting.
           */

          const match = meta.match(
            /^\[(.*?)\]\s*(.*?):\s*$/
          );

          if (match) {
            timestamp =
              match[1]?.trim() ?? "";

            author =
              match[2]?.trim() || "Unknown";
          }

          // -----------------------------------------
          // Direction
          // -----------------------------------------

          const direction =
            element.closest(
              ".message-out, [class*='message-out']"
            )
              ? "outgoing"
              : "incoming";

          // -----------------------------------------
          // Stable message ID
          // -----------------------------------------

          const id =
            element
              .closest("[data-id]")
              ?.getAttribute("data-id") ??
            element.getAttribute("data-id") ??
            `whatsapp_${index}`;

          // -----------------------------------------
          // Debug parsed message
          // -----------------------------------------

          console.log(
            "[WhatsAppExtractor] Parsed message:",
            {
              id,
              author,
              content,
              timestamp,
              direction,
            }
          );

          // -----------------------------------------
          // Create normalized message
          // -----------------------------------------

          return this.createMessage(
            {
              id,
              author,
              content,
              timestamp,
              direction,
            },
            "WhatsApp",
            index
          );
        } catch (error) {
          console.warn(
            "[WhatsAppExtractor] Failed to parse message:",
            error
          );

          return null;
        }
      })
      .filter(
        (
          message
        ): message is NonNullable<typeof message> =>
          message !== null
      );

    // -----------------------------------------
    // Finalize messages
    // -----------------------------------------

    const finalizedMessages =
      this.finalizeMessages(messages);

    // -----------------------------------------
    // Debug final result
    // -----------------------------------------

    console.log(
      `[WhatsAppExtractor] Extracted ${finalizedMessages.length} messages`
    );

    console.log(
      "[WhatsAppExtractor] Final messages:",
      finalizedMessages
    );

    console.log(
      "[WhatsAppExtractor] Final message contents:",
      finalizedMessages.map(
        (message) => message.content
      )
    );

    // -----------------------------------------
    // Return conversation
    // -----------------------------------------

    return {
      platform: "WhatsApp",
      messages: finalizedMessages,
    };
  }
}

export default WhatsAppExtractor;