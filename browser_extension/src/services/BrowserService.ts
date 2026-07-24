import type { Conversation } from "../types/Conversation";

export class BrowserService {
  /**
   * Gets the currently active browser tab.
   */
  private static async getActiveTab(): Promise<chrome.tabs.Tab> {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tabs.length || !tabs[0].id) {
      throw new Error("No active tab found.");
    }

    return tabs[0];
  }

  /**
   * Requests the content script to extract the current conversation.
   */
  static async getConversation(): Promise<Conversation> {
    const tab = await this.getActiveTab();

    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tab.id!,
        {
          type: "GET_CONVERSATION",
        },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(
              new Error(chrome.runtime.lastError.message),
            );
            return;
          }

          if (!response?.success) {
            reject(
              new Error(
                response?.error ??
                  "Conversation extraction failed.",
              ),
            );
            return;
          }

          resolve(response.conversation);
        },
      );
    });
  }
}