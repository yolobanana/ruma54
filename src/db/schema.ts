import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  bakeEtaMinutes: integer("bake_eta_minutes"),
});

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;

/**
 * Fulfilment lifecycle only — shared with the admin side (see the
 * orders-contract coordination in issue #5). A cart is an `orders` row that
 * hasn't been placed yet, so it sits outside this vocabulary in CART_STATUS
 * until checkout completes and it's promoted to "baru".
 */
export const ORDER_STATUSES = [
  "baru",
  "diproses",
  "siap",
  "selesai",
  "dibatalkan",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Sentinel status for an order that is still an in-progress cart, not yet placed. */
export const CART_STATUS = "keranjang";

export const PAYMENT_STATUSES = ["belum_dibayar", "dibayar"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  totalPrice: integer("total_price").notNull().default(0),
  pickupTime: text("pickup_time"),
  status: text("status").notNull().default(CART_STATUS),
  paymentStatus: text("payment_status").notNull().default("belum_dibayar"),
  paymentMethod: text("payment_method"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  /** Snapshot of the product name at the moment it entered the order. */
  productName: text("product_name").notNull(),
  /** Snapshot of products.price at the moment it entered the order. */
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export type OrderRow = typeof orders.$inferSelect;
export type NewOrderRow = typeof orders.$inferInsert;
export type OrderItemRow = typeof orderItems.$inferSelect;
export type NewOrderItemRow = typeof orderItems.$inferInsert;
