import { ShieldCheck, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">
          <ShieldCheck className="text-white" size={26} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">
            AI Grooming Detection
          </h1>

          <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
            <Sparkles size={14} />
            <span>Real-Time Conversation Analysis</span>
          </div>
        </div>
      </div>
    </header>
  );
}