import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DeleteDialog from "@/components/history/DeleteDialog";
import EmptyHistory from "@/components/history/EmptyHistory";
import HistoryCard from "@/components/history/HistoryCard";
import HistoryHeader from "@/components/history/HistoryHeader";

import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { useDeleteAnalysis } from "@/hooks/useDeleteAnalysis";

export default function HistoryPage() {
  const navigate = useNavigate();

  const {
    data: analyses,
    isLoading,
    isError,
  } = useAnalysisHistory();

  const deleteMutation = useDeleteAnalysis();

  const [selectedAnalysisId, setSelectedAnalysisId] =
    useState<string | null>(null);

  function handleDelete() {
    if (!selectedAnalysisId) return;

    deleteMutation.mutate(selectedAnalysisId);

    setSelectedAnalysisId(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg font-semibold">
          Loading analysis history...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-red-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-red-700">
          Unable to load analysis history
        </h2>

        <p className="mt-3 text-red-600">
          Please make sure the backend server is running.
        </p>
      </div>
    );
  }

  return (
    <>
      <DeleteDialog
        open={selectedAnalysisId !== null}
        onCancel={() => setSelectedAnalysisId(null)}
        onConfirm={handleDelete}
      />

      <div className="space-y-8">
        <HistoryHeader
          total={analyses?.length ?? 0}
        />

        {!analyses || analyses.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {analyses.map((analysis) => (
              <HistoryCard
                key={analysis.id}
                analysis={analysis}
                onDelete={setSelectedAnalysisId}
                onView={(id) =>
                  navigate(`/analysis/${id}`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}