import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
);

interface RiskGaugeProps {
  riskScore: number;
}

export default function RiskGauge({
  riskScore,
}: RiskGaugeProps) {
  const value = Math.max(
    0,
    Math.min(100, riskScore),
  );

  let color = "#22C55E";

  if (value >= 80) {
    color = "#DC2626";
  } else if (value >= 60) {
    color = "#F97316";
  } else if (value >= 30) {
    color = "#EAB308";
  }

  const data = {
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [
          color,
          "#E5E7EB",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold">
        AI Risk Gauge
      </h2>

      <div className="relative mx-auto h-64 w-64">
        <Doughnut
          data={data}
          options={options}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold">
            {value.toFixed(1)}%
          </span>

          <span
            className="mt-2 rounded-full px-4 py-1 text-sm font-semibold text-white"
            style={{
              backgroundColor: color,
            }}
          >
            {value >= 80
              ? "HIGH RISK"
              : value >= 60
              ? "MEDIUM RISK"
              : value >= 30
              ? "LOW RISK"
              : "SAFE"}
          </span>
        </div>
      </div>
    </div>
  );
}