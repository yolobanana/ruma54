import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/db";
import { CART_STATUS, orderItems, orders, products } from "@/db/schema";
import { generateOrderId } from "@/lib/order-id";

export const CART_COOKIE = "rotipilih_cart_id";
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function getOrCreateCartId(): Promise<{
  cartId: string;
  isNew: boolean;
}> {
  const cookieStore = await cookies();
  const existingId = cookieStore.get(CART_COOKIE)?.value;

  if (existingId) {
    const [existing] = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.id, existingId));
    if (existing) {
      return { cartId: existingId, isNew: false };
    }
  }

  const cartId = generateOrderId();
  await db.insert(orders).values({
    id: cartId,
    status: CART_STATUS,
    paymentStatus: "belum_dibayar",
    totalPrice: 0,
  });
  return { cartId, isNew: true };
}

export async function getCartId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE)?.value ?? null;
}

export async function getCartSummary(cartId: string) {
  const rows = await db
    .select({
      itemId: orderItems.id,
      quantity: orderItems.quantity,
      productName: orderItems.productName,
      unitPrice: orderItems.unitPrice,
      product: products,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, cartId));

  const items = rows.map((row) => ({
    id: row.itemId,
    quantity: row.quantity,
    // Snapshot name/price win over the live product row — see orders-contract (issue #5).
    product: { ...row.product, name: row.productName, price: row.unitPrice },
    subtotal: row.unitPrice * row.quantity,
  }));

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);

  const [order] = await db
    .select({
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      pickupTime: orders.pickupTime,
    })
    .from(orders)
    .where(eq(orders.id, cartId));

  return {
    id: cartId,
    items,
    totalItems,
    totalPrice,
    status: order?.status ?? null,
    paymentStatus: order?.paymentStatus ?? null,
    pickupTime: order?.pickupTime ?? null,
  };
}

export async function recalcCartTotal(cartId: string) {
  const { totalPrice } = await getCartSummary(cartId);
  await db.update(orders).set({ totalPrice }).where(eq(orders.id, cartId));
}

export async function findCartItem(cartId: string, productId: string) {
  const [item] = await db
    .select()
    .from(orderItems)
    .where(
      and(eq(orderItems.orderId, cartId), eq(orderItems.productId, productId))
    );
  return item ?? null;
}
