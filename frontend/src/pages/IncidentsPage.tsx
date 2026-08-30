import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  getIncidents,
} from "@/services/incidentService";

export default function IncidentsPage() {
  const navigate = useNavigate();

  const {
    data: incidents,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["incidents"],
    queryFn: () => getIncidents(100),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Incidents
        </h1>

        <p className="mt-4 text-gray-500">
          Loading incidents...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Incidents
        </h1>

        <p className="mt-4 text-red-500">
          Failed to load incidents.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {error instanceof Error
            ? error.message
            : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Incidents
        </h1>

        <p className="mt-1 text-gray-500">
          Security incidents detected by SafeChat AI.
        </p>
      </div>

      {/* Empty state */}
      {!incidents || incidents.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-lg font-semibold">
            No incidents detected
          </h2>

          <p className="mt-2 text-gray-500">
            AI-detected incidents will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">

          <table className="w-full text-left">

            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  Platform
                </th>

                <th className="px-4 py-3">
                  Channel
                </th>

                <th className="px-4 py-3">
                  Prediction
                </th>

                <th className="px-4 py-3">
                  Risk
                </th>

                <th className="px-4 py-3">
                  Confidence
                </th>

                <th className="px-4 py-3">
                  Messages
                </th>

                <th className="px-4 py-3">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>

              {incidents.map((incident) => (
                <tr
                  key={incident.id}
                  onClick={() =>
                    navigate(
                      `/incidents/${incident.id}`,
                    )
                  }
                  className="cursor-pointer border-b transition-colors hover:bg-blue-50 last:border-b-0"
                >

                  <td className="px-4 py-3">
                    {incident.platform}
                  </td>

                  <td className="px-4 py-3">
                    {incident.channel_name ||
                      incident.channel_id ||
                      "Unknown"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={
                        incident.prediction ===
                        "HIGH_RISK"
                          ? "font-semibold text-red-600"
                          : incident.prediction ===
                            "MEDIUM_RISK"
                          ? "font-semibold text-yellow-600"
                          : "font-semibold text-green-600"
                      }
                    >
                      {incident.prediction}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {(incident.risk_score * 100).toFixed(1)}%
                  </td>

                  <td className="px-4 py-3">
                    {(incident.confidence * 100).toFixed(1)}%
                  </td>

                  <td className="px-4 py-3">
                    {incident.message_count}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(
                      incident.created_at,
                    ).toLocaleString()}
                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}