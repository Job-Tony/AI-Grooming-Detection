import { AlertTriangle } from "lucide-react";

import Card from "../ui/Card";

interface Props {
  message: string;
}

export default function ErrorCard({
  message,
}: Props) {
  return (
    <Card className="mt-6 border border-red-500/30 p-5">

      <div className="flex gap-3">

        <AlertTriangle
          className="text-red-400"
        />

        <div>

          <h2 className="font-semibold text-red-300">
            Analysis Failed
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            {message}
          </p>

        </div>

      </div>

    </Card>
  );
}