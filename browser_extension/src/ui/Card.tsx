import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`
        rounded-2xl
        border
        border-slate-700
        bg-slate-800/80
        backdrop-blur-lg
        shadow-lg
        hover:shadow-blue-500/20
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}