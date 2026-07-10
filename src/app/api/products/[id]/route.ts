import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { products } from "@/db/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id));

  if (!product) {
    return NextResponse.json({ error: "Roti tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ product });
}
