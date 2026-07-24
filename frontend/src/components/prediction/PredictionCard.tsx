import type { PredictionResponse } from "../../types/ai";

interface PredictionCardProps {
  prediction: PredictionResponse;
}

export default function PredictionCard({
  prediction,
}: PredictionCardProps) {
  const highRisk = prediction.label === "HIGH_RISK";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Prediction Result
        </h2>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            highRisk
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {prediction.label.replace("_", " ")}
        </span>
      </div>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-gray-500">
            Messages
          </span>

          <span className="font-semibold">
            {prediction.message_count}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Model Version
          </span>

          <span className="font-semibold">
            {prediction.model_version}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Analysis Time
          </span>

          <span className="font-semibold">
            {(prediction.prediction_time_ms / 1000).toFixed(2)} sec
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Probability
          </span>

          <span className="font-semibold">
            {(prediction.probability * 100).toFixed(2)}%
          </span>
        </div>

      </div>
    </div>
  );
}