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

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">
        Risk Progression
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="Message" />

            <YAxis domain={[0, 100]} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="Risk"
              strokeWidth={3}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        The graph shows how the cumulative conversation risk
        changes as each message is processed.
      </p>
    </div>
  );
}