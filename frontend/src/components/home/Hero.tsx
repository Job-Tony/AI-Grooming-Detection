import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  Shield,
  Activity,
  CheckCircle2,
} from "lucide-react";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-slate-950 pt-40 pb-24"
    >
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[160px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        <div>

          <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
            Explainable AI Moderation Platform
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl">
            Protect Online Communities
            <span className="block text-blue-400">
              Using Explainable AI
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
            SafeChat AI helps administrators identify potential online
            child grooming conversations using DistilBERT + BiLSTM,
            while providing transparent explanations for every AI
            prediction.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              to="/login"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-500"
            >
              Administrator Login
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/register"
              className="rounded-xl border border-slate-700 px-7 py-4 font-semibold text-slate-200 transition hover:border-blue-500"
            >
              Register
            </Link>

          </div>

          <div className="mt-12 flex flex-wrap gap-8">

            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400" />
              <span className="text-slate-300">
                Explainable AI
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400" />
              <span className="text-slate-300">
                DistilBERT + BiLSTM
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400" />
              <span className="text-slate-300">
                Risk Assessment
              </span>
            </div>

          </div>

        </div>

        <div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl">

            <div className="grid gap-6">

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-blue-600/20 p-4">
                    <BrainCircuit className="h-8 w-8 text-blue-400" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Explainable AI
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Every prediction includes word-level explanations.
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-green-500/20 p-4">
                    <Shield className="h-8 w-8 text-green-400" />
                  </div>

                  <div>

                    <h3 className="font-semibold text-white">
                      Secure Analysis
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      AI-assisted moderation with administrator review.
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-cyan-500/20 p-4">
                    <Activity className="h-8 w-8 text-cyan-400" />
                  </div>

                  <div>

                    <h3 className="font-semibold text-white">
                      High Performance
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Built with PyTorch, Transformers and FastAPI.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;