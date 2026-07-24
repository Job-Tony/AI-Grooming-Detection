import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface Props extends HTMLMotionProps<"button"> {
  loading?: boolean;
}

export default function Button({
  children,
  loading = false,
  className = "",
  ...props
}: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      disabled={loading}
      className={`
        w-full
        rounded-xl
        bg-gradient-to-r
        from-blue-600
        to-cyan-500
        py-3
        font-semibold
        text-white
        shadow-lg
        transition-all
        hover:shadow-cyan-400/40
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading ? "Analyzing..." : children}
    </motion.button>
  );
}