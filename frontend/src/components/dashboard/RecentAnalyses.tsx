import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";

export default function RecentAnalyses() {
  const navigate = useNavigate();

  const {
    data: analyses = [],
    isLoading,
    isError,
  } = useAnalysisHistory();

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          Recent Analyses
        </h2>

        <p className="text-slate-500">
          Loading recent analyses...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          Recent Analyses
        </h2>

        <p className="text-red-600">
          Failed to load analyses.
        </p>
      </div>
    );
  }

  const recent = analyses.slice(0, 5);

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent Analyses
        </h2>
      </div>

      {recent.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500">
          No analyses available.
        </div>
      ) : (
        <div className="space-y-4">
          {recent.map((analysis) => (
            <div
              key={analysis.id}
              className="flex items-center justify-between rounded-lg border p-4 transition hover:shadow-md"
            >
              <div>
                <h3 className="font-semibold text-slate-800">
                  {analysis.prediction}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Risk Score:{" "}
                  <span className="font-medium">
                    {analysis.risk_score.toFixed(1)}%
                  </span>
                </p>

                <p className="text-sm text-slate-500">
                  Confidence:{" "}
                  <span className="font-medium">
                    {analysis.confidence.toFixed(1)}%
                  </span>
                </p>

                <p className="text-sm text-slate-500">
                  Probability:{" "}
                  <span className="font-medium">
                    {(analysis.probability * 100).toFixed(1)}%
                  </span>
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {new Date(
                    analysis.created_at,
                  ).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(`/analysis/${analysis.id}`)
                }
                className="rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700"
                title="View Analysis"
              >
                <Eye size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}