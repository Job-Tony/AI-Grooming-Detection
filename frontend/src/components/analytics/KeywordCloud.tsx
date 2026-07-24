import type { ExplanationResponse } from "@/types/ai";

interface KeywordCloudProps {
  explanation: ExplanationResponse;
}

export default function KeywordCloud({
  explanation,
}: KeywordCloudProps) {
  const words = [...explanation.words]
    .sort(
      (a, b) =>
        b.normalized_score - a.normalized_score
    )
    .slice(0, 15);

  function getSize(score: number) {
    if (score >= 0.75) return "text-4xl";
    if (score >= 0.5) return "text-3xl";
    if (score >= 0.25) return "text-2xl";
    return "text-xl";
  }

  function getBadgeColor(level: string) {
    switch (level) {
      case "CRITICAL":
        return "bg-red-100 text-red-700";

      case "HIGH":
        return "bg-orange-100 text-orange-700";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-700";
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">
        Influential Keywords
      </h2>

      {words.length === 0 ? (
        <p className="text-gray-500">
          No keywords available.
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {words.map((word) => (
            <div
              key={word.token}
              className={`rounded-xl px-4 py-3 text-center shadow-sm transition hover:scale-105 ${getBadgeColor(
                word.importance
              )}`}
            >
              <div
                className={`${getSize(
                  word.normalized_score
                )} font-bold`}
              >
                {word.token}
              </div>

              <div className="mt-2 text-sm opacity-80">
                {(word.normalized_score * 100).toFixed(
                  1
                )}
                %
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-3 md:grid-cols-4">
        <Legend
          color="bg-red-500"
          text="Critical"
        />

        <Legend
          color="bg-orange-500"
          text="High"
        />

        <Legend
          color="bg-yellow-400"
          text="Medium"
        />

        <Legend
          color="bg-green-500"
          text="Low"
        />
      </div>
    </div>
  );
}

interface LegendProps {
  color: string;
  text: string;
}

function Legend({
  color,
  text,
}: LegendProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className={`h-4 w-4 rounded-full ${color}`}
      />

      <span className="text-sm text-gray-600">
        {text}
      </span>
    </div>
  );
}