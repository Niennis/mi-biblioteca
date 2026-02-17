interface Props {
  value: number | null | undefined;
  onChange?: (rating: number) => void;
  size?: "sm" | "md";
  readonly?: boolean;
}

export function StarRating({ value, onChange, size = "md", readonly = false }: Props) {
  const stars = [1, 2, 3, 4, 5];
  const sizeClass = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <div className="flex gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star === value ? 0 : star)}
          className={`${sizeClass} transition-all duration-100 ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
          style={{ color: (value ?? 0) >= star ? "var(--accent)" : "var(--border)" }}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
}
