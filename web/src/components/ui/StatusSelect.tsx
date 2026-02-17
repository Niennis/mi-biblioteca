import { ReadingStatus, STATUS_LABELS } from "../../types/library";

interface Props {
  value: ReadingStatus;
  onChange: (status: ReadingStatus) => void;
  className?: string;
}

const statuses: ReadingStatus[] = ["QUIERO_LEER", "LEYENDO", "LEIDO", "ABANDONADO"];

export function StatusSelect({ value, onChange, className = "" }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ReadingStatus)}
      className={`rounded-lg border px-3 py-2 text-sm outline-none ${className}`}
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
        color: "var(--text)",
        fontFamily: "var(--font-body)",
      }}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
      ))}
    </select>
  );
}
