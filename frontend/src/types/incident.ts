export interface Incident {
  id: string;
  user_id: string | null;

  platform: string;

  guild_id: string | null;
  channel_id: string | null;
  channel_name: string | null;

  prediction: string;
  probability: number;
  confidence: number;
  risk_score: number;

  message_count: number;
  conversation_excerpt: string | null;

  model_version: string;

  reviewed: boolean;
  reviewed_by: string | null;
  notes: string | null;

  created_at: string;
}