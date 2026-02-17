import { SearchResult } from "../types/book.types.js";
import { searchGoogleBooks } from "./googleBooks.service.js";
import { searchOpenLibrary } from "./openLibrary.service.js";

const MIN_RESULTS = 5;

export async function searchBooks(
  query: string,
  page: number = 1
): Promise<SearchResult> {
  const startIndex = (page - 1) * 20;

  // 1. Search Google Books in Spanish
  try {
    const esResult = await searchGoogleBooks(query, {
      langRestrict: "es",
      startIndex,
    });

    if (esResult.books.length >= MIN_RESULTS) {
      return esResult;
    }

    // 2. Not enough Spanish results — search without lang restriction
    const allResult = await searchGoogleBooks(query, { startIndex });

    if (allResult.books.length > 0) {
      // Mark books by language
      const books = allResult.books.map((b) => ({
        ...b,
        isSpanish: b.language === "es",
      }));
      return { books, totalItems: allResult.totalItems };
    }
  } catch {
    // Google Books failed, try Open Library
  }

  // 3. Fallback to Open Library
  try {
    return await searchOpenLibrary(query, page);
  } catch {
    return { books: [], totalItems: 0 };
  }
}
