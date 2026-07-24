import { useRef } from "react";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

export default function FileUpload({
  selectedFile,
  onFileSelect,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    onFileSelect(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    onFileSelect(file);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-10 text-center transition hover:border-blue-500 hover:bg-slate-50"
      >
        <UploadCloud
          className="mx-auto mb-4 text-blue-600"
          size={48}
        />

        <h2 className="text-xl font-semibold">
          Upload Conversation
        </h2>

        <p className="mt-2 text-slate-500">
          Drag & drop your chat file here
        </p>

        <p className="mt-1 text-slate-400">
          or click to browse
        </p>

        {selectedFile && (
          <div className="mt-6 rounded-lg bg-slate-100 p-4">
            <p className="font-medium">
              Selected File:
            </p>

            <p className="text-blue-600">
              {selectedFile.name}
            </p>

            <p className="text-sm text-slate-500">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept=".txt,.json"
        onChange={handleFileChange}
      />
    </>
  );
}