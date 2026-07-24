import { useQuery } from "@tanstack/react-query";

import { getModelInfo } from "../services/ai.service";

export function useModelInfo() {
  return useQuery({
    queryKey: ["model-info"],
    queryFn: getModelInfo,
    staleTime: Infinity,
  });
}