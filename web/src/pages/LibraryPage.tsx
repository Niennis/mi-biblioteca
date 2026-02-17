import { useLibrary } from "../hooks/useLibrary";
import { FilterBar } from "../components/library/FilterBar";
import { LibraryGrid } from "../components/library/LibraryGrid";
import { Spinner } from "../components/ui/Spinner";

export function LibraryPage() {
  const { books, loading, error, filters, setFilters } = useLibrary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
        >
          Mi Biblioteca
        </h1>
        <span
          className="rounded-full px-3 py-1 text-sm font-semibold"
          style={{ background: "var(--primary-light)", color: "var(--primary)" }}
        >
          {books.length} libros
        </span>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <p className="py-8 text-center font-medium" style={{ color: "var(--danger)" }}>{error}</p>
      ) : (
        <LibraryGrid books={books} />
      )}
    </div>
  );
}
