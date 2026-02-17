import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: Props) {
  const inputId = id ?? (label ? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : undefined);
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-150 outline-none ${className}`}
        style={{
          borderColor: error ? "var(--danger)" : "var(--border)",
          background: "var(--surface)",
          color: "var(--text)",
          boxShadow: "var(--shadow-sm)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? "var(--danger)" : "var(--border-focus)";
          e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? "rgba(155,28,28,.12)" : "rgba(44,74,62,.12)"}`;
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? "var(--danger)" : "var(--border)";
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error && <p className="text-xs font-medium" style={{ color: "var(--danger)" }}>{error}</p>}
    </div>
  );
}
