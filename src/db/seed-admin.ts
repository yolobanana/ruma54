import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { hashPassword } from "@/lib/password";

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";

  const [existing] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username));

  if (existing) {
    console.log(`Admin "${username}" sudah ada, dilewati.`);
    return;
  }

  await db.insert(adminUsers).values({
    id: randomUUID(),
    username,
    passwordHash: await hashPassword(password),
    createdAt: new Date(),
  });

  console.log(`Admin "${username}" dibuat.`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log('Password default: "admin123" (set ADMIN_PASSWORD untuk mengganti).');
  }
}

seedAdmin();
