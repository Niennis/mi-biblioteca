import { describe, it, expect, vi, beforeEach } from "vitest";
import { ok, created, noContent } from "../utils/apiResponse.js";
import type { Response } from "express";

function mockRes(): Partial<Response> {
  const res: Partial<Response> = {
    json: vi.fn().mockReturnThis() as any,
    status: vi.fn().mockReturnThis() as any,
    end: vi.fn() as any,
  };
  return res;
}

describe("apiResponse", () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = mockRes();
  });

  describe("ok", () => {
    it("responde con {data} en el body", () => {
      const data = { id: "1", name: "Libro" };
      ok(res as Response, data);
      expect(res.json).toHaveBeenCalledWith({ data });
    });

    it("funciona con arrays", () => {
      ok(res as Response, [1, 2, 3]);
      expect(res.json).toHaveBeenCalledWith({ data: [1, 2, 3] });
    });
  });

  describe("created", () => {
    it("establece status 201 y responde con {data}", () => {
      const data = { id: "new-id" };
      created(res as Response, data);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data });
    });
  });

  describe("noContent", () => {
    it("establece status 204 y llama end()", () => {
      noContent(res as Response);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });
  });
});
