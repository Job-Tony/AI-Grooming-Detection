import { useNavigate } from "react-router-dom";

interface UploadCardProps {
  uploadId: string;
  filename: string;
  status: string;
}

export default function UploadCard({
  uploadId,
  filename,
  status,
}: UploadCardProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-green-700">
          ✅ Upload Successful
        </h2>

        <p className="mt-1 text-slate-600">
          Your conversation has been uploaded successfully and is ready for AI
          analysis.
        </p>
      </div>

      <div className="space-y-2">
        <p>
          <strong>File:</strong> {filename}
        </p>

        <p>
          <strong>Status:</strong> {status}
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={() =>
            navigate("/prediction", {
              state: {
                uploadId,
              },
            })
          }
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Analyze with AI
        </button>
      </div>
    </div>
  );
}