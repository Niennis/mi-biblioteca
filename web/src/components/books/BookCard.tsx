import { useState } from "react";
import { SearchBook } from "../../types/book";
import { addToLibrary } from "../../services/library.api";
import { Button } from "../ui/Button";
import { LanguageBadge } from "./LanguageBadge";

interface Props {
  book: SearchBook;
  onAdded?: () => void;
}

export function BookCard({ book, onAdded }: Props) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd() {
    setAdding(true);
    setError("");
    try {
      await addToLibrary(book);
      setAdded(true);
      onAdded?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div
      className="flex gap-4 rounded-xl p-4 transition-shadow duration-200"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="h-36 w-24 flex-shrink-0 overflow-hidden rounded-lg"
        style={{ background: "var(--surface-alt)" }}
      >
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full items-center justify-center text-xs text-center p-2"
            style={{ color: "var(--text-faint)", fontFamily: "var(--font-display)" }}
          >
            Sin portada
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <h3
          className="font-semibold line-clamp-2 leading-snug"
          style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
        >
          {book.title}
        </h3>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          {book.authors.join(", ") || "Autor desconocido"}
        </p>
        {book.publishedDate && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
            {book.publishedDate}
          </p>
        )}
        <div className="mt-1">
          <LanguageBadge isSpanish={book.isSpanish} />
        </div>
        {book.description && (
          <p className="mt-2 text-xs line-clamp-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {book.description}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-2">
          {added ? (
            <span className="text-sm font-semibold" style={{ color: "var(--success)" }}>
              ✓ Agregado
            </span>
          ) : (
            <Button size="sm" onClick={handleAdd} disabled={adding}>
              {adding ? "Agregando..." : "Agregar a biblioteca"}
            </Button>
          )}
          {error && <span className="text-xs" style={{ color: "var(--danger)" }}>{error}</span>}
        </div>
      </div>
    </div>
  );
}
