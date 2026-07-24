import { useQuery } from "@tanstack/react-query";

import { getAnalyses } from "@/services/analysis.service";

export function useAnalysisHistory() {
  return useQuery({
    queryKey: ["analysis-history"],
    queryFn: getAnalyses,
  });
}