import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Prisma (hoisted) ────────────────────────────
const mockPrisma = vi.hoisted(() => ({
  book: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  userBook: {
    create: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(function (this: any) {
    this.book = mockPrisma.book;
    this.userBook = mockPrisma.userBook;
  }),
  Prisma: {},
}));

import * as libraryService from "../services/library.service.js";

const USER_ID = "user-123";
const BOOK_ID = "book-456";
const USER_BOOK_ID = "ub-789";

const fakeBook = {
  id: BOOK_ID,
  googleBooksId: "gb-001",
  title: "El Quijote",
  authors: ["Cervantes"],
  categories: [],
};

const fakeUserBook = {
  id: USER_BOOK_ID,
  userId: USER_ID,
  bookId: BOOK_ID,
  status: "QUIERO_LEER",
  isFavorite: false,
  rating: null,
  book: fakeBook,
};

describe("library.service", () => {
  beforeEach(() => vi.clearAllMocks());

  // ── addBook ──────────────────────────────────────
  describe("addBook", () => {
    it("reutiliza un libro existente por googleBooksId", async () => {
      mockPrisma.book.findUnique.mockResolvedValue(fakeBook);
      mockPrisma.userBook.create.mockResolvedValue(fakeUserBook);

      await libraryService.addBook(USER_ID, {
        googleBooksId: "gb-001",
        title: "El Quijote",
        authors: ["Cervantes"],
        categories: [],
      });

      expect(mockPrisma.book.create).not.toHaveBeenCalled();
      expect(mockPrisma.userBook.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: { userId: USER_ID, bookId: BOOK_ID } })
      );
    });

    it("crea un libro nuevo cuando no existe en BD", async () => {
      mockPrisma.book.findUnique.mockResolvedValue(null);
      mockPrisma.book.create.mockResolvedValue(fakeBook);
      mockPrisma.userBook.create.mockResolvedValue(fakeUserBook);

      await libraryService.addBook(USER_ID, {
        googleBooksId: "nuevo-id",
        title: "Libro Nuevo",
        authors: ["Autor"],
        categories: [],
      });

      expect(mockPrisma.book.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ title: "Libro Nuevo" }) })
      );
    });

    it("busca por openLibraryId cuando no hay googleBooksId", async () => {
      mockPrisma.book.findUnique.mockResolvedValue(fakeBook);
      mockPrisma.userBook.create.mockResolvedValue(fakeUserBook);

      await libraryService.addBook(USER_ID, {
        openLibraryId: "/works/OL123",
        title: "Otro Libro",
        authors: [],
        categories: [],
      });

      expect(mockPrisma.book.findUnique).toHaveBeenCalledWith({
        where: { openLibraryId: "/works/OL123" },
      });
    });
  });

  // ── getLibrary ───────────────────────────────────
  describe("getLibrary", () => {
    it("filtra por userId sin filtros adicionales", async () => {
      mockPrisma.userBook.findMany.mockResolvedValue([fakeUserBook]);

      await libraryService.getLibrary(USER_ID, { sortBy: "recent" });

      const call = mockPrisma.userBook.findMany.mock.calls[0][0];
      expect(call.where).toEqual({ userId: USER_ID });
    });

    it("agrega filtro de status cuando se provee", async () => {
      mockPrisma.userBook.findMany.mockResolvedValue([]);

      await libraryService.getLibrary(USER_ID, { status: "LEYENDO", sortBy: "recent" });

      const call = mockPrisma.userBook.findMany.mock.calls[0][0];
      expect(call.where.status).toBe("LEYENDO");
    });

    it("ordena por título cuando sortBy='title'", async () => {
      mockPrisma.userBook.findMany.mockResolvedValue([]);

      await libraryService.getLibrary(USER_ID, { sortBy: "title" });

      const call = mockPrisma.userBook.findMany.mock.calls[0][0];
      expect(call.orderBy).toEqual({ book: { title: "asc" } });
    });

    it("ordena por rating descendente cuando sortBy='rating'", async () => {
      mockPrisma.userBook.findMany.mockResolvedValue([]);

      await libraryService.getLibrary(USER_ID, { sortBy: "rating" });

      const call = mockPrisma.userBook.findMany.mock.calls[0][0];
      expect(call.orderBy).toEqual({ rating: { sort: "desc", nulls: "last" } });
    });
  });

  // ── getUserBook ──────────────────────────────────
  describe("getUserBook", () => {
    it("busca con userId y userBookId", async () => {
      mockPrisma.userBook.findFirst.mockResolvedValue(fakeUserBook);

      const result = await libraryService.getUserBook(USER_ID, USER_BOOK_ID);

      expect(mockPrisma.userBook.findFirst).toHaveBeenCalledWith({
        where: { id: USER_BOOK_ID, userId: USER_ID },
        include: { book: true },
      });
      expect(result).toEqual(fakeUserBook);
    });

    it("devuelve null si no existe el libro", async () => {
      mockPrisma.userBook.findFirst.mockResolvedValue(null);
      const result = await libraryService.getUserBook(USER_ID, "no-existe");
      expect(result).toBeNull();
    });
  });

  // ── updateUserBook ───────────────────────────────
  describe("updateUserBook", () => {
    it("devuelve null cuando el userBook no pertenece al usuario", async () => {
      mockPrisma.userBook.findFirst.mockResolvedValue(null);

      const result = await libraryService.updateUserBook(USER_ID, USER_BOOK_ID, {
        status: "LEIDO",
      });

      expect(result).toBeNull();
      expect(mockPrisma.userBook.update).not.toHaveBeenCalled();
    });

    it("actualiza el registro cuando el usuario es propietario", async () => {
      const existingBook = { id: USER_BOOK_ID, userId: USER_ID };
      mockPrisma.userBook.findFirst.mockResolvedValue(existingBook);
      mockPrisma.userBook.update.mockResolvedValue({ ...fakeUserBook, status: "LEIDO" });

      const result = await libraryService.updateUserBook(USER_ID, USER_BOOK_ID, {
        status: "LEIDO",
      });

      expect(mockPrisma.userBook.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: USER_BOOK_ID },
          data: expect.objectContaining({ status: "LEIDO" }),
        })
      );
      expect(result?.status).toBe("LEIDO");
    });
  });

  // ── removeBook ───────────────────────────────────
  describe("removeBook", () => {
    it("devuelve false cuando el libro no existe o no es del usuario", async () => {
      mockPrisma.userBook.findFirst.mockResolvedValue(null);

      const result = await libraryService.removeBook(USER_ID, USER_BOOK_ID);

      expect(result).toBe(false);
      expect(mockPrisma.userBook.delete).not.toHaveBeenCalled();
    });

    it("elimina el libro y devuelve true cuando existe", async () => {
      mockPrisma.userBook.findFirst.mockResolvedValue({ id: USER_BOOK_ID, userId: USER_ID });
      mockPrisma.userBook.delete.mockResolvedValue(undefined);

      const result = await libraryService.removeBook(USER_ID, USER_BOOK_ID);

      expect(mockPrisma.userBook.delete).toHaveBeenCalledWith({
        where: { id: USER_BOOK_ID },
      });
      expect(result).toBe(true);
    });
  });
});
