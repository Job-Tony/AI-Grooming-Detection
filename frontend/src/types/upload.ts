export interface UploadResponse {
  upload_id: string;
  filename: string;
  status: string;
  created_at: string;
}

export interface UploadedConversationResponse {
  upload_id: string;
  filename: string;
  conversation: string[];
  message_count: number;
  created_at: string;
}