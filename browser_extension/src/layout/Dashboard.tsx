import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Dashboard({
  children,
}: Props) {
  return (
    <main
      className="
        relative
        min-h-screen
        w-[420px]
        overflow-hidden
        bg-slate-950
        px-5
        py-6
        text-slate-100
      "
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}