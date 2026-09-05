import type { AuthUser } from "@mahatha/types";
import { SESSION_DURATION_MS } from "@mahatha/config";
import { AppError } from "../middleware/error-handler";
import * as sessionRepository from "../repositories/session.repository";
import * as userRepository from "../repositories/user.repository";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateSessionToken, hashSessionToken } from "../utils/tokens";

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
  await sessionRepository.deleteSessionByTokenHash(hashSessionToken(token));
}

export async function getSessionUser(token: string): Promise<AuthUser | null> {
  const session = await sessionRepository.findSessionByTokenHash(hashSessionToken(token));
  if (!session || session.expiresAt < new Date()) {
    return null;
  }
  return { id: session.user.id, name: session.user.name, email: session.user.email };
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
  await sessionRepository.deleteOtherSessionsForUser(userId, hashSessionToken(currentToken));
}
