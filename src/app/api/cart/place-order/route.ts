import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { CART_COOKIE, getCartId, getCartSummary } from "@/lib/cart-server";

class InsufficientStockError extends Error {
  constructor(public productName: string) {
    super(`Insufficient stock: ${productName}`);
  }
}

export async function POST(request: Request) {
  const cartId = await getCartId();
  if (!cartId) {
    return NextResponse.json(
      { error: "Keranjang tidak ditemukan" },
      { status: 404 }
    );
  }

  const body = await request.json().catch(() => null);
  const customerName =
    typeof body?.customerName === "string" ? body.customerName.trim() : "";
  const customerPhone =
    typeof body?.customerPhone === "string" ? body.customerPhone.trim() : "";
  const pickupTime =
    typeof body?.pickupTime === "string" ? body.pickupTime.trim() : null;
  const paymentMethod =
    typeof body?.paymentMethod === "string" ? body.paymentMethod : null;

  if (!customerName || !customerPhone) {
    return NextResponse.json(
      { error: "Nama dan nomor WhatsApp wajib diisi" },
      { status: 400 }
    );
  }
  if (!paymentMethod) {
    return NextResponse.json(
      { error: "Metode pembayaran wajib dipilih" },
      { status: 400 }
    );
  }

  const cart = await getCartSummary(cartId);
  if (cart.items.length === 0) {
    return NextResponse.json(
      { error: "Keranjang masih kosong" },
      { status: 400 }
    );
  }

  try {
    db.transaction((tx) => {
      for (const item of cart.items) {
        const product = tx
          .select({ stock: products.stock })
          .from(products)
          .where(eq(products.id, item.product.id))
          .get();
        if (!product || product.stock < item.quantity) {
          throw new InsufficientStockError(item.product.name);
        }
      }

      for (const item of cart.items) {
        tx.update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(eq(products.id, item.product.id))
          .run();
      }

      tx.update(orders)
        .set({
          customerName,
          customerPhone,
          pickupTime,
          paymentMethod,
          status: "baru",
          paymentStatus: "dibayar",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, cartId))
        .run();
    });
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return NextResponse.json(
        { error: `Stok "${err.productName}" tidak mencukupi` },
        { status: 409 }
      );
    }
    throw err;
  }

  const order = await getCartSummary(cartId);
  const response = NextResponse.json({ order }, { status: 200 });
  // A new "add to cart" after this should start a fresh cart/order.
  response.cookies.delete(CART_COOKIE);
  return response;
}
