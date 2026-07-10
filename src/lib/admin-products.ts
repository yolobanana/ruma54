import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/admin-auth";
import type { AdminUserRow } from "@/db/schema";

/**
 * Guard for admin route handlers. Returns the user, or a ready-to-return 401
 * response when there is no valid session.
 */
export async function requireAdmin(): Promise<
  { user: AdminUserRow; response: null } | { user: null; response: NextResponse }
> {
  const user = await getSessionUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Tidak diautorisasi" }, { status: 401 }),
    };
  }
  return { user, response: null };
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  bakeEtaMinutes: number | null;
}

/** Validate + normalise a product payload. `partial` allows PATCH updates. */
export function parseProductInput(
  body: unknown,
  { partial = false }: { partial?: boolean } = {}
): { data: Partial<ProductInput>; error: null } | { data: null; error: string } {
  if (typeof body !== "object" || body === null) {
    return { data: null, error: "Body tidak valid" };
  }
  const b = body as Record<string, unknown>;
  const data: Partial<ProductInput> = {};

  const requireString = (key: keyof ProductInput): string | null => {
    const v = b[key];
    if (typeof v !== "string" || v.trim() === "") return null;
    return v.trim();
  };

  const has = (key: string) => key in b;

  // Strings
  for (const key of ["name", "description", "imageUrl", "category"] as const) {
    if (!partial || has(key)) {
      const v = requireString(key);
      if (v === null) return { data: null, error: `Field "${key}" wajib diisi` };
      data[key] = v;
    }
  }

  // price
  if (!partial || has("price")) {
    const price = Number(b.price);
    if (!Number.isInteger(price) || price < 0) {
      return { data: null, error: "Harga harus bilangan bulat >= 0" };
    }
    data.price = price;
  }

  // stock
  if (!partial || has("stock")) {
    const stock = Number(b.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      return { data: null, error: "Stok harus bilangan bulat >= 0" };
    }
    data.stock = stock;
  }

  // bakeEtaMinutes (optional/nullable)
  if (!partial || has("bakeEtaMinutes")) {
    const raw = b.bakeEtaMinutes;
    if (raw === null || raw === undefined || raw === "") {
      data.bakeEtaMinutes = null;
    } else {
      const eta = Number(raw);
      if (!Number.isInteger(eta) || eta < 0) {
        return { data: null, error: "Estimasi panggang harus bilangan bulat >= 0" };
      }
      data.bakeEtaMinutes = eta;
    }
  }

  return { data, error: null };
}

/** Slugify a name into an id (kebab-case), matching the seed data style. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
