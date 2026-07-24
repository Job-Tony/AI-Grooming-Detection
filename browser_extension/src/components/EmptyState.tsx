import {
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

import Card from "../ui/Card";

export default function EmptyState() {
  return (
    <Card className="mt-6 p-6">

      <div className="flex flex-col items-center text-center">

        <div className="mb-4 rounded-full bg-blue-600/20 p-5">

          <ShieldCheck
            size={40}
            className="text-blue-400"
          />

        </div>

        <h2 className="text-xl font-bold">
          AI Ready
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Analyze the current conversation to
          detect possible grooming behaviour.
        </p>

      </div>

      <div className="mt-6 space-y-3">

        {[
          "Extract conversation",
          "Run DistilBERT + BiLSTM",
          "Calculate risk score",
          "Generate SHAP explanation",
        ].map((step) => (

          <div
            key={step}
            className="flex items-center gap-3"
          >

            <CheckCircle
              size={18}
              className="text-green-400"
            />

            <span>{step}</span>

          </div>

        ))}

      </div>

    </Card>
  );
}