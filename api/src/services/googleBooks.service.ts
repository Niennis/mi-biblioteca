import { NormalizedBook } from "../types/book.types.js";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    publishedDate?: string;
    pageCount?: number;
    language?: string;
    categories?: string[];
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
  };
}

interface GoogleBooksResponse {
  totalItems: number;
  items?: GoogleBooksVolume[];
}

function normalize(
  volume: GoogleBooksVolume,
  isSpanish: boolean
): NormalizedBook {
  const info = volume.volumeInfo;
  const isbns = info.industryIdentifiers ?? [];
  const isbn10 = isbns.find((i) => i.type === "ISBN_10")?.identifier;
  const isbn13 = isbns.find((i) => i.type === "ISBN_13")?.identifier;
  const coverUrl = info.imageLinks?.thumbnail?.replace("http://", "https://");

  return {
    googleBooksId: volume.id,
    title: info.title,
    authors: info.authors ?? [],
    description: info.description,
    coverUrl,
    publishedDate: info.publishedDate,
    pageCount: info.pageCount,
    language: info.language,
    isbn10,
    isbn13,
    categories: info.categories ?? [],
    isSpanish,
  };
}

export async function searchGoogleBooks(
  query: string,
  options: { langRestrict?: string; startIndex?: number; maxResults?: number } = {}
): Promise<{ books: NormalizedBook[]; totalItems: number }> {
  const { langRestrict, startIndex = 0, maxResults = 20 } = options;

  const params = new URLSearchParams({
    q: query,
    startIndex: String(startIndex),
    maxResults: String(maxResults),
  });

  if (langRestrict) {
    params.set("langRestrict", langRestrict);
  }

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) {
    throw Object.assign(new Error("Error al buscar en Google Books"), {
      status: 502,
    });
  }

  const data: GoogleBooksResponse = await res.json();
  const isSpanish = langRestrict === "es";
  const books = (data.items ?? []).map((v) => normalize(v, isSpanish));

  return { books, totalItems: data.totalItems };
}
