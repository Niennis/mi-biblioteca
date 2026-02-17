import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

// ── Mocks (hoisted before imports) ──────────────────
const mockGetUser = vi.hoisted(() => vi.fn());

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ auth: { getUser: mockGetUser } }),
}));

vi.mock("../config/env.js", () => ({
  env: {
    PORT: 3001,
    DATABASE_URL: "postgresql://test@localhost/test",
    SUPABASE_URL: "https://test.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
    FRONTEND_URL: "http://localhost:5173",
  },
}));

// ── Import AFTER mocks are set up ───────────────────
import { requireAuth } from "../middleware/auth.js";

// ── Helpers ─────────────────────────────────────────
function makeReq(authHeader?: string): Partial<Request> {
  return { headers: authHeader ? { authorization: authHeader } : {} } as any;
}

function makeRes(): Partial<Response> {
  return {
    status: vi.fn().mockReturnThis() as any,
    json: vi.fn().mockReturnThis() as any,
  };
}

describe("requireAuth middleware", () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("devuelve 401 cuando no hay header Authorization", async () => {
    const req = makeReq();
    const res = makeRes();
    await requireAuth(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("devuelve 401 cuando el header no empieza con 'Bearer '", async () => {
    const req = makeReq("Basic dXNlcjpwYXNz");
    const res = makeRes();
    await requireAuth(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("devuelve 401 cuando Supabase devuelve error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error("Invalid JWT") });
    const req = makeReq("Bearer token-invalido");
    const res = makeRes();
    await requireAuth(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("devuelve 401 cuando Supabase no retorna usuario", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    const req = makeReq("Bearer token-sin-usuario");
    const res = makeRes();
    await requireAuth(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("asigna userId y userEmail, y llama next() con token válido", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123", email: "ana@ejemplo.com" } },
      error: null,
    });
    const req = makeReq("Bearer token-valido") as any;
    const res = makeRes();
    await requireAuth(req as Request, res as Response, next);
    expect(req.userId).toBe("user-123");
    expect(req.userEmail).toBe("ana@ejemplo.com");
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
