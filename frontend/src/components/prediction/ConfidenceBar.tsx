interface Props {
  confidence: number;
}

export default function ConfidenceBar({
  confidence,
}: Props) {

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl">

      <h2 className="mb-6 text-xl font-bold">
        Confidence
      </h2>

      <div className="h-6 overflow-hidden rounded-full bg-gray-200">

        <div
          className="h-full bg-blue-600 transition-all duration-1000"
          style={{
            width: `${confidence}%`,
          }}
        />

      </div>

      <div className="mt-6 text-center">

        <p className="text-5xl font-bold">
          {confidence.toFixed(2)}%
        </p>

        <p className="mt-2 text-gray-500">
          Model Confidence
        </p>

      </div>

    </div>
  );
}