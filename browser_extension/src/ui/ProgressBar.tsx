import { motion } from "framer-motion";

interface Props {
  value: number;
}

export default function ProgressBar({
  value,
}: Props) {
  return (
    <div className="mt-3 h-3 w-full rounded-full bg-slate-700 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{
          width: `${Math.max(0, Math.min(value, 100))}%`,
        }}
        transition={{
          duration: 0.8,
        }}
        className={`
          h-full
          rounded-full
          bg-gradient-to-r
          from-red-500
          via-orange-500
          to-yellow-400
        `}
      />
    </div>
  );
}