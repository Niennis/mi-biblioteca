import { describe, it, expect, vi, beforeEach } from "vitest";
import { ZodError, z } from "zod";
import { errorHandler } from "../middleware/errorHandler.js";
import type { Request, Response, NextFunction } from "express";

function mockRes(): Partial<Response> {
  return {
    status: vi.fn().mockReturnThis() as any,
    json: vi.fn().mockReturnThis() as any,
  };
}

describe("errorHandler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = mockRes();
    next = vi.fn();
  });

  it("devuelve 400 para ZodError con detalles de validación", () => {
    const zodError = z.object({ name: z.string().min(1) }).safeParse({}).error!;
    errorHandler(zodError, req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Datos inválidos", details: expect.any(Array) })
    );
  });

  it("usa el status del error cuando tiene propiedad status", () => {
    const customError = Object.assign(new Error("No encontrado"), { status: 404 });
    errorHandler(customError, req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "No encontrado" });
  });

  it("devuelve 500 para errores genéricos sin status", () => {
    const genericError = new Error("Algo falló");
    errorHandler(genericError, req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Algo falló" });
  });

  it("incluye el mensaje de error en la respuesta", () => {
    const err = new Error("Error de conexión");
    errorHandler(err, req as Request, res as Response, next);
    const jsonArg = (res.json as any).mock.calls[0][0];
    expect(jsonArg.error).toBe("Error de conexión");
  });
});
