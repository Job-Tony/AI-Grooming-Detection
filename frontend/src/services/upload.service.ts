import api from "@/api/client";
import type {
  UploadResponse,
  UploadedConversationResponse,
} from "@/types/upload";

export async function uploadChat(
  file: File
): Promise<UploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<UploadResponse>(
    "/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function getUploadedConversation(
  uploadId: string
): Promise<UploadedConversationResponse> {
  const response =
    await api.get<UploadedConversationResponse>(
      `/uploads/${uploadId}`
    );

  return response.data;
}