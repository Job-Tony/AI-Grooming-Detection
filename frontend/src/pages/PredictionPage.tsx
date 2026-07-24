import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

import PredictionHeader from "../components/prediction/PredictionHeader";
import PredictionCard from "../components/prediction/PredictionCard";
import ConfidenceBar from "../components/prediction/ConfidenceBar";
import ExplanationViewer from "../components/prediction/ExplanationViewer";
import ModelInfoCard from "../components/prediction/ModelInfoCard";

import RiskGauge from "../components/analytics/RiskGauge";
import DecisionPanel from "../components/analytics/DecisionPanel";
import StatisticsCard from "../components/analytics/StatisticsCard";
import KeywordCloud from "../components/analytics/KeywordCloud";
import ConversationHeatmap from "../components/analytics/ConversationHeatmap";
import RiskTimeline from "../components/analytics/RiskTimeline";

import { usePrediction } from "../hooks/usePrediction";
import { useModelInfo } from "../hooks/useModelInfo";

import { getUploadedConversation } from "@/services/upload.service";

export default function PredictionPage() {
  const location = useLocation();

  const loaded = useRef(false);

  const [conversation, setConversation] = useState("");

  const predictionMutation = usePrediction();
  const { data: modelInfo } = useModelInfo();

  useEffect(() => {
    if (loaded.current) return;

    loaded.current = true;

    async function loadConversation() {
      const uploadId = location.state?.uploadId;

      if (!uploadId) return;

      try {
        const data = await getUploadedConversation(uploadId);

        setConversation(data.conversation.join("\n"));
      } catch (error) {
        console.error(error);
        toast.error("Unable to load uploaded conversation.");
      }
    }

    loadConversation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messages = useMemo(
    () =>
      conversation
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
    [conversation]
  );

  function handlePredict() {
    if (messages.length === 0) {
      toast.error("Enter a conversation first.");
      return;
    }

    const uploadId = location.state?.uploadId ?? null;

    predictionMutation.mutate({
      upload_id: uploadId,
      conversation: messages,
    });
  }

  return (
    <div className="space-y-8">
      {/* ===========================
          INPUT SECTION
      =========================== */}

      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            AI Grooming Detection
          </h1>

          <p className="mt-2 text-gray-500">
            Analyze online conversations using DistilBERT + BiLSTM with
            Explainable AI.
          </p>
        </div>

        <textarea
          rows={10}
          value={conversation}
          onChange={(e) => setConversation(e.target.value)}
          placeholder="Enter one message per line..."
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            p-4
            font-mono
            text-sm
            shadow-sm
            focus:border-blue-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-200
          "
        />

        <button
          onClick={handlePredict}
          disabled={predictionMutation.isPending}
          className="mt-6 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {predictionMutation.isPending
            ? "🧠 Running AI Analysis..."
            : "🔍 Analyze Conversation"}
        </button>

        {predictionMutation.isPending && (
          <div className="mt-6 rounded-xl bg-blue-50 p-4 text-blue-700">
            <p className="font-semibold">
              AI model is analyzing the conversation...
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-200">
              <div className="h-full w-full animate-pulse bg-blue-600" />
            </div>

            <p className="mt-3 text-sm">
              Explainability generation may take several seconds.
            </p>
          </div>
        )}

        {predictionMutation.isError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            Unable to analyze the conversation.
            <br />
            Please verify that the backend server is running.
          </div>
        )}
      </div>

      {/* ===========================
          RESULTS
      =========================== */}

      {predictionMutation.data && (
        <>
          <PredictionHeader
            label={predictionMutation.data.prediction.label}
            riskScore={predictionMutation.data.prediction.risk_score}
            confidence={predictionMutation.data.prediction.confidence}
          />

          <div className="grid gap-6 xl:grid-cols-3">
            <PredictionCard
              prediction={predictionMutation.data.prediction}
            />

            <RiskGauge
              riskScore={predictionMutation.data.prediction.risk_score}
            />

            <ConfidenceBar
              confidence={predictionMutation.data.prediction.confidence}
            />
          </div>

          <ExplanationViewer
            explanation={predictionMutation.data.explanation}
          />

          <DecisionPanel
            result={predictionMutation.data}
          />

          <StatisticsCard
            explanation={predictionMutation.data.explanation}
          />

          <KeywordCloud
            explanation={predictionMutation.data.explanation}
          />

          <ConversationHeatmap
            conversation={messages}
            explanation={predictionMutation.data.explanation}
          />

          <RiskTimeline
            timeline={predictionMutation.data.prediction_timeline}
          />

          {modelInfo && (
            <ModelInfoCard
              info={modelInfo}
            />
          )}
        </>
      )}
    </div>
  );
}