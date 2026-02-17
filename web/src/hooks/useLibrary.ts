import { useState, useEffect, useCallback } from "react";
import { UserBook, ReadingStatus } from "../types/library";
import * as libraryApi from "../services/library.api";

interface Filters {
  status?: ReadingStatus;
  favorite?: boolean;
  sortBy?: "recent" | "title" | "rating";
}

export function useLibrary() {
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ sortBy: "recent" });

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await libraryApi.getLibrary(filters);
      setBooks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, error, filters, setFilters, refetch: fetchBooks };
}
