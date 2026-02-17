import { SearchBook } from "../../types/book";
import { BookCard } from "./BookCard";
import { Spinner } from "../ui/Spinner";

interface Props {
  books: SearchBook[];
  loading: boolean;
  error: string | null;
  query: string;
}

export function SearchResults({ books, loading, error, query }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return <p className="py-8 text-center font-medium" style={{ color: "var(--danger)" }}>{error}</p>;
  }

  if (query && books.length === 0) {
    return <p className="py-8 text-center" style={{ color: "var(--text-muted)" }}>No se encontraron resultados para &quot;{query}&quot;</p>;
  }

  if (!query) {
    return <p className="py-8 text-center" style={{ color: "var(--text-faint)" }}>Escribe algo para buscar libros</p>;
  }

  return (
    <div className="space-y-4">
      {books.map((book, i) => (
        <BookCard key={book.googleBooksId ?? book.openLibraryId ?? i} book={book} />
      ))}
    </div>
  );
}
