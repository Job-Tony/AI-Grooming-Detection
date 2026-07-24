import { useState } from "react";
import toast from "react-hot-toast";

import FileUpload from "@/components/upload/FileUpload";
import UploadProgress from "@/components/upload/UploadProgress";
import UploadCard from "@/components/upload/UploadCard";

import { useUpload } from "@/hooks/useUpload";
import type { UploadResponse } from "@/types/upload";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] =
    useState<UploadResponse | null>(null);

  const uploadMutation = useUpload();

  async function handleUpload() {
    if (!selectedFile) {
      toast.error("Please select a chat file.");
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync(selectedFile);

      setUploadResult(result);

      setSelectedFile(null);

      toast.success("Chat uploaded successfully!");
    } catch (error) {
      console.error(error);

      toast.error("Upload failed.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Upload Conversation
        </h1>

        <p className="mt-2 text-slate-500">
          Upload a conversation file for AI-based grooming detection.
        </p>
      </div>

      <FileUpload
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
      />

      <button
        onClick={handleUpload}
        disabled={uploadMutation.isPending}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {uploadMutation.isPending
          ? "Uploading..."
          : "Upload Chat"}
      </button>

      <UploadProgress
        loading={uploadMutation.isPending}
      />

      {uploadResult && (
        <UploadCard
          uploadId={uploadResult.upload_id}
          filename={uploadResult.filename}
          status={uploadResult.status}
        />
      )}
    </div>
  );
}