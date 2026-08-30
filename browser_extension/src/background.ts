// =====================================================
// AI GROOMING DETECTION - BACKGROUND SERVICE WORKER
// =====================================================

console.log("🟢 AI Grooming Detection background service started.");

// =====================================================
// AUTOMATIC ANALYSIS RESULT
// =====================================================

chrome.runtime.onMessage.addListener(
  (message, sender) => {
    if (message.type !== "AUTO_ANALYSIS_RESULT") {
      return;
    }

    console.log(
      "📩 Background received AutoMonitor result:",
      message,
    );

    // Forward the result to any open extension popup.
    chrome.runtime
      .sendMessage({
        type: "AUTO_ANALYSIS_RESULT",
        prediction: message.prediction,
        conversation: message.conversation,
      })
      .catch(() => {
        // Popup is probably closed.
        // The AutoMonitor already saved the result
        // in chrome.storage.local.
      });

    // -------------------------------------------------
    // HIGH-RISK CHECK
    // -------------------------------------------------

    const prediction = message.prediction;

    if (!prediction) {
      return;
    }

    /*
     * Adjust these field names only if your backend
     * PredictionWithExplanation uses different names.
     */

    const riskScore = Number(
      prediction.risk_score ??
        prediction.riskScore ??
        0,
    );

    const predictionLabel =
      prediction.prediction ??
      prediction.label ??
      prediction.result ??
      "High-risk behavior";

    /*
     * Backend risk score is expected to be between
     * 0 and 1.
     */

    if (riskScore >= 0.70) {
      const platform =
        sender.tab?.url
          ? getPlatform(sender.tab.url)
          : "website";

      console.log(
        "🚨 HIGH RISK DETECTED:",
        {
          prediction: predictionLabel,
          riskScore,
          platform,
        },
      );

      chrome.notifications.create(
        {
          type: "basic",
          iconUrl: "favicon.svg",
          title:
            "SafeChat — High Risk Detected",
          message:
            `${predictionLabel} detected on ${platform}. ` +
            `Risk score: ${(riskScore * 100).toFixed(1)}%`,
          priority: 2,
        },
        (notificationId) => {
          if (chrome.runtime.lastError) {
            console.error(
              "❌ Notification error:",
              chrome.runtime.lastError.message,
            );
            return;
          }

          console.log(
            "🔔 High-risk notification created:",
            notificationId,
          );
        },
      );
    }
  },
);


// =====================================================
// PLATFORM DETECTION
// =====================================================

function getPlatform(url: string): string {
  try {
    const hostname =
      new URL(url).hostname.toLowerCase();

    if (
      hostname.includes("whatsapp.com")
    ) {
      return "WhatsApp";
    }

    if (
      hostname.includes("instagram.com")
    ) {
      return "Instagram";
    }

    if (
      hostname.includes("facebook.com")
    ) {
      return "Facebook";
    }

    if (
      hostname.includes("messenger.com")
    ) {
      return "Messenger";
    }

    if (
      hostname.includes("telegram.org")
    ) {
      return "Telegram";
    }

    if (
      hostname.includes("discord.com") ||
      hostname.includes("discordapp.com")
    ) {
      return "Discord";
    }

    return hostname;
  } catch {
    return "website";
  }
}


// =====================================================
// EXTENSION INSTALL / UPDATE
// =====================================================

chrome.runtime.onInstalled.addListener(
  (details) => {
    if (details.reason === "install") {
      console.log(
        "🎉 AI Grooming Detection installed.",
      );
    }

    if (details.reason === "update") {
      console.log(
        "🔄 AI Grooming Detection updated.",
      );
    }
  },
);