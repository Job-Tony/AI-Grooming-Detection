import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

interface Props {
  values: number[];
}

export default function RiskTimeline({ values }: Props) {
  const data = {
    labels: values.map((_, i) => `${i + 1}`),

    datasets: [
      {
        data: values,
        fill: true,
        tension: 0.35,
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,.15)",
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        display: false,
      },

      y: {
        display: false,
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <Line
      data={data}
      options={options}
    />
  );
}