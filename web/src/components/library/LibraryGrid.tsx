import { UserBook } from "../../types/library";
import { LibraryBookCard } from "./LibraryBookCard";

interface Props {
  books: UserBook[];
}

export function LibraryGrid({ books }: Props) {
  if (books.length === 0) {
    return (
      <div className="py-16 text-center space-y-2">
        <p className="text-4xl">📚</p>
        <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>Tu biblioteca está vacía</p>
        <p className="text-sm" style={{ color: "var(--text-faint)" }}>Busca libros y agrégalos a tu colección</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {books.map((ub) => (
        <LibraryBookCard key={ub.id} userBook={ub} />
      ))}
    </div>
  );
}
