import type { ModelInfoResponse } from "../../types/ai";

interface Props {
  info: ModelInfoResponse;
}

export default function ModelInfoCard({
  info,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">
        Model Information
      </h2>

      <div className="space-y-2">
        <p>
          <strong>Model:</strong> {info.model_name}
        </p>

        <p>
          <strong>Architecture:</strong>{" "}
          {info.architecture}
        </p>

        <p>
          <strong>Version:</strong>{" "}
          {info.model_version}
        </p>

        <p>
          <strong>Best F1:</strong>{" "}
          {info.best_validation_f1}
        </p>

        <p>
          <strong>Device:</strong>{" "}
          {info.device}
        </p>
      </div>
    </div>
  );
}