import { ExtractorFactory } from "../extractors/ExtractorFactory";
import { AutoMonitor } from "./AutoMonitor";

console.log(
  "✅ AI Grooming Detection content script loaded.",
);

console.log(
  "🌐 Current page:",
  window.location.href,
);


/* =====================================================
   MANUAL CONVERSATION EXTRACTION
   ===================================================== */

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message.type !== "GET_CONVERSATION") {
      return false;
    }

    (async () => {
      try {
        const extractor =
          ExtractorFactory.getExtractor(
            window.location.href,
          );

        console.log(
          "🔎 Using extractor:",
          extractor.constructor.name,
        );

        const conversation =
          await extractor.extractConversation();

        console.log(
          "💬 Conversation extracted:",
          conversation,
        );

        sendResponse({
          success: true,
          conversation,
        });
      } catch (error) {
        console.error(
          "❌ Conversation extraction failed:",
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


/* =====================================================
   AUTOMATIC MONITORING
   ===================================================== */

const autoMonitor =
  new AutoMonitor();

autoMonitor.start();

console.log(
  "🤖 AI Grooming Detection AutoMonitor is active.",
);