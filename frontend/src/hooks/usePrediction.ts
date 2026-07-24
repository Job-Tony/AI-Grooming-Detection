import { useMutation } from "@tanstack/react-query";

import {
  predictWithExplanation,
} from "../services/ai.service";

import type {
  PredictionRequest,
  PredictionWithExplanationResponse,
} from "../types/ai";

export function usePrediction() {
  return useMutation<
    PredictionWithExplanationResponse,
    Error,
    PredictionRequest
  >({
    mutationFn: predictWithExplanation,
  });
}