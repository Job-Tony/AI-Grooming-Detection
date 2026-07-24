import {
  Cpu,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-800 pt-4">

      <div className="flex items-center justify-center gap-2 text-slate-400">

        <ShieldCheck size={16} />

        <span className="text-xs font-medium">
          AI Grooming Detection
        </span>

      </div>

      <div className="mt-2 flex items-center justify-center gap-2 text-slate-500">

        <Cpu size={14} />

        <span className="text-xs">
          DistilBERT + BiLSTM • Model v1.0.0
        </span>

      </div>

      <p className="mt-3 text-center text-[11px] text-slate-600">
        AI-assisted decision support • Built with FastAPI & React
      </p>

    </footer>
  );
}