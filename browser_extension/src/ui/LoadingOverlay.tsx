import { Brain, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  visible: boolean;
}

export default function LoadingOverlay({
  visible,
}: Props) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        className="text-center"
      >
        <Brain
          className="mx-auto mb-4 text-cyan-400"
          size={50}
        />

        <Loader2
          className="mx-auto mb-4 animate-spin text-blue-400"
          size={28}
        />

        <p className="font-semibold text-white">
          AI is analyzing...
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Running DistilBERT & SHAP
        </p>
      </motion.div>
    </div>
  );
}