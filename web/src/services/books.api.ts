import { api } from "./api";
import { SearchResult } from "../types/book";

export function searchBooks(query: string, page: number = 1) {
  return api<SearchResult>(
    `/books/search?q=${encodeURIComponent(query)}&page=${page}`
  );
}
