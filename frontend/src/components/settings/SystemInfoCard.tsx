import {
  Database,
  Server,
  Cpu,
  MonitorSmartphone,
} from "lucide-react";

export default function SystemInfoCard() {
  const info = [
    {
      icon: Server,
      label: "Backend",
      value: "v1.0.0",
    },
    {
      icon: MonitorSmartphone,
      label: "Frontend",
      value: "v1.0.0",
    },
    {
      icon: Cpu,
      label: "AI Model",
      value: "DistilBERT + BiLSTM",
    },
    {
      icon: Database,
      label: "Database",
      value: "PostgreSQL",
    },
    {
      icon: Server,
      label: "API Status",
      value: "🟢 Connected",
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">
        System Information
      </h2>

      <div className="space-y-4">
        {info.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={20}
                  className="text-blue-600"
                />

                <span className="font-medium">
                  {item.label}
                </span>
              </div>

              <span className="font-semibold text-gray-700">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}