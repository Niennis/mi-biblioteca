import { describe, it, expect } from "vitest";
import { formatDate, formatDateShort } from "../utils/date";

describe("formatDate", () => {
  it("formatea en español con mes completo", () => {
    const result = formatDate("2026-02-17T00:00:00.000Z");
    expect(result).toMatch(/febrero/i);
    expect(result).toMatch(/2026/);
  });

  it("incluye el día y el año", () => {
    const result = formatDate("2024-12-25T12:00:00.000Z");
    expect(result).toMatch(/25/);
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/diciembre/i);
  });

  it("no usa formato inglés", () => {
    const result = formatDate("2024-01-15T00:00:00.000Z");
    expect(result).not.toMatch(/January/i);
    expect(result).toMatch(/enero/i);
  });
});

describe("formatDateShort", () => {
  it("formatea en español con mes abreviado", () => {
    const result = formatDateShort("2025-06-10T12:00:00.000Z");
    expect(result).toMatch(/jun/i);
    expect(result).toMatch(/2025/);
    expect(result).toMatch(/10/);
  });

  it("el mes abreviado es diferente al formato completo", () => {
    const full = formatDate("2025-03-01T12:00:00.000Z");
    const short = formatDateShort("2025-03-01T12:00:00.000Z");
    expect(short.length).toBeLessThan(full.length);
  });
});
