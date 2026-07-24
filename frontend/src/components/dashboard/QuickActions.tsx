import { useNavigate } from "react-router-dom";
import {
  Upload,
  Brain,
  History,
  ArrowRight,
} from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

function ActionCard({
  title,
  description,
  icon: Icon,
  color,
  onClick,
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-2xl border bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div className={`rounded-xl p-4 ${color}`}>
          <Icon
            size={28}
            className="text-white"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <ArrowRight
        size={22}
        className="text-slate-400 transition-transform group-hover:translate-x-1"
      />
    </button>
  );
}

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        Quick Actions
      </h2>

      <div className="grid gap-5 lg:grid-cols-3">
        <ActionCard
          title="Upload Chat"
          description="Upload a new conversation for analysis."
          icon={Upload}
          color="bg-blue-600"
          onClick={() => navigate("/upload")}
        />

        <ActionCard
          title="Analyze Chat"
          description="Run the AI prediction engine."
          icon={Brain}
          color="bg-purple-600"
          onClick={() => navigate("/prediction")}
        />

        <ActionCard
          title="Analysis History"
          description="View previous AI analyses."
          icon={History}
          color="bg-green-600"
          onClick={() => navigate("/history")}
        />
      </div>
    </div>
  );
}