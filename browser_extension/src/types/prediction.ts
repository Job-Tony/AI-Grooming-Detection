export interface PredictionRequest {
  upload_id?: string;
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

export interface WordExplanation {
  token: string;
  score: number;
  normalized_score: number;
  importance: string;
  color: string;
}

export interface ExplanationResponse {
  summary: string;
  words: WordExplanation[];
}

export interface PredictionTimelinePoint {
  message_index: number;
  label: string;
  probability: number;
  confidence: number;
  risk_score: number;
}

export interface ExplanationTimelinePoint {
  message_index: number;
  risk_score: number;
}

export interface PredictionWithExplanation {
  prediction: PredictionResponse;
  explanation: ExplanationResponse;

  prediction_timeline: PredictionTimelinePoint[];

  explanation_timeline: ExplanationTimelinePoint[];
}