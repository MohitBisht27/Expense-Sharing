import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const base =
    "btn-base font-semibold select-none inline-flex items-center justify-center transition-all duration-200 relative";

  const variants = {
    primary: "btn-primary",
    secondary:
      "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 active:bg-slate-200",
    danger:
      "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-[0_4px_14px_rgba(239,68,68,0.35)] hover:shadow-[0_8px_24px_rgba(239,68,68,0.45)] hover:-translate-y-0.5 active:translate-y-0",
    outline: "btn-outline",
    ghost: "btn-ghost",
    success:
      "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.45)] hover:-translate-y-0.5 active:translate-y-0",
  };

  const sizes = {
    xs: "px-3 py-1.5 text-xs rounded-lg gap-1",
    sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-[10px] gap-2",
    lg: "px-7 py-3.5 text-base rounded-xl gap-2.5",
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size]} ${
        disabled || loading
          ? "opacity-60 cursor-not-allowed pointer-events-none"
          : ""
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
