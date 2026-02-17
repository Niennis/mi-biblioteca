import { Link } from "react-router-dom";
import { UserBook, STATUS_LABELS, ReadingStatus } from "../../types/library";
import { Badge } from "../ui/Badge";
import { StarRating } from "../ui/StarRating";

interface Props {
  userBook: UserBook;
}

const statusColors: Record<ReadingStatus, "blue" | "yellow" | "green" | "red"> = {
  QUIERO_LEER: "blue",
  LEYENDO:     "yellow",
  LEIDO:       "green",
  ABANDONADO:  "red",
};

export function LibraryBookCard({ userBook }: Props) {
  const { book } = userBook;

  return (
    <Link
      to={`/biblioteca/${userBook.id}`}
      className="group flex flex-col overflow-hidden rounded-xl transition-all duration-200"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-xs text-center p-2"
            style={{ color: "var(--text-faint)", fontFamily: "var(--font-display)" }}
          >
            Sin portada
          </div>
        )}
        {userBook.isFavorite && (
          <span
            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs"
            style={{ background: "rgba(200,137,42,.9)", color: "#fff" }}
          >
            ♥
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 gap-1.5">
        <h3
          className="font-semibold text-sm line-clamp-2 leading-snug"
          style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
        >
          {book.title}
        </h3>
        <p className="text-xs line-clamp-1" style={{ color: "var(--text-muted)" }}>
          {book.authors.join(", ")}
        </p>
        <div className="mt-auto flex items-center justify-between pt-1">
          <Badge color={statusColors[userBook.status]}>
            {STATUS_LABELS[userBook.status]}
          </Badge>
          {userBook.rating && <StarRating value={userBook.rating} size="sm" readonly />}
        </div>
      </div>
    </Link>
  );
}
