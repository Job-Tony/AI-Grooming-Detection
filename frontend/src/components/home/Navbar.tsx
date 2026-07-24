import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "#hero" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Technology", href: "#technology" },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="rounded-xl bg-blue-600 p-2">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              SafeChat AI
            </h1>

            <p className="text-xs text-slate-400">
              AI Moderation Platform
            </p>
          </div>
        </Link>

        <nav className="hidden gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-blue-400"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/login"
            className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-500 hover:text-white"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Register
          </Link>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-800 bg-slate-950 md:hidden">

          <div className="flex flex-col gap-6 p-6">

            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-slate-300"
              >
                {item.label}
              </a>
            ))}

            <Link
              to="/login"
              className="rounded-lg border border-slate-700 py-3 text-center text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 py-3 text-center font-semibold text-white"
            >
              Register
            </Link>

          </div>

        </div>
      )}
    </header>
  );
};

export default Navbar;