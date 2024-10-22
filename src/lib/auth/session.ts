import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "~/server/db";
import {
  type InsertSession,
  type SelectSession,
  type SelectUser,
} from "~/server/db/schema";
import { SessionsTable, UsersTable } from "~/server/db/schema";
import { sha256 } from "@oslojs/crypto/sha2";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: string,
): Promise<SelectSession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: InsertSession = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await db.insert(SessionsTable).values(session);
  return session;
}

export async function validateSession(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({
      user: {
        id: UsersTable.id,
        email: UsersTable.email,
        isEmailVerified: UsersTable.isEmailVerified,
        createdAt: UsersTable.createdAt,
        updatedAt: UsersTable.updatedAt,
      },
      session: SessionsTable,
    })
    .from(SessionsTable)
    .innerJoin(UsersTable, eq(SessionsTable.userId, UsersTable.id))
    .where(eq(SessionsTable.id, sessionId));
  if (!result[0]) {
    return { session: null, user: null };
  }

  const { session } = result[0];
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(SessionsTable).where(eq(SessionsTable.id, sessionId));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() + 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(SessionsTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(SessionsTable.id, sessionId));
  }

  return {
    session,
    user: {
      updatedAt: result[0].user.updatedAt,
      createdAt: result[0].user.createdAt,
      email: result[0].user.email,
      id: result[0].user.id,
      isEmailVerified: result[0].user.isEmailVerified,
    },
  };
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({ user: UsersTable, session: SessionsTable })
    .from(SessionsTable)
    .innerJoin(UsersTable, eq(SessionsTable.userId, UsersTable.id))
    .where(eq(SessionsTable.id, sessionId));
  if (result[0] === undefined) {
    return { session: null, user: null };
  }
  const { user, session } = result[0];
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(SessionsTable).where(eq(SessionsTable.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(SessionsTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(SessionsTable.id, session.id));
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(SessionsTable).where(eq(SessionsTable.id, sessionId));
}

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const { get } = await cookies();
    const token = get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
  },
);

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const { set } = await cookies();
  set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const { set } = await cookies();
  set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export type SessionValidationResult =
  | {
      session: SelectSession;
      user: Omit<SelectUser, "hashedPassword">;
    }
  | { session: null; user: null };
