import { NavLink, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Home,
  Upload,
  Brain,
  History,
  ShieldAlert,
  Settings,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flex h-screen w-72 flex-col bg-slate-900 text-white shadow-2xl">
      {/* ================= Logo ================= */}

      <div className="border-b border-slate-700 p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-600 p-3 shadow-lg">
            <BrainCircuit
              size={30}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold leading-tight">
              AI Grooming
            </h1>

            <h2 className="text-lg font-bold leading-tight">
              Detection
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Early Detection Platform
            </p>
          </div>
        </div>
      </div>

      {/* ================= Navigation ================= */}

      <nav className="flex-1 space-y-2 p-5">
        <NavLink
          to="/dashboard"
          className={navLinkClass}
        >
          <Home size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/upload"
          className={navLinkClass}
        >
          <Upload size={20} />
          Upload Chat
        </NavLink>

        <NavLink
          to="/prediction"
          className={navLinkClass}
        >
          <Brain size={20} />
          Analyze Chat
        </NavLink>

        <NavLink
          to="/history"
          className={navLinkClass}
        >
          <History size={20} />
          Analysis History
        </NavLink>

        <NavLink
          to="/incidents"
          className={navLinkClass}
        >
          <ShieldAlert size={20} />
          Incidents
        </NavLink>

        <NavLink
          to="/settings"
          className={navLinkClass}
        >
          <Settings size={20} />
          Settings
        </NavLink>
      </nav>

      {/* ================= Footer ================= */}

      <div className="border-t border-slate-700 p-5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-4 py-3 font-medium transition-all hover:bg-red-700"
        >
          <LogOut size={20} />
          Logout
        </button>

        <p className="mt-5 text-center text-xs text-slate-500">
          Version 1.0.0
        </p>
      </div>
    </aside>
  );
}