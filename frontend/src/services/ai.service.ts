import apiClient from "../api/client";

import type {
  ModelInfoResponse,
  PredictionRequest,
  PredictionResponse,
  PredictionWithExplanationResponse,
} from "../types/ai";

export async function predictConversation(
  request: PredictionRequest,
): Promise<PredictionResponse> {
  const { data } = await apiClient.post<PredictionResponse>(
    "/ai/predict",
    request,
  );

  return data;
}

export async function predictWithExplanation(
  request: PredictionRequest,
): Promise<PredictionWithExplanationResponse> {
  const { data } =
    await apiClient.post<PredictionWithExplanationResponse>(
      "/ai/predict/explain",
      request,
    );

  return data;
}

export async function getModelInfo(): Promise<ModelInfoResponse> {
  const { data } =
    await apiClient.get<ModelInfoResponse>(
      "/ai/info",
    );

  return data;
}