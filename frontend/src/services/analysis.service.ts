import apiClient from "@/api/client";

import type {
  Analysis,
  AnalysisListResponse,
} from "@/types/analysis";

export async function getAnalyses(): Promise<Analysis[]> {
  const { data } =
    await apiClient.get<AnalysisListResponse>(
      "/analysis"
    );

  return data.analyses;
}

export async function getAnalysis(
  id: string,
): Promise<Analysis> {
  const { data } =
    await apiClient.get<Analysis>(
      `/analysis/${id}`
    );

  return data;
}

export async function deleteAnalysis(
  id: string,
): Promise<void> {
  await apiClient.delete(
    `/analysis/${id}`
  );
}