import type { ExplanationResponse } from "@/types/ai";

interface ConversationHeatmapProps {
  conversation: string[];
  explanation: ExplanationResponse;
}

export default function ConversationHeatmap({
  conversation,
  explanation,
}: ConversationHeatmapProps) {
  const tokenMap = new Map(
    explanation.words.map((word) => [
      word.token.toLowerCase(),
      word.importance,
    ])
  );

  function getColor(level?: string) {
    switch (level) {
      case "CRITICAL":
        return "bg-red-500 text-white";

      case "HIGH":
        return "bg-orange-400 text-white";

      case "MEDIUM":
        return "bg-yellow-300 text-black";

      case "LOW":
        return "bg-green-300 text-black";

      default:
        return "";
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">
        Conversation Heatmap
      </h2>

      <div className="space-y-4">
        {conversation.map((message, index) => (
          <div
            key={index}
            className="rounded-xl border bg-gray-50 p-4"
          >
            <p className="leading-8">
              {message.split(/\s+/).map((word, i) => {
                const clean = word
                  .replace(/[^\w]/g, "")
                  .toLowerCase();

                const level = tokenMap.get(clean);

                return (
                  <span
                    key={i}
                    className={`mr-1 inline-block rounded px-1 ${getColor(
                      level
                    )}`}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-5 text-sm">
        <Legend
          color="bg-red-500"
          label="Critical"
        />

        <Legend
          color="bg-orange-400"
          label="High"
        />

        <Legend
          color="bg-yellow-300"
          label="Medium"
        />

        <Legend
          color="bg-green-300"
          label="Low"
        />
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
        className={`h-4 w-4 rounded ${color}`}
      />

      <span>{label}</span>
    </div>
  );
}