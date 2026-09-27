import type { AuthUser } from "@mahatha/types";
import { SESSION_DURATION_MS } from "@mahatha/config";
import { AppError } from "../middleware/error-handler";
import * as sessionRepository from "../repositories/session.repository";
import * as userRepository from "../repositories/user.repository";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateSessionToken, hashSessionToken } from "../utils/tokens";
import { TtlCache } from "../utils/ttl-cache";

// Every authenticated request looks up its session, so resolved sessions are
// cached briefly (keyed by token hash) to save a database query per request.
// Logout and password changes evict entries here directly; the short TTL
// bounds staleness if a session is removed any other way.
const SESSION_CACHE_TTL_MS = 60_000;
const sessionCache = new TtlCache<string, { user: AuthUser; expiresAt: Date }>(SESSION_CACHE_TTL_MS);

// A precomputed hash so login takes the same time whether or not the email
// exists, avoiding user-enumeration via response timing.
let dummyHash: string | null = null;
async function getDummyHash(): Promise<string> {
  dummyHash ??= await hashPassword("dummy-password-for-timing-safety");
  return dummyHash;
}

export type LoginResult = {
  user: AuthUser;
  token: string;
  expiresAt: Date;
};

export async function login(email: string, password: string): Promise<LoginResult> {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    await verifyPassword(password, await getDummyHash());
    throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid) {
    throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await sessionRepository.createSession(user.id, hashSessionToken(token), expiresAt);

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
    expiresAt,
  };
}

export async function logout(token: string): Promise<void> {
  const tokenHash = hashSessionToken(token);
  sessionCache.delete(tokenHash);
  await sessionRepository.deleteSessionByTokenHash(tokenHash);
}

export async function getSessionUser(token: string): Promise<AuthUser | null> {
  const tokenHash = hashSessionToken(token);
  const cached = sessionCache.get(tokenHash);
  if (cached && cached.expiresAt >= new Date()) {
    return cached.user;
  }

  const session = await sessionRepository.findSessionByTokenHash(tokenHash);
  if (!session || session.expiresAt < new Date()) {
    sessionCache.delete(tokenHash);
    return null;
  }
  const user = { id: session.user.id, name: session.user.name, email: session.user.email };
  sessionCache.set(tokenHash, { user, expiresAt: session.expiresAt });
  return user;
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
  currentToken: string,
): Promise<void> {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError("User not found.", 404, "NOT_FOUND");
  }

  const currentPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!currentPasswordValid) {
    throw new AppError("Current password is incorrect.", 400, "INVALID_CURRENT_PASSWORD");
  }

  const passwordHash = await hashPassword(newPassword);
  await userRepository.updateUserPassword(userId, passwordHash);
  // Changing your password should not silently keep other devices signed in.
  const currentTokenHash = hashSessionToken(currentToken);
  sessionCache.deleteWhere((entry, tokenHash) => entry.user.id === userId && tokenHash !== currentTokenHash);
  await sessionRepository.deleteOtherSessionsForUser(userId, currentTokenHash);
}
