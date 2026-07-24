import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm transition hover:border-blue-500/40 hover:bg-slate-900/70">
      <div className="rounded-xl bg-blue-600/10 p-3 text-blue-400">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}