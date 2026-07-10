import { and, eq, like, or } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/db";
import { products } from "@/db/schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";

  const conditions = [];

  if (category && category !== "Semua") {
    conditions.push(eq(products.category, category));
  }

  if (q) {
    const pattern = `%${q}%`;
    conditions.push(
      or(like(products.name, pattern), like(products.category, pattern))
    );
  }

  const rows = await db
    .select()
    .from(products)
    .where(conditions.length ? and(...conditions) : undefined);

  return NextResponse.json({ products: rows });
}
