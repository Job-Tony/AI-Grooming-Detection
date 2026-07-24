import { useQuery } from "@tanstack/react-query";

import { getAnalysis } from "@/services/analysis.service";

export function useAnalysis(id: string) {
  return useQuery({
    queryKey: ["analysis", id],
    queryFn: () => getAnalysis(id),
    enabled: !!id,
  });
}