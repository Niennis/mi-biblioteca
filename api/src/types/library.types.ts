import { ReadingStatus } from "@prisma/client";

export interface AddBookInput {
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

export interface UpdateUserBookInput {
  status?: ReadingStatus;
  isFavorite?: boolean;
  rating?: number | null;
  comment?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  personalImages?: string[];
}

export interface LibraryFilters {
  status?: ReadingStatus;
  favorite?: boolean;
  sortBy?: "recent" | "title" | "rating";
}
