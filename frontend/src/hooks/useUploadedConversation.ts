import { useQuery } from "@tanstack/react-query";

import { getUploadedConversation } from "@/services/upload.service";

export function useUploadedConversation(
  uploadId?: string | null,
) {
  return useQuery({
    queryKey: ["uploaded-conversation", uploadId],
    queryFn: () => getUploadedConversation(uploadId!),
    enabled: !!uploadId,
  });
}