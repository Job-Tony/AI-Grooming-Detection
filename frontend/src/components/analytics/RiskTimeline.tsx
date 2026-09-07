import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface TimelinePoint {
  message_index: number;
  risk_score: number;
}

interface RiskTimelineProps {
  timeline: TimelinePoint[];
}

export default function RiskTimeline({
  timeline,
}: RiskTimelineProps) {
  const chartData = timeline.map((point) => ({
    Message: point.message_index,
    Risk: point.risk_score,
  }));

  const riskValues = timeline.map((point) => point.risk_score);

  const minimumRisk =
    riskValues.length > 0 ? Math.min(...riskValues) : 0;

  const maximumRisk =
    riskValues.length > 0 ? Math.max(...riskValues) : 0;

  const averageRisk =
    riskValues.length > 0
      ? riskValues.reduce((sum, value) => sum + value, 0) /
        riskValues.length
      : 0;

  const riskIsStable =
    riskValues.length > 1 &&
    maximumRisk - minimumRisk < 1;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Risk Progression
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          AI risk across progressively larger conversation
          checkpoints.
        </p>
      </div>

      {timeline.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">
          No risk timeline data is available.
        </div>
      ) : (
        <>
          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="Message"
                  label={{
                    value: "Messages processed",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />

                <YAxis
                  domain={[0, 100]}
                  label={{
                    value: "Risk %",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(2)}%`,
                    "Risk",
                  ]}
                  labelFormatter={(value) =>
                    `Message ${value}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="Risk"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                Minimum Risk
              </p>
              <p className="mt-1 text-2xl font-bold">
                {minimumRisk.toFixed(1)}%
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                Average Risk
              </p>
              <p className="mt-1 text-2xl font-bold">
                {averageRisk.toFixed(1)}%
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                Final Risk
              </p>
              <p className="mt-1 text-2xl font-bold">
                {maximumRisk.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
            {riskIsStable ? (
              <>
                <strong>Risk remained consistently high</strong>{" "}
                across the evaluated conversation checkpoints.
              </>
            ) : (
              <>
                The graph shows how the AI risk changes as
                progressively larger portions of the conversation
                are analyzed.
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Each point represents an AI prediction at a
            conversation checkpoint. Longer conversations are
            evaluated at multiple checkpoints to balance early
            detection with processing cost.
          </p>
        </>
      )}
    </div>
  );
}