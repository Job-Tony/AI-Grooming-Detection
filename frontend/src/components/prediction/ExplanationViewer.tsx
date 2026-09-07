import type {
  ExplanationResponse,
  BehavioralIndicatorResponse,
} from "../../types/ai";

interface Props {
  explanation: ExplanationResponse;
  behavioralIndicators?: BehavioralIndicatorResponse[];
}

export default function ExplanationViewer({
  explanation,
  behavioralIndicators = [],
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Explainable AI Analysis
        </h2>

        <p className="mt-2 text-gray-600">
          The analysis combines model-level SHAP explanations with
          human-readable behavioral indicators to help moderators understand
          why a conversation may be risky.
        </p>
      </div>

      {/* -------------------------------- */}
      {/* AI Summary                       */}
      {/* -------------------------------- */}

      <div className="mb-8 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold text-blue-700">
          AI Summary
        </h3>

        <p className="text-gray-700">
          {explanation.summary}
        </p>
      </div>

      {/* -------------------------------- */}
      {/* Behavioral Indicators            */}
      {/* -------------------------------- */}

      {behavioralIndicators.length > 0 && (
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Behavioral Indicators
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Detected conversational patterns that may indicate grooming or
              unsafe interaction.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {behavioralIndicators.map((indicator, index) => (
              <BehavioralIndicatorCard
                key={`${indicator.indicator_type}-${index}`}
                indicator={indicator}
              />
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* SHAP Explanation                 */}
      {/* -------------------------------- */}

      <div className="border-t border-gray-200 pt-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            SHAP Model Explanation
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            These highlighted words show which parts of the conversation
            influenced the neural model's prediction.
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
    </div>
  );
}

/* -------------------------------- */
/* Behavioral Indicator Card        */
/* -------------------------------- */

interface BehavioralIndicatorCardProps {
  indicator: BehavioralIndicatorResponse;
}

function BehavioralIndicatorCard({
  indicator,
}: BehavioralIndicatorCardProps) {
  const severity = indicator.severity.toLowerCase();

  const severityConfig =
    severity === "critical"
      ? {
          border: "border-red-200",
          background: "bg-red-50",
          badge: "bg-red-100 text-red-700",
          icon: "🔴",
        }
      : severity === "high"
        ? {
            border: "border-orange-200",
            background: "bg-orange-50",
            badge: "bg-orange-100 text-orange-700",
            icon: "🟠",
          }
        : severity === "medium"
          ? {
              border: "border-yellow-200",
              background: "bg-yellow-50",
              badge: "bg-yellow-100 text-yellow-700",
              icon: "🟡",
            }
          : {
              border: "border-green-200",
              background: "bg-green-50",
              badge: "bg-green-100 text-green-700",
              icon: "🟢",
            };

  return (
    <div
      className={`rounded-xl border p-4 ${severityConfig.border} ${severityConfig.background}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-lg">
            {severityConfig.icon}
          </span>

          <div>
            <h4 className="font-semibold text-gray-900">
              {indicator.title}
            </h4>

            <p className="mt-1 text-sm leading-6 text-gray-700">
              {indicator.description}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${severityConfig.badge}`}
        >
          {indicator.severity}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-200/70 pt-3">
        <span className="text-xs font-medium text-gray-500">
          Detected signals
        </span>

        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-gray-700 shadow-sm">
          {indicator.count}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Legend                           */
/* -------------------------------- */

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