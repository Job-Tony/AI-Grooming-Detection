import { CalendarDays, Sparkles } from "lucide-react";

export default function DashboardHeader() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700 p-8 text-white shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <Sparkles className="text-yellow-300" size={30} />

            <h1 className="text-3xl font-bold">
              AI Grooming Detection Dashboard
            </h1>
          </div>

          <p className="text-slate-200">
            Monitor conversations, review AI predictions, and
            detect potential online grooming behaviour.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
          <CalendarDays size={20} />

          <span className="font-medium">
            {today}
          </span>
        </div>
      </div>
    </div>
  );
}