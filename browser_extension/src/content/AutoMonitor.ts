import { ExtractorFactory } from "../extractors/ExtractorFactory";
import api from "../api/api";

import type { PredictionWithExplanation } from "../types/prediction";
import type { Conversation } from "../types/Conversation";

export class AutoMonitor {
  private extractor:
    | ReturnType<typeof ExtractorFactory.getExtractor>
    | null = null;

  private observer: MutationObserver | null = null;

  private debounceTimer:
    | ReturnType<typeof setTimeout>
    | null = null;

  private lastMessageIds = new Set<string>();

  private lastAnalyzedSignature = "";

  private isAnalyzing = false;

  private started = false;

  start() {
    if (this.started) {
      console.log("⚠️ AutoMonitor already running.");
      return;
    }

    this.started = true;

    console.log("🤖 AutoMonitor started.");

    this.setupExtractor();
    this.startObserver();

    // Analyze the currently opened conversation once.
    this.scheduleCheck();
  }

  stop() {
    console.log("🛑 AutoMonitor stopped.");

    this.observer?.disconnect();
    this.observer = null;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    this.started = false;
  }

  private setupExtractor() {
    try {
      this.extractor =
        ExtractorFactory.getExtractor(
          window.location.href,
        );

      console.log(
        "🤖 AutoMonitor extractor:",
        this.extractor.constructor.name,
      );
    } catch (error) {
      console.error(
        "❌ AutoMonitor could not create extractor:",
        error,
      );

      this.extractor = null;
    }
  }

  private startObserver() {
    if (!document.body) {
      console.warn(
        "⚠️ document.body not available yet.",
      );
      return;
    }

    this.observer = new MutationObserver(() => {
      this.scheduleCheck();
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log(
      "👀 AutoMonitor MutationObserver started.",
    );
  }

  private scheduleCheck() {
    if (!this.started) {
      return;
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null;
      void this.checkConversation();
    }, 1500);
  }

  private async checkConversation() {
    if (!this.started) {
      return;
    }

    if (this.isAnalyzing) {
      console.log(
        "⏳ AutoMonitor analysis already running.",
      );
      return;
    }

    if (!this.extractor) {
      this.setupExtractor();
    }

    if (!this.extractor) {
      return;
    }

    try {
      const conversation =
        await this.extractor.extractConversation();

      if (!conversation.messages.length) {
        console.log(
          "🤖 AutoMonitor: no messages found.",
        );
        return;
      }

      /*
       * IMPORTANT:
       *
       * Only real WhatsApp message IDs are used.
       *
       * Empty/invalid IDs are ignored.
       */
      const currentIds =
        conversation.messages
          .map((message) => message.id)
          .filter(
            (id): id is string =>
              typeof id === "string" &&
              id.trim().length > 0,
          );

      if (!currentIds.length) {
        console.log(
          "🤖 AutoMonitor: no valid message IDs.",
        );
        return;
      }

      const signature =
        currentIds.join("|");

      console.log(
        "🤖 AutoMonitor message count:",
        currentIds.length,
      );

      /*
       * EXACT SAME MESSAGE LIST
       *
       * Nothing changed.
       */
      if (
        signature ===
        this.lastAnalyzedSignature
      ) {
        return;
      }

      /*
       * Determine whether at least one new
       * WhatsApp message appeared.
       */
      const hasNewMessages =
        currentIds.some(
          (id) =>
            !this.lastMessageIds.has(id),
        );

      /*
       * If we already analyzed something and
       * there are no new message IDs, don't
       * analyze again.
       */
      if (
        this.lastAnalyzedSignature &&
        !hasNewMessages
      ) {
        return;
      }

      /*
       * Update state BEFORE calling backend.
       *
       * This is important because MutationObserver
       * can fire many times while WhatsApp updates
       * the DOM.
       */
      this.lastMessageIds =
        new Set(currentIds);

      this.lastAnalyzedSignature =
        signature;

      const messages =
        conversation.messages
          .map(
            (message) =>
              message.content.trim(),
          )
          .filter(Boolean);

      if (!messages.length) {
        return;
      }

      console.log(
        "🚨 AutoMonitor detected a new conversation state.",
      );

      await this.analyze(
        messages,
        conversation,
      );
    } catch (error) {
      console.error(
        "❌ AutoMonitor failed:",
        error,
      );
    }
  }

  private async analyze(
    messages: string[],
    conversation: Conversation,
  ) {
    if (this.isAnalyzing) {
      return;
    }

    this.isAnalyzing = true;

    try {
      console.log(
        "🧠 AutoMonitor sending conversation to backend...",
      );

      const response =
        await api.post<PredictionWithExplanation>(
          "/ai/predict/explain/public",
          {
            conversation: messages,
          },
        );

      const prediction =
        response.data;

      console.log(
        "✅ AutoMonitor prediction:",
        prediction,
      );

      /*
       * Save result permanently.
       *
       * The popup can be closed and reopened and
       * this result will still be available.
       */
      await chrome.storage.local.set({
        autoMonitorResult: {
          prediction,
          conversation,
          timestamp: Date.now(),
          url: window.location.href,
        },
      });

      console.log(
        "💾 AutoMonitor result saved to storage.",
      );

      /*
       * Tell the background service worker.
       *
       * Background then forwards the result to
       * the popup if it is open.
       */
      chrome.runtime.sendMessage({
        type: "AUTO_ANALYSIS_RESULT",
        prediction,
        conversation,
      }).catch(() => {
        /*
         * This is expected if the popup is closed.
         *
         * The result is already safely stored.
         */
      });

      /*
       * High-risk notification.
       */
      const riskScore =
        Number(
          (prediction as any).risk_score ??
          (prediction as any).riskScore ??
          0,
        );

      const predictionLabel =
        String(
          (prediction as any).prediction ??
          (prediction as any).label ??
          "Potential risk",
        );

      if (riskScore >= 0.7) {
        chrome.runtime.sendMessage({
          type: "HIGH_RISK_DETECTED",
          riskScore,
          prediction: predictionLabel,
          platform: "WhatsApp",
        }).catch(() => {
          // Background may be unavailable during extension reload.
        });
      }
    } catch (error) {
      console.error(
        "❌ AutoMonitor backend error:",
        error,
      );
    } finally {
      this.isAnalyzing = false;
    }
  }
}