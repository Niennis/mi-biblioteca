export interface NormalizedBook {
  googleBooksId?: string;
  openLibraryId?: string;
  title: string;
  authors: string[];
  description?: string;
  coverUrl?: string;
  publishedDate?: string;
  pageCount?: number;
  language?: string;
  isbn10?: string;
  isbn13?: string;
  categories: string[];
  isSpanish: boolean;
}

export interface SearchResult {
  books: NormalizedBook[];
  totalItems: number;
}
