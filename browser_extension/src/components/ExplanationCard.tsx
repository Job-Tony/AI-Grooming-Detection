import { Brain } from "lucide-react";
import Card from "../ui/Card";

import type { ExplanationResponse } from "../types/prediction";

interface Props {
  explanation: ExplanationResponse;
}

export default function ExplanationCard({
  explanation,
}: Props) {
  return (
    <Card className="mt-6 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-cyan-500/20 p-2">
          <Brain
            size={22}
            className="text-cyan-400"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            AI Explanation
          </h2>

          <p className="text-sm text-slate-400">
            Why the model reached this prediction
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-900/60 p-4">
        <p className="text-sm leading-7 text-slate-300">
          {explanation.summary}
        </p>
      </div>
    </Card>
  );
}