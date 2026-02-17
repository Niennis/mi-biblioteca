import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
}

const variants: Record<NonNullable<Props["variant"]>, React.CSSProperties> = {
  primary: {
    background: "var(--primary)",
    color: "#ffffff",
  },
  secondary: {
    background: "var(--surface-alt)",
    color: "var(--text)",
    border: "1px solid var(--border)",
  },
  danger: {
    background: "var(--danger)",
    color: "#ffffff",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-muted)",
  },
  accent: {
    background: "var(--accent)",
    color: "#ffffff",
  },
};

const hoverVariants: Record<NonNullable<Props["variant"]>, string> = {
  primary:   "var(--primary-hover)",
  secondary: "#e4dbd0",
  danger:    "#7f1d1d",
  ghost:     "var(--surface-alt)",
  accent:    "var(--accent-hover)",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${className}`}
      disabled={disabled}
      style={{
        ...variants[variant],
        boxShadow: variant === "ghost" ? "none" : "var(--shadow-sm)",
        letterSpacing: "0.01em",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const bg = hoverVariants[variant];
          if (variant === "ghost") {
            e.currentTarget.style.background = bg;
          } else {
            e.currentTarget.style.background = bg;
            e.currentTarget.style.boxShadow = "var(--shadow)";
          }
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        const base = variants[variant];
        e.currentTarget.style.background = (base.background as string) ?? "transparent";
        e.currentTarget.style.boxShadow = variant === "ghost" ? "none" : "var(--shadow-sm)";
        onMouseLeave?.(e);
      }}
      {...props}
    />
  );
}
