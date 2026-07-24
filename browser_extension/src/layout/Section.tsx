import type { ReactNode } from "react";

interface Props {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function Section({
  title,
  icon,
  children,
}: Props) {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        {icon}

        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}