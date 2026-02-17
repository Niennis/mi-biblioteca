import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// ── Mock books API ───────────────────────────────────
const mockSearchBooks = vi.hoisted(() => vi.fn());

vi.mock("../services/books.api", () => ({
  searchBooks: mockSearchBooks,
}));

import { useBookSearch } from "../hooks/useBookSearch";

const fakeResult = {
  books: [{ title: "El Quijote", authors: ["Cervantes"], isSpanish: true, categories: [] }],
  totalItems: 1,
};

// Helper: advance fake timer + flush all promises
async function advanceAndFlush(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
  // Flush microtasks (awaited promises from async functions)
  await act(async () => {});
}

describe("useBookSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSearchBooks.mockResolvedValue(fakeResult);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("inicia con estado vacío y sin carga", () => {
    const { result } = renderHook(() => useBookSearch());
    expect(result.current.query).toBe("");
    expect(result.current.books).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.totalItems).toBe(0);
  });

  it("no busca si la query está vacía o solo espacios", async () => {
    const { result } = renderHook(() => useBookSearch());
    await act(async () => { result.current.setQuery("   "); });
    await advanceAndFlush(500);
    expect(mockSearchBooks).not.toHaveBeenCalled();
  });

  it("no busca antes del debounce de 400ms", async () => {
    const { result } = renderHook(() => useBookSearch());
    await act(async () => { result.current.setQuery("quijote"); });
    await act(async () => { vi.advanceTimersByTime(300); });
    expect(mockSearchBooks).not.toHaveBeenCalled();
  });

  it("ejecuta la búsqueda después del debounce de 400ms", async () => {
    const { result } = renderHook(() => useBookSearch());
    await act(async () => { result.current.setQuery("quijote"); });
    await advanceAndFlush(400);
    expect(mockSearchBooks).toHaveBeenCalledWith("quijote", 1);
  });

  it("establece los libros y totalItems después de una búsqueda exitosa", async () => {
    const { result } = renderHook(() => useBookSearch());
    await act(async () => { result.current.setQuery("quijote"); });
    await advanceAndFlush(400);

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0]?.title).toBe("El Quijote");
    expect(result.current.totalItems).toBe(1);
    expect(result.current.loading).toBe(false);
  });

  it("establece error cuando la búsqueda falla", async () => {
    mockSearchBooks.mockRejectedValue(new Error("Error de red"));
    const { result } = renderHook(() => useBookSearch());
    await act(async () => { result.current.setQuery("error"); });
    await advanceAndFlush(400);

    expect(result.current.error).toBe("Error de red");
    expect(result.current.books).toEqual([]);
  });

  it("nextPage incrementa la página y busca la siguiente", async () => {
    const { result } = renderHook(() => useBookSearch());

    // Primera búsqueda
    await act(async () => { result.current.setQuery("libros"); });
    await advanceAndFlush(400);
    expect(result.current.books).toHaveLength(1);

    // Siguiente página
    await act(async () => { result.current.nextPage(); });
    await act(async () => {}); // flush async

    expect(mockSearchBooks).toHaveBeenCalledWith("libros", 2);
    expect(result.current.page).toBe(2);
  });

  it("limpia los libros cuando la query se vacía", async () => {
    const { result } = renderHook(() => useBookSearch());

    // Primero busca algo
    await act(async () => { result.current.setQuery("quijote"); });
    await advanceAndFlush(400);
    expect(result.current.books).toHaveLength(1);

    // Luego vacía la query
    await act(async () => { result.current.setQuery(""); });

    expect(result.current.books).toEqual([]);
    expect(result.current.totalItems).toBe(0);
  });
});
