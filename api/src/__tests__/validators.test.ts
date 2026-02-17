import { describe, it, expect } from "vitest";
import {
  searchQuerySchema,
  addBookSchema,
  updateUserBookSchema,
  updateProfileSchema,
  libraryQuerySchema,
} from "../utils/validators.js";

// ── searchQuerySchema ────────────────────────────────
describe("searchQuerySchema", () => {
  it("acepta una query válida", () => {
    const result = searchQuerySchema.parse({ q: "Harry Potter" });
    expect(result.q).toBe("Harry Potter");
    expect(result.page).toBe(1); // default
  });

  it("falla si q está vacía", () => {
    expect(() => searchQuerySchema.parse({ q: "" })).toThrow();
  });

  it("falla si q no está presente", () => {
    expect(() => searchQuerySchema.parse({})).toThrow();
  });

  it("coerce page de string a número", () => {
    const result = searchQuerySchema.parse({ q: "libro", page: "3" });
    expect(result.page).toBe(3);
  });

  it("falla si page es 0 o negativo", () => {
    expect(() => searchQuerySchema.parse({ q: "libro", page: 0 })).toThrow();
    expect(() => searchQuerySchema.parse({ q: "libro", page: -1 })).toThrow();
  });

  it("falla si page es decimal", () => {
    expect(() => searchQuerySchema.parse({ q: "libro", page: 1.5 })).toThrow();
  });
});

// ── addBookSchema ────────────────────────────────────
describe("addBookSchema", () => {
  it("acepta un libro mínimo válido", () => {
    const result = addBookSchema.parse({ title: "El Quijote", authors: ["Cervantes"] });
    expect(result.title).toBe("El Quijote");
    expect(result.categories).toEqual([]); // default
  });

  it("acepta un libro completo", () => {
    const result = addBookSchema.parse({
      googleBooksId: "abc123",
      title: "Cien años de soledad",
      authors: ["García Márquez"],
      description: "Novela épica",
      coverUrl: "https://example.com/cover.jpg",
      publishedDate: "1967",
      pageCount: 417,
      language: "es",
      isbn10: "0060883286",
      isbn13: "9780060883287",
      categories: ["Ficción", "Literatura"],
    });
    expect(result.pageCount).toBe(417);
    expect(result.categories).toHaveLength(2);
  });

  it("falla si title está vacío", () => {
    expect(() => addBookSchema.parse({ title: "", authors: [] })).toThrow();
  });

  it("falla si coverUrl no es una URL válida", () => {
    expect(() =>
      addBookSchema.parse({ title: "Libro", authors: [], coverUrl: "no-es-url" })
    ).toThrow();
  });

  it("falla si pageCount es negativo", () => {
    expect(() =>
      addBookSchema.parse({ title: "Libro", authors: [], pageCount: -10 })
    ).toThrow();
  });
});

// ── updateUserBookSchema ─────────────────────────────
describe("updateUserBookSchema", () => {
  it("acepta una actualización parcial válida", () => {
    const result = updateUserBookSchema.parse({ status: "LEYENDO", isFavorite: true });
    expect(result.status).toBe("LEYENDO");
    expect(result.isFavorite).toBe(true);
  });

  it("acepta un objeto vacío (todos opcionales)", () => {
    expect(() => updateUserBookSchema.parse({})).not.toThrow();
  });

  it("falla si status no es un valor válido", () => {
    expect(() => updateUserBookSchema.parse({ status: "EN_COLA" })).toThrow();
  });

  it("falla si rating > 5", () => {
    expect(() => updateUserBookSchema.parse({ rating: 6 })).toThrow();
  });

  it("falla si rating < 1", () => {
    expect(() => updateUserBookSchema.parse({ rating: 0 })).toThrow();
  });

  it("permite rating null (eliminar calificación)", () => {
    const result = updateUserBookSchema.parse({ rating: null });
    expect(result.rating).toBeNull();
  });

  it("falla si personalImages contiene URLs inválidas", () => {
    expect(() =>
      updateUserBookSchema.parse({ personalImages: ["no-url"] })
    ).toThrow();
  });
});

// ── updateProfileSchema ──────────────────────────────
describe("updateProfileSchema", () => {
  it("acepta solo nombre", () => {
    const result = updateProfileSchema.parse({ name: "Ana" });
    expect(result.name).toBe("Ana");
  });

  it("acepta solo avatarUrl", () => {
    const result = updateProfileSchema.parse({ avatarUrl: "https://example.com/avatar.jpg" });
    expect(result.avatarUrl).toBe("https://example.com/avatar.jpg");
  });

  it("acepta avatarUrl null (eliminar foto)", () => {
    const result = updateProfileSchema.parse({ avatarUrl: null });
    expect(result.avatarUrl).toBeNull();
  });

  it("falla si avatarUrl no es una URL válida", () => {
    expect(() => updateProfileSchema.parse({ avatarUrl: "not-a-url" })).toThrow();
  });

  it("acepta objeto vacío (todos opcionales)", () => {
    expect(() => updateProfileSchema.parse({})).not.toThrow();
  });
});

// ── libraryQuerySchema ───────────────────────────────
describe("libraryQuerySchema", () => {
  it("aplica sortBy 'recent' por defecto", () => {
    const result = libraryQuerySchema.parse({});
    expect(result.sortBy).toBe("recent");
  });

  it("acepta todos los valores de sortBy", () => {
    expect(libraryQuerySchema.parse({ sortBy: "title" }).sortBy).toBe("title");
    expect(libraryQuerySchema.parse({ sortBy: "rating" }).sortBy).toBe("rating");
    expect(libraryQuerySchema.parse({ sortBy: "recent" }).sortBy).toBe("recent");
  });

  it("transforma favorite 'true' a boolean true", () => {
    const result = libraryQuerySchema.parse({ favorite: "true" });
    expect(result.favorite).toBe(true);
  });

  it("transforma favorite 'false' a boolean false", () => {
    const result = libraryQuerySchema.parse({ favorite: "false" });
    expect(result.favorite).toBe(false);
  });

  it("falla si status no es válido", () => {
    expect(() => libraryQuerySchema.parse({ status: "LEYENDO_LENTO" })).toThrow();
  });
});
