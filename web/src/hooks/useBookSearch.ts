import { useState, useCallback, useRef, useEffect } from "react";
import { SearchBook } from "../types/book";
import { searchBooks } from "../services/books.api";

export function useBookSearch() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<SearchBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback(async (q: string, p: number = 1) => {
    if (!q.trim()) {
      setBooks([]);
      setTotalItems(0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await searchBooks(q, p);
      setBooks(result.books);
      setTotalItems(result.totalItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search on query change
  useEffect(() => {
    clearTimeout(timerRef.current);
    if (query.trim()) {
      timerRef.current = setTimeout(() => {
        setPage(1);
        search(query, 1);
      }, 400);
    } else {
      setBooks([]);
      setTotalItems(0);
    }
    return () => clearTimeout(timerRef.current);
  }, [query, search]);

  function nextPage() {
    const next = page + 1;
    setPage(next);
    search(query, next);
  }

  return { query, setQuery, books, loading, error, totalItems, page, nextPage };
}
