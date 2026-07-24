
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { deleteAnalysis } from "@/services/analysis.service";

export function useDeleteAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnalysis,

    onSuccess: () => {
      toast.success("Analysis deleted.");

      queryClient.invalidateQueries({
        queryKey: ["analysis-history"],
      });
    },

    onError: () => {
      toast.error("Unable to delete analysis.");
    },
  });
}