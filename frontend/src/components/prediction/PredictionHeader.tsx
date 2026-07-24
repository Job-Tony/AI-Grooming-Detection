interface PredictionHeaderProps {
  label: string;
  riskScore: number;
  confidence: number;
}

export default function PredictionHeader({
  label,
  riskScore,
  confidence,
}: PredictionHeaderProps) {
  const highRisk = label === "HIGH_RISK";

  return (
    <div
      className={`rounded-2xl p-8 shadow-lg text-white ${
        highRisk
          ? "bg-gradient-to-r from-red-600 to-red-500"
          : "bg-gradient-to-r from-green-600 to-green-500"
      }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest opacity-80">
            AI Analysis Result
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {highRisk ? "⚠ HIGH RISK DETECTED" : "✓ LOW RISK"}
          </h1>

          <p className="mt-3 text-lg opacity-90">
            DistilBERT + BiLSTM completed the analysis successfully.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm opacity-80">Risk Score</p>
            <p className="text-3xl font-bold">
              {riskScore.toFixed(1)}%
            </p>
          </div>

          <div>
            <p className="text-sm opacity-80">Confidence</p>
            <p className="text-3xl font-bold">
              {confidence.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}