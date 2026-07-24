import { Trash2, Eye } from "lucide-react";

import type { Analysis } from "@/types/analysis";

interface HistoryCardProps {
  analysis: Analysis;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HistoryCard({
  analysis,
  onView,
  onDelete,
}: HistoryCardProps) {
  const riskColor =
    analysis.risk_score >= 80
      ? "bg-red-500"
      : analysis.risk_score >= 50
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {analysis.prediction}
          </h2>

          <p className="mt-1 text-gray-500">
            {new Date(
              analysis.created_at,
            ).toLocaleString()}
          </p>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${riskColor}`}
        >
          {analysis.risk_score.toFixed(1)}%
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">
            Confidence
          </p>

          <p className="font-semibold">
            {analysis.confidence.toFixed(1)}%
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Probability
          </p>

          <p className="font-semibold">
            {(analysis.probability * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <p className="line-clamp-3 text-sm text-gray-700">
          {analysis.summary}
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onView(analysis.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Eye size={18} />
          View
        </button>

        <button
          onClick={() => onDelete(analysis.id)}
          className="flex items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-white transition hover:bg-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}