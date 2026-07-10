import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import {
  CART_COOKIE,
  CART_COOKIE_MAX_AGE,
  getCartSummary,
  getOrCreateCartId,
} from "@/lib/cart-server";

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const pickupTime =
    typeof body?.pickupTime === "string" ? body.pickupTime.trim() : null;

  if (!pickupTime || Number.isNaN(new Date(pickupTime).getTime())) {
    return NextResponse.json(
      { error: "pickupTime wajib diisi dengan tanggal/waktu yang valid" },
      { status: 400 }
    );
  }

  const { cartId } = await getOrCreateCartId();

  await db.update(orders).set({ pickupTime }).where(eq(orders.id, cartId));

  const cart = await getCartSummary(cartId);

  const response = NextResponse.json({ cart });
  response.cookies.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
  return response;
}
