import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import ConversationViewer from "@/components/analytics/ConversationViewer";

import { useAnalysis } from "@/hooks/useAnalysis";
import { useUploadedConversation } from "@/hooks/useUploadedConversation";

export default function AnalysisDetailsPage() {
  const navigate = useNavigate();

  const { analysisId } = useParams();

  const {
    data: analysis,
    isLoading,
    isError,
  } = useAnalysis(analysisId ?? "");

  const {
    data: uploadedConversation,
    isLoading: conversationLoading,
  } = useUploadedConversation(
    analysis?.upload_id,
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-lg font-semibold">
          Loading analysis...
        </p>
      </div>
    );
  }

  if (isError || !analysis) {
    return (
      <div className="rounded-xl bg-red-50 p-8">
        <h2 className="text-xl font-bold text-red-700">
          Analysis not found
        </h2>

        <button
          onClick={() => navigate("/history")}
          className="mt-6 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}

      <button
        onClick={() => navigate("/history")}
        className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
      >
        <ArrowLeft size={18} />
        Back to History
      </button>

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Analysis Report
        </h1>

        <p className="mt-2 text-slate-500">
          Detailed AI prediction results.
        </p>
      </div>

      {/* Prediction Summary */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Prediction
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            {analysis.prediction}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Risk Score
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            {analysis.risk_score.toFixed(2)}%
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Confidence
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            {analysis.confidence.toFixed(2)}%
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Probability
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            {(analysis.probability * 100).toFixed(2)}%
          </h2>
        </div>
      </div>

      {/* AI Summary */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          AI Explanation Summary
        </h2>

        <p className="leading-7 text-slate-700">
          {analysis.summary}
        </p>
      </div>

      {/* Uploaded Conversation */}

      {conversationLoading ? (
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            Loading uploaded conversation...
          </p>
        </div>
      ) : uploadedConversation ? (
        <ConversationViewer
          conversation={uploadedConversation}
        />
      ) : (
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            No uploaded conversation available.
          </p>
        </div>
      )}

      {/* Model Information */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          Analysis Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">
              Model Version
            </p>

            <p className="font-semibold">
              {analysis.model_version}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Processing Time
            </p>

            <p className="font-semibold">
              {analysis.processing_time_ms} ms
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Created At
            </p>

            <p className="font-semibold">
              {new Date(
                analysis.created_at,
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Upload ID
            </p>

            <p className="break-all font-mono text-sm">
              {analysis.upload_id ?? "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}