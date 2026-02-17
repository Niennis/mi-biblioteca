import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().min(1, "Término de búsqueda requerido"),
  page: z.coerce.number().int().positive().default(1),
});

export const addBookSchema = z.object({
  googleBooksId: z.string().optional(),
  openLibraryId: z.string().optional(),
  title: z.string().min(1),
  authors: z.array(z.string()),
  description: z.string().optional(),
  coverUrl: z.string().url().optional(),
  publishedDate: z.string().optional(),
  pageCount: z.number().int().positive().optional(),
  language: z.string().optional(),
  isbn10: z.string().optional(),
  isbn13: z.string().optional(),
  categories: z.array(z.string()).default([]),
});

export const updateUserBookSchema = z.object({
  status: z.enum(["QUIERO_LEER", "LEYENDO", "LEIDO", "ABANDONADO"]).optional(),
  isFavorite: z.boolean().optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  comment: z.string().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  personalImages: z.array(z.string().url()).optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const libraryQuerySchema = z.object({
  status: z.enum(["QUIERO_LEER", "LEYENDO", "LEIDO", "ABANDONADO"]).optional(),
  favorite: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  sortBy: z.enum(["recent", "title", "rating"]).default("recent"),
});
