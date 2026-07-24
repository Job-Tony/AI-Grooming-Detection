import { Brain, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function AIPreferencesCard() {
  const [threshold, setThreshold] = useState("Medium");

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center gap-3">
        <Brain className="text-blue-600" size={28} />

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            AI Preferences
          </h2>

          <p className="text-gray-500">
            Configure AI analysis behaviour.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-3 block font-medium">
            Risk Threshold
          </label>

          <select
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="w-full rounded-xl border p-3"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <p className="font-semibold text-blue-700">
            AI Model
          </p>

          <p className="mt-1 text-gray-700">
            DistilBERT + BiLSTM
          </p>
        </div>

        <div className="rounded-xl bg-green-50 p-4 flex items-center gap-3">
          <ShieldCheck className="text-green-600" />

          <div>
            <p className="font-semibold text-green-700">
              Explainability
            </p>

            <p className="text-gray-700">
              SHAP Enabled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}