export interface Analysis {
  id: string;

  user_id: string;

  upload_id: string | null;

  prediction: string;

  probability: number;

  confidence: number;

  risk_score: number;

  processing_time_ms: number;

  summary: string;

  model_version: string;

  created_at: string;
}

export interface AnalysisListResponse {
  analyses: Analysis[];
}