import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  BrainCircuit,
  Globe,
  Lock,
  ShieldCheck,
} from "lucide-react";

import logo from "@/assets/logo.png";
import FeatureCard from "./FeatureCard";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">

      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* Background Glow */}
      <div className="absolute -left-40 top-0 h-[550px] w-[550px] rounded-full bg-blue-600/20 blur-[180px]" />
      <div className="absolute -right-40 bottom-0 h-[550px] w-[550px] rounded-full bg-cyan-500/15 blur-[180px]" />

      {/* Back Button */}
      <Link
        to="/"
        className="absolute left-6 top-6 z-50 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 backdrop-blur transition-all duration-300 hover:border-blue-500 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16">

        <div className="grid w-full items-center gap-16 lg:grid-cols-2">

          {/* ========================================================= */}
          {/* LEFT PANEL */}
          {/* ========================================================= */}

          <div className="hidden lg:flex flex-col justify-center">

            <img
              src={logo}
              alt="SafeChat AI"
              className="mb-8 h-28 w-28 object-contain"
            />

            <h1 className="text-5xl font-bold tracking-tight text-white">
              SafeChat AI
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              AI-Based Early Detection of Online Child Grooming using
              Explainable Deep Learning.
            </p>

            <div className="mt-12 space-y-5">

              <FeatureCard
                icon={<BrainCircuit size={24} />}
                title="Explainable AI"
                description="Transparent AI decisions powered by SHAP explanations."
              />

              <FeatureCard
                icon={<ShieldCheck size={24} />}
                title="DistilBERT + BiLSTM"
                description="State-of-the-art NLP architecture for grooming detection."
              />

              <FeatureCard
                icon={<Activity size={24} />}
                title="Risk Assessment"
                description="Confidence scores and intelligent conversation analysis."
              />

              <FeatureCard
                icon={<Globe size={24} />}
                title="Browser Extension"
                description="Analyze supported conversations directly from the browser."
              />

            </div>

            {/* Statistics */}

            <div className="mt-10 grid grid-cols-2 gap-5">

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur">

                <p className="text-sm text-slate-400">
                  Detection Accuracy
                </p>

                <h2 className="mt-2 text-3xl font-bold text-blue-400">
                  95.2%
                </h2>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur">

                <p className="text-sm text-slate-400">
                  AI Model
                </p>

                <h2 className="mt-2 text-lg font-semibold text-white">
                  DistilBERT + BiLSTM
                </h2>

              </div>

            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT PANEL */}
          {/* ========================================================= */}

          <div className="flex justify-center">

            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">

              {/* Mobile Branding */}

              <div className="mb-8 flex flex-col items-center lg:hidden">

                <img
                  src={logo}
                  alt="SafeChat AI"
                  className="mb-4 h-20 w-20 object-contain"
                />

                <h1 className="text-3xl font-bold text-white">
                  SafeChat AI
                </h1>

                <p className="mt-2 text-center text-sm text-slate-400">
                  AI-Based Early Detection of Online Child Grooming
                </p>

              </div>

              {/* Page Title */}

              <div className="mb-8 text-center lg:text-left">

                <h2 className="text-3xl font-bold text-white">
                  {title}
                </h2>

                <p className="mt-3 text-slate-400">
                  {subtitle}
                </p>

              </div>

              {/* Form */}

              {children}

              {/* Footer */}

              <div className="mt-8 border-t border-slate-800 pt-6 space-y-4">

                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">

                  <div>

                    <p className="text-sm font-medium text-white">
                      AI Detection Engine
                    </p>

                    <p className="text-xs text-slate-400">
                      DistilBERT + BiLSTM
                    </p>

                  </div>

                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                    Online
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">

                  <div>

                    <p className="text-sm font-medium text-white">
                      Security
                    </p>

                    <p className="text-xs text-slate-400">
                      JWT Authentication
                    </p>

                  </div>

                  <span className="flex items-center gap-1 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-400">
                    <Lock size={12} />
                    Secure
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}