interface Props {
  riskScore: number;
}

export default function RiskScoreCard({
  riskScore,
}: Props) {

  const color =
    riskScore >= 75
      ? "bg-red-500"
      : riskScore >= 50
      ? "bg-orange-500"
      : riskScore >= 25
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl">

      <h2 className="mb-6 text-xl font-bold">
        Risk Score
      </h2>

      <div className="h-6 overflow-hidden rounded-full bg-gray-200">

        <div
          className={`${color} h-full transition-all duration-1000`}
          style={{
            width: `${riskScore}%`,
          }}
        />

      </div>

      <div className="mt-6 text-center">

        <p className="text-5xl font-bold">
          {riskScore.toFixed(1)}%
        </p>

        <p className="mt-2 text-gray-500">
          Overall AI Risk Assessment
        </p>

      </div>

    </div>
  );
}