import {
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";

import type { PredictionWithExplanationResponse } from "@/types/ai";

interface DecisionPanelProps {
  result: PredictionWithExplanationResponse;
}

export default function DecisionPanel({
  result,
}: DecisionPanelProps) {
  const prediction = result.prediction;
  const explanation = result.explanation;

  const topKeywords = explanation.words
    .slice(0, 5)
    .map((word) => word.token);

  const riskScore = prediction.risk_score;

  const recommendation =
    riskScore >= 80
      ? {
          title: "Immediate Moderator Review",
          message:
            "This conversation has been classified as high risk. Immediate human review is recommended.",
          color: "bg-red-50 border-red-200",
          icon: (
            <ShieldAlert className="h-6 w-6 text-red-600" />
          ),
        }
      : riskScore >= 60
      ? {
          title: "Monitor Conversation",
          message:
            "Potential grooming indicators were detected. Continued monitoring is recommended.",
          color: "bg-orange-50 border-orange-200",
          icon: (
            <AlertTriangle className="h-6 w-6 text-orange-500" />
          ),
        }
      : {
          title: "Low Risk",
          message:
            "No strong grooming indicators were detected. Continue normal monitoring.",
          color: "bg-green-50 border-green-200",
          icon: (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ),
        };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">
        AI Decision Summary
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard
          title="Prediction"
          value={prediction.label}
        />

        <InfoCard
          title="Risk Score"
          value={`${prediction.risk_score.toFixed(1)}%`}
        />

        <InfoCard
          title="Confidence"
          value={`${prediction.confidence.toFixed(2)}%`}
        />

        <InfoCard
          title="Messages"
          value={prediction.message_count.toString()}
        />
      </div>

      <div className="mt-8">
        <h3 className="mb-3 text-lg font-semibold">
          Top Influential Keywords
        </h3>

        <div className="flex flex-wrap gap-3">
          {topKeywords.length > 0 ? (
            topKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
              >
                {keyword}
              </span>
            ))
          ) : (
            <p className="text-gray-500">
              No significant keywords available.
            </p>
          )}
        </div>
      </div>

      <div
        className={`mt-8 rounded-xl border p-5 ${recommendation.color}`}
      >
        <div className="flex items-start gap-4">
          {recommendation.icon}

          <div>
            <h3 className="text-lg font-bold">
              {recommendation.title}
            </h3>

            <p className="mt-2 text-gray-700">
              {recommendation.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  value: string;
}

function InfoCard({
  title,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border bg-gray-50 p-4">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-xl font-bold">
        {value}
      </p>
    </div>
  );
}