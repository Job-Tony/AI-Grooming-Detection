import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Flame,
} from "lucide-react";

import type { ExplanationResponse } from "@/types/ai";

interface StatisticsCardProps {
  explanation: ExplanationResponse;
}

export default function StatisticsCard({
  explanation,
}: StatisticsCardProps) {
  const critical = explanation.words.filter(
  (word) => word.importance.toLowerCase() === "critical"
).length;

const high = explanation.words.filter(
  (word) => word.importance.toLowerCase() === "high"
).length;

const medium = explanation.words.filter(
  (word) => word.importance.toLowerCase() === "medium"
).length;

const low = explanation.words.filter(
  (word) => word.importance.toLowerCase() === "low"
).length;

  const average =
    explanation.words.length === 0
      ? 0
      : explanation.words.reduce(
          (sum, word) => sum + word.normalized_score,
          0
        ) / explanation.words.length;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">
        Explanation Statistics
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatBox
          icon={<Flame className="h-6 w-6 text-red-600" />}
          title="Critical"
          value={critical}
          color="bg-red-50"
        />

        <StatBox
          icon={
            <AlertTriangle className="h-6 w-6 text-orange-500" />
          }
          title="High"
          value={high}
          color="bg-orange-50"
        />

        <StatBox
          icon={
            <AlertCircle className="h-6 w-6 text-yellow-500" />
          }
          title="Medium"
          value={medium}
          color="bg-yellow-50"
        />

        <StatBox
          icon={
            <CheckCircle className="h-6 w-6 text-green-600" />
          }
          title="Low"
          value={low}
          color="bg-green-50"
        />
      </div>

      <div className="mt-8 rounded-xl bg-gray-50 p-5">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Average Importance
          </span>

          <span className="text-2xl font-bold">
            {(average * 100).toFixed(1)}%
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${average * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

interface StatBoxProps {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

function StatBox({
  title,
  value,
  color,
  icon,
}: StatBoxProps) {
  return (
    <div className={`${color} rounded-xl p-5`}>
      <div className="flex items-center justify-between">
        {icon}

        <span className="text-3xl font-bold">
          {value}
        </span>
      </div>

      <p className="mt-4 font-semibold">
        {title}
      </p>
    </div>
  );
}