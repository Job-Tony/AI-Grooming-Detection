import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">

      {/* CTA */}

      <div className="mx-auto max-w-7xl px-6 py-24">

        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 p-12 text-center">

          <h2 className="text-4xl font-bold text-white">
            Ready to Protect Online Communities?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Access SafeChat AI to analyze conversations,
            assess grooming risk and support safer
            digital communities through Explainable AI.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              to="/login"
              className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-500"
            >
              Administrator Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl border border-slate-600 px-8 py-4 font-semibold text-slate-200 transition hover:border-blue-500"
            >
              Register
            </Link>

          </div>

        </div>

      </div>

      {/* Bottom Footer */}

      <div className="border-t border-slate-800">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-600 p-2">
              <ShieldCheck className="text-white" />
            </div>

            <div>

              <h3 className="font-bold text-white">
                SafeChat AI
              </h3>

              <p className="text-sm text-slate-400">
                AI-Based Early Detection of Online Child Grooming
              </p>

            </div>

          </div>

          <p className="text-center text-sm text-slate-500">
            © 2026 SafeChat AI • Final Year Project • Built with React,
            FastAPI, PyTorch and Explainable AI
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;