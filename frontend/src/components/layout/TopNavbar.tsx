import {
  Bell,
  CalendarDays,
  UserCircle2,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function TopNavbar() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
      {/* Left */}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          AI Grooming Detection Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back
          {user?.username ? `, ${user.username}` : ""} 👋
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-6">
        {/* Date */}

        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2">
          <CalendarDays
            size={18}
            className="text-slate-600"
          />

          <span className="text-sm font-medium text-slate-700">
            {today}
          </span>
        </div>

        {/* Notifications */}

        <button className="rounded-xl bg-slate-100 p-3 transition hover:bg-slate-200">
          <Bell
            size={20}
            className="text-slate-700"
          />
        </button>

        {/* User */}

        <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-2">
          <UserCircle2
            size={34}
            className="text-slate-700"
          />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {user?.username ?? "User"}
            </p>

            <p className="text-xs text-slate-500">
              Authenticated User
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}