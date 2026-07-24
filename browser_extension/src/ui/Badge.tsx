interface BadgeProps {
  text: string;
  variant?: "success" | "warning" | "danger" | "info";
}

export default function Badge({
  text,
  variant = "info",
}: BadgeProps) {
  const colors = {
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-300",
    danger: "bg-red-500/20 text-red-400",
    info: "bg-blue-500/20 text-blue-300",
  };

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-4
        py-1
        text-xs
        font-semibold
        uppercase
        tracking-wide
        ${colors[variant]}
      `}
    >
      {text}
    </span>
  );
}