import { Brain } from "lucide-react";
import Card from "../ui/Card";

interface Props {
  summary: string;
}

export default function ExplanationCard({
  summary,
}: Props) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <Brain className="text-cyan-400" />

        <h2 className="font-semibold text-white">
          AI Explanation
        </h2>
      </div>

      <p className="text-sm leading-6 text-slate-300">
        {summary}
      </p>
    </Card>
  );
}