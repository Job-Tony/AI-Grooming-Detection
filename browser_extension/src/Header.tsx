import {
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Header() {
  return (
    <header className="mb-6">

      <div className="flex items-center gap-4">

        <div
          className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-gradient-to-br
          from-blue-600
          to-cyan-500
          shadow-lg
          shadow-blue-900/40
          "
        >
          <ShieldCheck
            size={28}
            className="text-white"
          />
        </div>

        <div>

          <h1
            className="
            text-xl
            font-bold
            tracking-wide
            "
          >
            AI Grooming Detection
          </h1>

          <div
            className="
            mt-1
            flex
            items-center
            gap-2
            text-sm
            text-slate-400
            "
          >
            <Sparkles size={15} />

            <span>
              Real-Time Conversation Analysis
            </span>

          </div>

        </div>

      </div>

    </header>
  );
}