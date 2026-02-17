import { PrismaClient, Prisma } from "@prisma/client";
import { AddBookInput, UpdateUserBookInput, LibraryFilters } from "../types/library.types.js";

const prisma = new PrismaClient();

export async function addBook(userId: string, input: AddBookInput) {
  // Find or create the book
  let book = input.googleBooksId
    ? await prisma.book.findUnique({ where: { googleBooksId: input.googleBooksId } })
    : input.openLibraryId
      ? await prisma.book.findUnique({ where: { openLibraryId: input.openLibraryId } })
      : null;

  if (!book) {
    book = await prisma.book.create({
      data: {
        googleBooksId: input.googleBooksId,
        openLibraryId: input.openLibraryId,
        title: input.title,
        authors: input.authors,
        description: input.description,
        coverUrl: input.coverUrl,
        publishedDate: input.publishedDate,
        pageCount: input.pageCount,
        language: input.language,
        isbn10: input.isbn10,
        isbn13: input.isbn13,
        categories: input.categories,
      },
    });
  }

  // Create the user-book relationship
  const userBook = await prisma.userBook.create({
    data: { userId, bookId: book.id },
    include: { book: true },
  });

  return userBook;
}

export async function getLibrary(userId: string, filters: LibraryFilters) {
  const where: Prisma.UserBookWhereInput = { userId };

  if (filters.status) where.status = filters.status;
  if (filters.favorite) where.isFavorite = true;

  const orderBy: Prisma.UserBookOrderByWithRelationInput =
    filters.sortBy === "title"
      ? { book: { title: "asc" } }
      : filters.sortBy === "rating"
        ? { rating: { sort: "desc", nulls: "last" } }
        : { createdAt: "desc" };

  return prisma.userBook.findMany({
    where,
    orderBy,
    include: { book: true },
  });
}

export async function getUserBook(userId: string, userBookId: string) {
  return prisma.userBook.findFirst({
    where: { id: userBookId, userId },
    include: { book: true },
  });
}

export async function updateUserBook(
  userId: string,
  userBookId: string,
  data: UpdateUserBookInput
) {
  // Ensure the user owns this entry
  const existing = await prisma.userBook.findFirst({
    where: { id: userBookId, userId },
  });

  if (!existing) return null;

  return prisma.userBook.update({
    where: { id: userBookId },
    data: {
      status: data.status,
      isFavorite: data.isFavorite,
      rating: data.rating,
      comment: data.comment,
      startDate: data.startDate ? new Date(data.startDate) : data.startDate === null ? null : undefined,
      endDate: data.endDate ? new Date(data.endDate) : data.endDate === null ? null : undefined,
      personalImages: data.personalImages,
    },
    include: { book: true },
  });
}

export async function removeBook(userId: string, userBookId: string) {
  const existing = await prisma.userBook.findFirst({
    where: { id: userBookId, userId },
  });

  if (!existing) return false;

  await prisma.userBook.delete({ where: { id: userBookId } });
  return true;
}
