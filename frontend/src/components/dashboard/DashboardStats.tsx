import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Shield,
} from "lucide-react";

import StatCard from "./StatCard";

import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";

export default function DashboardStats() {
  const {
    data: analyses = [],
  } = useAnalysisHistory();

  const total = analyses.length;

  const highRisk = analyses.filter(
    (a) => a.risk_score >= 70,
  ).length;

  const safe = analyses.filter(
    (a) => a.risk_score < 30,
  ).length;

  const average =
    total === 0
      ? 0
      : analyses.reduce(
          (sum, item) => sum + item.risk_score,
          0,
        ) / total;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Analyses"
        value={total}
        icon={BarChart3}
        color="bg-blue-600"
      />

      <StatCard
        title="High Risk"
        value={highRisk}
        icon={AlertTriangle}
        color="bg-red-600"
      />

      <StatCard
        title="Safe Chats"
        value={safe}
        icon={Shield}
        color="bg-green-600"
      />

      <StatCard
        title="Average Risk"
        value={`${average.toFixed(1)}%`}
        icon={CheckCircle2}
        color="bg-amber-500"
      />
    </div>
  );
}