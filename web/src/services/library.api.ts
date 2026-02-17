import { api } from "./api";
import { UserBook, ReadingStatus } from "../types/library";
import { SearchBook } from "../types/book";

interface LibraryFilters {
  status?: ReadingStatus;
  favorite?: boolean;
  sortBy?: "recent" | "title" | "rating";
}

export function getLibrary(filters: LibraryFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.favorite) params.set("favorite", "true");
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  const qs = params.toString();
  return api<UserBook[]>(`/library${qs ? `?${qs}` : ""}`);
}

export function getLibraryBook(id: string) {
  return api<UserBook>(`/library/${id}`);
}

export function addToLibrary(book: SearchBook) {
  return api<UserBook>("/library", {
    method: "POST",
    body: JSON.stringify(book),
  });
}

export function updateLibraryBook(
  id: string,
  data: {
    status?: ReadingStatus;
    isFavorite?: boolean;
    rating?: number | null;
    comment?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    personalImages?: string[];
  }
) {
  return api<UserBook>(`/library/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function removeFromLibrary(id: string) {
  return api(`/library/${id}`, { method: "DELETE" });
}
