import { and, eq, like, or, type SQL } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/db";
import { products } from "@/db/schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";

  const conditions: SQL[] = [eq(products.archived, false)];

  if (category && category !== "Semua") {
    conditions.push(eq(products.category, category));
  }

  if (q) {
    const pattern = `%${q}%`;
    const search = or(
      like(products.name, pattern),
      like(products.category, pattern)
    );
    if (search) conditions.push(search);
  }

  const rows = await db
    .select()
    .from(products)
    .where(and(...conditions));

  return NextResponse.json({ products: rows });
}
