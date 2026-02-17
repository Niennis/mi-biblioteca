import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

// ── Mock library API ─────────────────────────────────
const mockGetLibrary = vi.hoisted(() => vi.fn());

vi.mock("../services/library.api", () => ({
  getLibrary: mockGetLibrary,
  getLibraryBook: vi.fn(),
  addToLibrary: vi.fn(),
  updateLibraryBook: vi.fn(),
  removeFromLibrary: vi.fn(),
}));

import { useLibrary } from "../hooks/useLibrary";

const fakeBooks = [
  {
    id: "ub-1",
    userId: "user-1",
    bookId: "b-1",
    status: "LEYENDO",
    isFavorite: false,
    rating: null,
    personalImages: [],
    book: { id: "b-1", title: "El Quijote", authors: ["Cervantes"], categories: [] },
  },
];

describe("useLibrary", () => {
  beforeEach(() => {
    mockGetLibrary.mockResolvedValue(fakeBooks);
    vi.clearAllMocks();
  });

  it("carga los libros al montar", async () => {
    const { result } = renderHook(() => useLibrary());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.books).toEqual(fakeBooks);
    });
  });

  it("establece error cuando la API falla", async () => {
    mockGetLibrary.mockRejectedValue(new Error("Error del servidor"));
    const { result } = renderHook(() => useLibrary());

    await waitFor(() => {
      expect(result.current.error).toBe("Error del servidor");
      expect(result.current.books).toEqual([]);
    });
  });

  it("inicia con filtros por defecto (sortBy: recent)", () => {
    const { result } = renderHook(() => useLibrary());
    expect(result.current.filters).toEqual({ sortBy: "recent" });
  });

  it("pasa los filtros a la API", async () => {
    const { result } = renderHook(() => useLibrary());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockGetLibrary).toHaveBeenCalledWith({ sortBy: "recent" });
  });
});
