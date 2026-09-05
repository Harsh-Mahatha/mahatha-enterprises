import { prisma } from "../config/prisma";

export function createSession(userId: string, tokenHash: string, expiresAt: Date) {
  return prisma.session.create({ data: { userId, tokenHash, expiresAt } });
}

export function findSessionByTokenHash(tokenHash: string) {
  return prisma.session.findUnique({ where: { tokenHash }, include: { user: true } });
}

export function deleteSessionByTokenHash(tokenHash: string) {
  return prisma.session.deleteMany({ where: { tokenHash } });
}

export function deleteOtherSessionsForUser(userId: string, exceptTokenHash: string) {
  return prisma.session.deleteMany({ where: { userId, NOT: { tokenHash: exceptTokenHash } } });
}
