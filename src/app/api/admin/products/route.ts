import { randomBytes } from "node:crypto";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { products } from "@/db/schema";
import {
  parseProductInput,
  requireAdmin,
  slugify,
  type ProductInput,
} from "@/lib/admin-products";

export async function GET() {
  const { user, response } = await requireAdmin();
  if (!user) return response;

  const rows = await db.select().from(products);
  return NextResponse.json({ products: rows });
}

export async function POST(request: Request) {
  const { user, response } = await requireAdmin();
  if (!user) return response;

  const body = await request.json().catch(() => null);
  const parsed = parseProductInput(body);
  if (parsed.data === null) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const data = parsed.data as ProductInput;

  // Derive a unique slug id from the name.
  const base = slugify(data.name) || "roti";
  let id = base;
  for (let attempt = 0; attempt < 5; attempt++) {
    const [clash] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, id));
    if (!clash) break;
    id = `${base}-${randomBytes(2).toString("hex")}`;
  }

  await db.insert(products).values({
    id,
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock,
    imageUrl: data.imageUrl,
    category: data.category,
    bakeEtaMinutes: data.bakeEtaMinutes ?? null,
  });

  return NextResponse.json({ id }, { status: 201 });
}
