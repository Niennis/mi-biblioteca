export type ReadingStatus = "QUIERO_LEER" | "LEYENDO" | "LEIDO" | "ABANDONADO";

export interface Book {
  id: string;
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
}

export interface UserBook {
  id: string;
  userId: string;
  bookId: string;
  status: ReadingStatus;
  isFavorite: boolean;
  rating?: number | null;
  comment?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  personalImages: string[];
  createdAt: string;
  updatedAt: string;
  book: Book;
}

export const STATUS_LABELS: Record<ReadingStatus, string> = {
  QUIERO_LEER: "Quiero leer",
  LEYENDO: "Leyendo",
  LEIDO: "Leído",
  ABANDONADO: "Abandonado",
};
