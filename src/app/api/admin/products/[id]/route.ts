import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { parseProductInput, requireAdmin } from "@/lib/admin-products";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin();
  if (!user) return response;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = parseProductInput(body, { partial: true });
  if (parsed.data === null) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "Tidak ada perubahan" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, id));
  if (!existing) {
    return NextResponse.json({ error: "Roti tidak ditemukan" }, { status: 404 });
  }

  await db.update(products).set(parsed.data).where(eq(products.id, id));
  return NextResponse.json({ ok: true });
}

/**
 * Soft-delete: archive the product rather than removing the row, so order
 * history and in-progress carts (which reference products by FK) stay intact.
 * Restore via PATCH { archived: false }.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin();
  if (!user) return response;

  const { id } = await params;
  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, id));
  if (!existing) {
    return NextResponse.json({ error: "Roti tidak ditemukan" }, { status: 404 });
  }

  await db.update(products).set({ archived: true }).where(eq(products.id, id));
  return NextResponse.json({ ok: true, archived: true });
}
