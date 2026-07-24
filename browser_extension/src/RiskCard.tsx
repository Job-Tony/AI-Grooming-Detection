import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";

import Card from "./ui/Card";
import Badge from "./ui/Badge";
import ProgressBar from "./ui/ProgressBar";

import type { PredictionWithExplanation } from "./types/prediction";

interface RiskCardProps {
  prediction: PredictionWithExplanation | null;
}

export default function RiskCard({
  prediction,
}: RiskCardProps) {
  if (!prediction) return null;

  const result = prediction.prediction;

  let title = "";
  let description = "";
  let badge: "success" | "warning" | "danger";

  switch (result.label) {
    case "HIGH_RISK":
      title = "High Risk Detected";
      description =
        "Multiple grooming indicators were identified. Immediate review is recommended.";
      badge = "danger";
      break;

    case "MEDIUM_RISK":
      title = "Medium Risk";
      description =
        "Some suspicious behavioural patterns were detected.";
      badge = "warning";
      break;

    default:
      title = "Low Risk";
      description =
        "No significant grooming indicators were detected.";
      badge = "success";
  }

  return (
    <Card className="mt-6 p-6">

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-500/20 p-2">

              <ShieldAlert
                className="text-blue-400"
                size={24}
              />

            </div>

            <div>

              <h2 className="text-xl font-bold text-white">
                {title}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {description}
              </p>

            </div>

          </div>

        </div>

        <Badge
          text={result.label.replace("_", " ")}
          variant={badge}
        />

      </div>

      <div className="mt-8">

        <div className="text-center">

          <div className="text-6xl font-bold text-white">
            {result.risk_score.toFixed(1)}%
          </div>

          <p className="mt-2 text-slate-400">
            Overall Risk Score
          </p>

        </div>

        <ProgressBar
          value={result.risk_score}
        />

      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-slate-900/70 p-4">

          <div className="flex items-center gap-2 text-slate-400">

            <CheckCircle2 size={18} />

            Confidence

          </div>

          <p className="mt-2 text-2xl font-bold">
            {result.confidence.toFixed(1)}%
          </p>

        </div>

        <div className="rounded-xl bg-slate-900/70 p-4">

          <div className="flex items-center gap-2 text-slate-400">

            <Activity size={18} />

            Messages

          </div>

          <p className="mt-2 text-2xl font-bold">
            {result.message_count}
          </p>

        </div>

        <div className="rounded-xl bg-slate-900/70 p-4">

          <div className="flex items-center gap-2 text-slate-400">

            <Clock size={18} />

            Time

          </div>

          <p className="mt-2 text-2xl font-bold">
            {result.prediction_time_ms.toFixed(0)} ms
          </p>

        </div>

        <div className="rounded-xl bg-slate-900/70 p-4">

          <div className="flex items-center gap-2 text-slate-400">

            <AlertTriangle size={18} />

            Model

          </div>

          <p className="mt-2 text-lg font-semibold">
            {result.model_version}
          </p>

        </div>

      </div>

    </Card>
  );
}