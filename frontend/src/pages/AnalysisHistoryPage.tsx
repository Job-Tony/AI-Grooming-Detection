import { useState } from "react";
import { useNavigate } from "react-router-dom";

import EmptyHistory from "@/components/history/EmptyHistory";
import DeleteDialog from "@/components/history/DeleteDialog";
import HistoryCard from "@/components/history/HistoryCard";
import HistoryHeader from "@/components/history/HistoryHeader";

import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { useDeleteAnalysis } from "@/hooks/useDeleteAnalysis";

export default function AnalysisHistoryPage() {
  const navigate = useNavigate();

  const { data: analyses, isLoading } =
    useAnalysisHistory();

  const deleteMutation =
    useDeleteAnalysis();

  const [selectedAnalysis, setSelectedAnalysis] =
    useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-lg font-semibold">
          Loading analysis history...
        </div>
      </div>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <div className="space-y-8">
        <HistoryHeader total={0} />
        <EmptyHistory />
      </div>
    );
  }

  function handleDelete() {
    if (!selectedAnalysis) return;

    deleteMutation.mutate(selectedAnalysis);

    setSelectedAnalysis(null);
  }

  return (
    <>
      <DeleteDialog
        open={selectedAnalysis !== null}
        onCancel={() =>
          setSelectedAnalysis(null)
        }
        onConfirm={handleDelete}
      />

      <div className="space-y-8">
        <HistoryHeader
          total={analyses.length}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {analyses.map((analysis) => (
            <HistoryCard
              key={analysis.id}
              analysis={analysis}
              onDelete={setSelectedAnalysis}
              onView={(id) =>
                navigate(
                  `/analysis/${id}`
                )
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}