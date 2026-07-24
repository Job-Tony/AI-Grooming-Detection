export interface PredictionRequest {
  upload_id?: string | null;
  conversation: string[];
}

export interface PredictionResponse {
  label: string;
  probability: number;
  confidence: number;
  risk_score: number;
  message_count: number;
  prediction_time_ms: number;
  model_version: string;
}

export interface WordExplanationResponse {
  token: string;
  score: number;
  normalized_score: number;
  importance: string;
  color: string;
}

export interface ExplanationResponse {
  summary: string;
  words: WordExplanationResponse[];
}

/* -------------------------------- */
/* SHAP Explanation Timeline         */
/* -------------------------------- */

export interface ExplanationTimelinePoint {
  message_index: number;
  risk_score: number;
}

/* -------------------------------- */
/* Early Prediction Timeline         */
/* -------------------------------- */

export interface PredictionTimelinePoint {
  message_index: number;
  label: string;
  risk_score: number;
  confidence: number;
}

/* -------------------------------- */
/* Prediction Timeline              */
/* -------------------------------- */

export interface PredictionTimelinePoint {
  message_index: number;
  label: string;
  probability: number;
  confidence: number;
  risk_score: number;
}

/* -------------------------------- */
/* Explanation Timeline             */
/* -------------------------------- */

export interface ExplanationTimelinePoint {
  message_index: number;
  risk_score: number;
}

/* -------------------------------- */
/* /predict/explain Response        */
/* -------------------------------- */

export interface PredictionWithExplanationResponse {
  prediction: PredictionResponse;

  explanation: ExplanationResponse;

  prediction_timeline: PredictionTimelinePoint[];

  explanation_timeline: ExplanationTimelinePoint[];
}

export interface ModelInfoResponse {
  model_name: string;
  model_version: string;
  architecture: string;
  best_validation_f1: number;
  max_sequence_length: number;
  device: string;
  labels: string[];
}