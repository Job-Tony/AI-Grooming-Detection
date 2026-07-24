import type {
  PredictionTimelinePoint,
  ExplanationTimelinePoint,
} from "../types/prediction";

interface TimelineCardProps {
  predictionTimeline: PredictionTimelinePoint[];
  explanationTimeline: ExplanationTimelinePoint[];
}

function riskColor(score: number): string {
  if (score >= 80) return "bg-red-500";
  if (score >= 60) return "bg-orange-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-green-500";
}

export default function TimelineCard({
  predictionTimeline,
  explanationTimeline,
}: TimelineCardProps) {
  if (
    predictionTimeline.length === 0 &&
    explanationTimeline.length === 0
  ) {
    return null;
  }

  return (
    <div className="rounded-xl bg-white shadow-md p-5 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Detection Timeline
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Observe how the AI's prediction evolves as more messages are
          analyzed.
        </p>
      </div>

      <div className="space-y-4">
        {predictionTimeline.map((prediction) => {
          const explanation = explanationTimeline.find(
            (item) =>
              item.message_index === prediction.message_index,
          );

          return (
            <div
              key={prediction.message_index}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">
                  Message {prediction.message_index}
                </h3>

                <span
                  className={`text-white text-xs px-3 py-1 rounded-full ${riskColor(
                    prediction.risk_score,
                  )}`}
                >
                  {prediction.label.replace("_", " ")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">
                    Risk Score
                  </div>

                  <div className="font-semibold">
                    {prediction.risk_score.toFixed(2)}%
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">
                    Confidence
                  </div>

                  <div className="font-semibold">
                    {prediction.confidence.toFixed(2)}%
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">
                    Probability
                  </div>

                  <div className="font-semibold">
                    {(prediction.probability * 100).toFixed(2)}%
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">
                    SHAP Evidence
                  </div>

                  <div className="font-semibold">
                    {explanation
                      ? `${explanation.risk_score.toFixed(2)}%`
                      : "--"}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full ${riskColor(
                      prediction.risk_score,
                    )}`}
                    style={{
                      width: `${prediction.risk_score}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}