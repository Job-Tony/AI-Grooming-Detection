import { useState } from "react";
import api from "../api/api";

import type {
  PredictionRequest,
  PredictionWithExplanation,
} from "../types/prediction";

export function usePrediction() {
  const [loading, setLoading] = useState(false);

  const [prediction, setPrediction] =
    useState<PredictionWithExplanation | null>(null);

  const analyze = async (conversation: string[]) => {
    setLoading(true);

    try {
      const request: PredictionRequest = {
        conversation,
      };

      const response =
        await api.post<PredictionWithExplanation>(
          "/ai/predict/explain/public",
          request,
        );

      setPrediction(response.data);

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // Used by AutoMonitor to push an automatic
  // prediction into the existing RiskCard UI.
  const setAutomaticPrediction = (
    result: PredictionWithExplanation,
  ) => {
    setPrediction(result);
  };

  return {
    loading,
    prediction,
    analyze,
    setAutomaticPrediction,
  };
}