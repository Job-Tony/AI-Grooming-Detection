import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
);

export default function RiskDistributionChart() {
  const {
    data: analyses = [],
  } = useAnalysisHistory();

  const low = analyses.filter(
    (a) => a.risk_score < 30,
  ).length;

  const medium = analyses.filter(
    (a) => a.risk_score >= 30 && a.risk_score < 70,
  ).length;

  const high = analyses.filter(
    (a) => a.risk_score >= 70,
  ).length;

  const data = {
    labels: [
      "Low Risk",
      "Medium Risk",
      "High Risk",
    ],
    datasets: [
      {
        data: [low, medium, high],
        backgroundColor: [
          "#22C55E",
          "#FACC15",
          "#EF4444",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        Risk Distribution
      </h2>

      <div className="h-80">
        <Doughnut
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}