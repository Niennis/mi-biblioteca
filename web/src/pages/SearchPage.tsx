import { useBookSearch } from "../hooks/useBookSearch";
import { SearchBar } from "../components/books/SearchBar";
import { SearchResults } from "../components/books/SearchResults";
import { Button } from "../components/ui/Button";

export function SearchPage() {
  const { query, setQuery, books, loading, error, totalItems, nextPage } = useBookSearch();

  return (
    <div className="space-y-6">
      <h1
        className="text-3xl font-bold"
        style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
      >
        Buscar libros
      </h1>
      <SearchBar value={query} onChange={setQuery} />
      <SearchResults books={books} loading={loading} error={error} query={query} />
      {books.length > 0 && books.length < totalItems && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={nextPage} disabled={loading}>
            Cargar más resultados
          </Button>
        </div>
      )}
    </div>
  );
}
