import { randomUUID } from "node:crypto";

import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/db";
import { adminSessions, adminUsers, type AdminUserRow } from "@/db/schema";

export { hashPassword, verifyPassword } from "@/lib/password";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 hari

/** Create a session row for the user and set the httpOnly cookie. */
export async function createSession(adminUserId: string): Promise<void> {
  const token = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

  await db.insert(adminSessions).values({
    token,
    adminUserId,
    expiresAt,
    createdAt: now,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/** Resolve the current admin user from the session cookie, or null. */
export async function getSessionUser(): Promise<AdminUserRow | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [row] = await db
    .select({ user: adminUsers })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.adminUserId, adminUsers.id))
    .where(
      and(
        eq(adminSessions.token, token),
        gt(adminSessions.expiresAt, new Date())
      )
    );

  return row?.user ?? null;
}

/** Delete the current session row and clear the cookie. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }
  store.delete(SESSION_COOKIE);
}
