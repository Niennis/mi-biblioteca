import { NormalizedBook } from "../types/book.types.js";

const BASE_URL = "https://openlibrary.org/search.json";

interface OLDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  language?: string[];
  subject?: string[];
  isbn?: string[];
  cover_i?: number;
}

interface OLResponse {
  numFound: number;
  docs: OLDoc[];
}

function normalize(doc: OLDoc): NormalizedBook {
  const coverUrl = doc.cover_i
    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
    : undefined;

  const isbns = doc.isbn ?? [];
  const isbn13 = isbns.find((i) => i.length === 13);
  const isbn10 = isbns.find((i) => i.length === 10);

  return {
    openLibraryId: doc.key,
    title: doc.title,
    authors: doc.author_name ?? [],
    coverUrl,
    publishedDate: doc.first_publish_year?.toString(),
    pageCount: doc.number_of_pages_median,
    language: doc.language?.[0],
    isbn10,
    isbn13,
    categories: doc.subject?.slice(0, 5) ?? [],
    isSpanish: false,
  };
}

export async function searchOpenLibrary(
  query: string,
  page: number = 1
): Promise<{ books: NormalizedBook[]; totalItems: number }> {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: "20",
    fields:
      "key,title,author_name,first_publish_year,number_of_pages_median,language,subject,isbn,cover_i",
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) {
    throw Object.assign(new Error("Error al buscar en Open Library"), {
      status: 502,
    });
  }

  const data: OLResponse = await res.json();
  const books = data.docs.map(normalize);

  return { books, totalItems: data.numFound };
}
