interface UploadProgressProps {
  loading: boolean;
}

export default function UploadProgress({
  loading,
}: UploadProgressProps) {
  if (!loading) return null;

  return (
    <div className="mt-6 rounded-lg bg-blue-50 p-4">
      <p className="font-medium text-blue-700">
        Uploading chat...
      </p>

      <div className="mt-3 h-2 overflow-hidden rounded bg-blue-200">
        <div className="h-full w-full animate-pulse rounded bg-blue-600" />
      </div>
    </div>
  );
}