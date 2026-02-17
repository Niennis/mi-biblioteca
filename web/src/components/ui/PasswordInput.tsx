import { InputHTMLAttributes, useState } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export function PasswordInput({ label, error, className = "", id, ...props }: Props & { id?: string }) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? (label ? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : undefined);

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm transition-all duration-150 outline-none ${className}`}
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
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center px-3 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-faint)" }}
          tabIndex={-1}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? (
            /* Eye-off icon */
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            /* Eye icon */
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-xs font-medium" style={{ color: "var(--danger)" }}>{error}</p>}
    </div>
  );
}
