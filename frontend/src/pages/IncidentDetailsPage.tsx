import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ShieldAlert,
  MessageSquare,
  Brain,
  Clock,
  CheckCircle,
} from "lucide-react";

import {
  getIncident,
  reviewIncident,
} from "@/services/incidentService";

export default function IncidentDetailsPage() {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [notes, setNotes] = useState("");

  const {
    data: incident,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["incident", incidentId],
    queryFn: () => getIncident(incidentId!),
    enabled: !!incidentId,
  });

  const reviewMutation = useMutation({
    mutationFn: () =>
      reviewIncident(
        incidentId!,
        notes.trim() || undefined,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incident", incidentId],
      });

      queryClient.invalidateQueries({
        queryKey: ["incidents"],
      });

      setNotes("");
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">
          Loading incident...
        </p>
      </div>
    );
  }

  if (isError || !incident) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">
          Incident not found
        </h2>

        <button
          onClick={() => navigate("/incidents")}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Back to Incidents
        </button>
      </div>
    );
  }

  const riskPercentage =
    incident.risk_score * 100;

  const probabilityPercentage =
    incident.probability * 100;

  const confidencePercentage =
    incident.confidence * 100;

  const isHighRisk =
    incident.risk_score >= 0.8;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/incidents")}
          className="rounded-lg border bg-white p-2 transition hover:bg-slate-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Incident Details
          </h1>

          <p className="mt-1 text-slate-500">
            Review the security incident detected by SafeChat AI.
          </p>
        </div>
      </div>

      {/* Risk Banner */}
      <div
        className={`rounded-xl border p-6 ${
          isHighRisk
            ? "border-red-200 bg-red-50"
            : "border-green-200 bg-green-50"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`rounded-xl p-3 ${
              isHighRisk
                ? "bg-red-600"
                : "bg-green-600"
            }`}
          >
            <ShieldAlert
              size={28}
              className="text-white"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              AI Prediction
            </p>

            <h2
              className={`text-2xl font-bold ${
                isHighRisk
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {incident.prediction}
            </h2>
          </div>
        </div>
      </div>

      {/* Prediction Metrics */}
      <div className="grid gap-5 md:grid-cols-3">

        <MetricCard
          icon={<ShieldAlert size={22} />}
          title="Risk Score"
          value={`${riskPercentage.toFixed(1)}%`}
        />

        <MetricCard
          icon={<Brain size={22} />}
          title="Probability"
          value={`${probabilityPercentage.toFixed(1)}%`}
        />

        <MetricCard
          icon={<CheckCircle size={22} />}
          title="Confidence"
          value={`${confidencePercentage.toFixed(1)}%`}
        />

      </div>

      {/* Incident Information */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">
          Incident Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <InfoItem
            label="Platform"
            value={incident.platform}
          />

          <InfoItem
            label="Channel"
            value={
              incident.channel_name ??
              "Unknown"
            }
          />

          <InfoItem
            label="Channel ID"
            value={
              incident.channel_id ??
              "Unknown"
            }
          />

          <InfoItem
            label="Guild ID"
            value={
              incident.guild_id ??
              "Unknown"
            }
          />

          <InfoItem
            label="Messages Analyzed"
            value={String(
              incident.message_count,
            )}
          />

          <InfoItem
            label="Model Version"
            value={incident.model_version}
          />

          <InfoItem
            label="Detected At"
            value={new Date(
              incident.created_at,
            ).toLocaleString()}
          />

          <InfoItem
            label="Review Status"
            value={
              incident.reviewed
                ? "Reviewed"
                : "Pending Review"
            }
          />

        </div>
      </div>

      {/* Conversation */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <MessageSquare
            size={22}
            className="text-blue-600"
          />

          <h2 className="text-xl font-semibold">
            Conversation Excerpt
          </h2>
        </div>

        <div className="whitespace-pre-wrap rounded-lg border bg-slate-50 p-5 text-sm leading-7 text-slate-700">
          {incident.conversation_excerpt ||
            "No conversation excerpt available."}
        </div>
      </div>

      {/* Moderator Review */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center gap-3">
          <Clock
            size={22}
            className="text-orange-500"
          />

          <h2 className="text-xl font-semibold">
            Moderator Review
          </h2>
        </div>

        {/* Already reviewed */}
        {incident.reviewed ? (
          <div className="rounded-lg bg-green-50 p-5">

            <div className="flex items-center gap-2">
              <CheckCircle
                size={20}
                className="text-green-600"
              />

              <p className="font-semibold text-green-700">
                Reviewed
              </p>
            </div>

            {incident.notes && (
              <div className="mt-5">
                <p className="text-sm text-slate-500">
                  Moderator Notes
                </p>

                <p className="mt-1 whitespace-pre-wrap text-slate-700">
                  {incident.notes}
                </p>
              </div>
            )}

          </div>
        ) : (
          /* Pending review */
          <div className="rounded-lg bg-slate-50 p-5">

            <p className="text-sm text-slate-500">
              Status
            </p>

            <p className="mt-1 font-semibold text-orange-600">
              Pending Review
            </p>

            {/* Notes */}
            <div className="mt-5">

              <label
                htmlFor="review-notes"
                className="text-sm font-medium text-slate-700"
              >
                Moderator Notes
              </label>

              <textarea
                id="review-notes"
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Enter review notes..."
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Review button */}
            <button
              onClick={() =>
                reviewMutation.mutate()
              }
              disabled={reviewMutation.isPending}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {reviewMutation.isPending
                ? "Submitting Review..."
                : "Mark as Reviewed"}
            </button>

            {/* Error */}
            {reviewMutation.isError && (
              <p className="mt-3 text-sm text-red-600">
                Failed to submit review. Please try again.
              </p>
            )}

          </div>
        )}

      </div>

    </div>
  );
}


/* ========================================================= */
/* Helper Components                                         */
/* ========================================================= */

function MetricCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
          {icon}
        </div>

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

      </div>
    </div>
  );
}


function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-all font-medium text-slate-900">
        {value}
      </p>
    </div>
  );
}