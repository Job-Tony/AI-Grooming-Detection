import { ExtractorFactory } from "../extractors/ExtractorFactory";

console.log("✅ AI Grooming Detection content script loaded.");

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message.type !== "GET_CONVERSATION") {
      return false;
    }

    (async () => {
      try {
        const extractor = ExtractorFactory.getExtractor(
          window.location.href,
        );

        console.log(
          "Using extractor:",
          extractor.constructor.name,
        );

        const conversation =
          await extractor.extractConversation();

        console.log(
          "Conversation extracted:",
          conversation,
        );

        sendResponse({
          success: true,
          conversation,
        });
      } catch (error) {
        console.error(
          "Conversation extraction failed:",
          error,
        );

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
  },
);