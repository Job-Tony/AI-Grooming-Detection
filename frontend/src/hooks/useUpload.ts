import { useMutation } from "@tanstack/react-query";
import { uploadChat } from "@/services/upload.service";

export function useUpload() {
  return useMutation({
    mutationFn: uploadChat,
  });
}