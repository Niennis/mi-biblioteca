import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function syncProfile(userId: string, email: string) {
  return prisma.profile.upsert({
    where: { id: userId },
    update: { email },
    create: { id: userId, email },
  });
}

export async function getProfile(userId: string) {
  return prisma.profile.findUnique({ where: { id: userId } });
}

export async function updateProfile(
  userId: string,
  data: { name?: string; avatarUrl?: string | null }
) {
  return prisma.profile.update({ where: { id: userId }, data });
}
