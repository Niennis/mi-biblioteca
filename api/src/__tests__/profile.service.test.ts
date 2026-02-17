import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Prisma (hoisted) ────────────────────────────
const mockPrisma = vi.hoisted(() => ({
  profile: {
    upsert: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(function (this: any) {
    this.profile = mockPrisma.profile;
  }),
}));

import * as profileService from "../services/profile.service.js";

const USER_ID = "user-abc-123";
const EMAIL = "test@ejemplo.com";

describe("profile.service", () => {
  beforeEach(() => vi.clearAllMocks());

  // ── syncProfile ──────────────────────────────────
  describe("syncProfile", () => {
    it("llama upsert con los argumentos correctos", async () => {
      const fakeProfile = { id: USER_ID, email: EMAIL };
      mockPrisma.profile.upsert.mockResolvedValue(fakeProfile);

      const result = await profileService.syncProfile(USER_ID, EMAIL);

      expect(mockPrisma.profile.upsert).toHaveBeenCalledWith({
        where: { id: USER_ID },
        update: { email: EMAIL },
        create: { id: USER_ID, email: EMAIL },
      });
      expect(result).toEqual(fakeProfile);
    });
  });

  // ── getProfile ───────────────────────────────────
  describe("getProfile", () => {
    it("llama findUnique con el userId correcto", async () => {
      const fakeProfile = { id: USER_ID, email: EMAIL, name: "Ana" };
      mockPrisma.profile.findUnique.mockResolvedValue(fakeProfile);

      const result = await profileService.getProfile(USER_ID);

      expect(mockPrisma.profile.findUnique).toHaveBeenCalledWith({
        where: { id: USER_ID },
      });
      expect(result).toEqual(fakeProfile);
    });

    it("devuelve null cuando el perfil no existe", async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);
      const result = await profileService.getProfile("no-existe");
      expect(result).toBeNull();
    });
  });

  // ── updateProfile ────────────────────────────────
  describe("updateProfile", () => {
    it("actualiza el nombre correctamente", async () => {
      const updated = { id: USER_ID, email: EMAIL, name: "María" };
      mockPrisma.profile.update.mockResolvedValue(updated);

      const result = await profileService.updateProfile(USER_ID, { name: "María" });

      expect(mockPrisma.profile.update).toHaveBeenCalledWith({
        where: { id: USER_ID },
        data: { name: "María" },
      });
      expect(result.name).toBe("María");
    });

    it("actualiza el avatarUrl correctamente", async () => {
      const url = "https://example.com/avatar.jpg";
      const updated = { id: USER_ID, email: EMAIL, avatarUrl: url };
      mockPrisma.profile.update.mockResolvedValue(updated);

      await profileService.updateProfile(USER_ID, { avatarUrl: url });

      expect(mockPrisma.profile.update).toHaveBeenCalledWith({
        where: { id: USER_ID },
        data: { avatarUrl: url },
      });
    });

    it("permite borrar avatarUrl con null", async () => {
      mockPrisma.profile.update.mockResolvedValue({ id: USER_ID, email: EMAIL, avatarUrl: null });
      await profileService.updateProfile(USER_ID, { avatarUrl: null });
      const callData = mockPrisma.profile.update.mock.calls[0][0].data;
      expect(callData.avatarUrl).toBeNull();
    });
  });
});
