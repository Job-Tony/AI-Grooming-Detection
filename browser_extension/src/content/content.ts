import { DiscordExtractor } from "../extractors/DiscordExtractor";

console.log("✅ AI Grooming Detection content script loaded.");

const extractor = new DiscordExtractor();

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "GET_CONVERSATION") {
    return false;
  }

  (async () => {
    try {
      const conversation = await extractor.extractConversation();

      console.log("Conversation extracted:", conversation);

      sendResponse({
        success: true,
        conversation,
      });
    } catch (error) {
      console.error("Conversation extraction failed:", error);

      sendResponse({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown extraction error",
      });
    }
  })();

  return true;
});