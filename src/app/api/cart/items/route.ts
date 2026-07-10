import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { orderItems, products } from "@/db/schema";
import {
  CART_COOKIE,
  CART_COOKIE_MAX_AGE,
  findCartItem,
  getCartSummary,
  getOrCreateCartId,
  recalcCartTotal,
} from "@/lib/cart-server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const productId = typeof body?.productId === "string" ? body.productId : null;
  const requestedQuantity =
    Number.isFinite(body?.quantity) && body.quantity > 0
      ? Math.floor(body.quantity)
      : 1;

  if (!productId) {
    return NextResponse.json(
      { error: "productId wajib diisi" },
      { status: 400 }
    );
  }

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId));

  if (!product) {
    return NextResponse.json(
      { error: "Roti tidak ditemukan" },
      { status: 404 }
    );
  }

  const { cartId } = await getOrCreateCartId();
  const existingItem = await findCartItem(cartId, productId);

  const nextQuantity = Math.min(
    (existingItem?.quantity ?? 0) + requestedQuantity,
    product.stock
  );

  if (nextQuantity <= 0) {
    return NextResponse.json(
      { error: "Stok roti ini sedang habis" },
      { status: 409 }
    );
  }

  if (existingItem) {
    await db
      .update(orderItems)
      .set({ quantity: nextQuantity })
      .where(eq(orderItems.id, existingItem.id));
  } else {
    await db.insert(orderItems).values({
      id: randomUUID(),
      orderId: cartId,
      productId,
      // Snapshot at the moment the item enters the order — see orders-contract (issue #5).
      productName: product.name,
      unitPrice: product.price,
      quantity: nextQuantity,
    });
  }

  await recalcCartTotal(cartId);
  const cart = await getCartSummary(cartId);

  const response = NextResponse.json({ cart }, { status: 201 });
  response.cookies.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
  return response;
}
