import type { ExplanationResponse } from "../../types/ai";

interface Props {
  explanation: ExplanationResponse;
}

export default function ExplanationViewer({
  explanation,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Explainable AI Analysis
        </h2>

        <p className="mt-2 text-gray-600">
          The highlighted words below contributed to the AI model's prediction.
          Darker colors indicate greater influence on the final decision.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-8 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold text-blue-700">
          AI Summary
        </h3>

        <p className="text-gray-700">
          {explanation.summary}
        </p>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Legend color="#22C55E" label="Low" />
        <Legend color="#EAB308" label="Medium" />
        <Legend color="#F97316" label="High" />
        <Legend color="#DC2626" label="Critical" />
      </div>

      {/* Tokens */}
      <div className="flex flex-wrap gap-3">
        {explanation.words.map((word, index) => (
          <span
            key={`${word.token}-${index}`}
            className="cursor-default rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition-transform duration-200 hover:scale-105"
            style={{
              backgroundColor: word.color,
            }}
            title={`${word.importance} (${word.score.toFixed(4)})`}
          >
            {word.token}
          </span>
        ))}
      </div>
    </div>
  );
}

interface LegendProps {
  color: string;
  label: string;
}

function Legend({
  color,
  label,
}: LegendProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-4 w-4 rounded-full"
        style={{ backgroundColor: color }}
      />

      <span className="text-sm text-gray-600">
        {label}
      </span>
    </div>
  );
}