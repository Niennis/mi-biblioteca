import { ReadingStatus, STATUS_LABELS } from "../../types/library";

interface Filters {
  status?: ReadingStatus;
  favorite?: boolean;
  sortBy?: "recent" | "title" | "rating";
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const statuses: (ReadingStatus | "")[] = ["", "QUIERO_LEER", "LEYENDO", "LEIDO", "ABANDONADO"];

const selectStyle: React.CSSProperties = {
  borderColor: "var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  boxShadow: "var(--shadow-sm)",
  borderRadius: "var(--radius)",
  fontFamily: "var(--font-body)",
};

export function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={filters.status ?? ""}
        onChange={(e) =>
          onChange({ ...filters, status: (e.target.value || undefined) as ReadingStatus | undefined })
        }
        className="border px-3 py-2 text-sm outline-none"
        style={selectStyle}
      >
        <option value="">Todos los estados</option>
        {statuses.filter(Boolean).map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s as ReadingStatus]}</option>
        ))}
      </select>

      <label
        className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none"
        style={{ color: "var(--text-muted)" }}
      >
        <input
          type="checkbox"
          checked={filters.favorite ?? false}
          onChange={(e) => onChange({ ...filters, favorite: e.target.checked || undefined })}
          className="rounded"
          style={{ accentColor: "var(--accent)" }}
        />
        ♥ Favoritos
      </label>

      <select
        value={filters.sortBy ?? "recent"}
        onChange={(e) =>
          onChange({ ...filters, sortBy: e.target.value as Filters["sortBy"] })
        }
        className="border px-3 py-2 text-sm outline-none"
        style={selectStyle}
      >
        <option value="recent">Más recientes</option>
        <option value="title">Título A-Z</option>
        <option value="rating">Mejor calificados</option>
      </select>
    </div>
  );
}
