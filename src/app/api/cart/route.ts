import { NextResponse } from "next/server";

import { getCartId, getCartSummary } from "@/lib/cart-server";

export async function GET() {
  const cartId = await getCartId();

  if (!cartId) {
    return NextResponse.json({
      cart: {
        id: null,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        status: null,
        pickupTime: null,
      },
    });
  }

  const cart = await getCartSummary(cartId);
  return NextResponse.json({ cart });
}
