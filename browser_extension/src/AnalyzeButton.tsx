import {
  Loader2,
  ScanSearch,
} from "lucide-react";

interface AnalyzeButtonProps {
  loading: boolean;
  onAnalyze: () => void;
}

export default function AnalyzeButton({
  loading,
  onAnalyze,
}: AnalyzeButtonProps) {
  return (
    <button
      onClick={onAnalyze}
      disabled={loading}
      className="
      mt-2
      flex
      w-full
      items-center
      justify-center
      gap-3
      rounded-2xl
      bg-gradient-to-r
      from-blue-600
      to-cyan-500
      px-5
      py-4
      font-semibold
      text-white
      shadow-lg
      shadow-blue-900/30
      transition-all
      duration-300
      hover:scale-[1.02]
      hover:shadow-cyan-500/30
      active:scale-95
      disabled:cursor-not-allowed
      disabled:opacity-60
      "
    >
      {loading ? (
        <>
          <Loader2
            size={20}
            className="animate-spin"
          />

          <span>
            Analyzing Conversation...
          </span>
        </>
      ) : (
        <>
          <ScanSearch size={20} />

          <span>
            Analyze Current Conversation
          </span>
        </>
      )}
    </button>
  );
}