import { Flame } from "lucide-react";

import Card from "../ui/Card";

import type { WordExplanation } from "../types/prediction";

interface Props {
  words: WordExplanation[];
}

export default function WordImportance({
  words,
}: Props) {
  return (
    <Card className="mt-6 p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-red-500/20 p-2">
          <Flame
            size={22}
            className="text-red-400"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Influential Words
          </h2>

          <p className="text-sm text-slate-400">
            SHAP importance for the prediction
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {words.map((word) => (
          <div key={word.token}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-slate-200">
                {word.token}
              </span>

              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: `${word.color}20`,
                  color: word.color,
                }}
              >
                {word.importance}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${word.normalized_score * 100}%`,
                  backgroundColor: word.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}