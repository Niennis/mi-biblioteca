import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  color?: "gray" | "blue" | "green" | "yellow" | "red" | "indigo";
}

const colors: Record<NonNullable<Props["color"]>, React.CSSProperties> = {
  gray:   { background: "var(--surface-alt)", color: "var(--text-muted)" },
  blue:   { background: "#dbeafe", color: "#1e40af" },
  green:  { background: "var(--primary-light)", color: "var(--primary)" },
  yellow: { background: "var(--accent-light)", color: "var(--accent-hover)" },
  red:    { background: "var(--danger-light)", color: "var(--danger)" },
  indigo: { background: "#ede9fe", color: "#5b21b6" },
};

export function Badge({ children, color = "gray" }: Props) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={colors[color]}
    >
      {children}
    </span>
  );
}
