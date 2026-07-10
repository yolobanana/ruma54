# Orders — Shared Schema Contract (PROPOSAL)

> Status: **proposed, not yet implemented.** This document is the coordination
> point between the **storefront (user) side** and the **admin side**. Neither
> side should create the `orders` / `order_items` tables until this contract is
> agreed. Once agreed, whoever implements the migration should link it here.

## Why a contract

The storefront **creates** orders at checkout; the admin **reads and updates**
them (status changes, fulfilment). Both sides touch the same two tables, so the
column names, the status vocabulary, and the price/stock rules have to match
exactly or the two halves won't line up.

Today there is **no auth on the storefront**, so orders are **guest orders**:
the customer supplies contact info at checkout (this is a pickup bakery —
"ambil tanpa antre di toko"). There is no `users` table on the storefront and
this contract does not assume one.

## Tables

### `orders`

| Drizzle field   | SQL column      | Type / mode                         | Notes |
| --------------- | --------------- | ----------------------------------- | ----- |
| `id`            | `id`            | `text` PK                           | Generated, e.g. `crypto.randomUUID()`. Not a slug. |
| `customerName`  | `customer_name` | `text` NOT NULL                     | Nama pemesan. |
| `customerPhone` | `customer_phone`| `text` NOT NULL                     | Nomor WhatsApp untuk notifikasi ambil pesanan. |
| `notes`         | `notes`         | `text` NULL                         | Catatan pemesan (opsional). |
| `status`        | `status`        | `text` NOT NULL DEFAULT `'baru'`    | See status vocabulary below. |
| `total`         | `total`         | `integer` NOT NULL                  | Total rupiah (whole rupiah, same scale as `products.price`). Sum of item subtotals. |
| `createdAt`     | `created_at`    | `integer` (`mode: "timestamp"`) NOT NULL | Set on insert. |
| `updatedAt`     | `updated_at`    | `integer` (`mode: "timestamp"`) NOT NULL | Bumped on every status change. |

### `order_items`

| Drizzle field | SQL column    | Type / mode        | Notes |
| ------------- | ------------- | ------------------ | ----- |
| `id`          | `id`          | `text` PK          | Generated. |
| `orderId`     | `order_id`    | `text` NOT NULL    | FK → `orders.id`. |
| `productId`   | `product_id`  | `text` NOT NULL    | FK → `products.id` (reference for restock / linking). |
| `productName` | `product_name`| `text` NOT NULL    | **Snapshot** of the name at order time. |
| `unitPrice`   | `unit_price`  | `integer` NOT NULL | **Snapshot** of `products.price` at order time — prices change later. |
| `quantity`    | `quantity`    | `integer` NOT NULL | > 0. |

**Why snapshots:** an admin editing a product's price or name later must not
retroactively change what a past order says the customer paid. `productId`
stays for linking/restock; `productName` + `unitPrice` are frozen at checkout.

## Status vocabulary (Indonesian)

Ordered lifecycle. `status` stores the **key**; the UI shows the **label**.

| key          | label (UI)      | meaning |
| ------------ | --------------- | ------- |
| `baru`       | Pesanan Baru    | Just placed, awaiting the bakery. |
| `diproses`   | Diproses        | Being prepared / baked. |
| `siap`       | Siap Diambil    | Ready for pickup. |
| `selesai`    | Selesai         | Picked up / done. |
| `dibatalkan` | Dibatalkan      | Cancelled. |

Normal forward path: `baru → diproses → siap → selesai`. `dibatalkan` is
reachable from any non-`selesai` state. Suggest a shared
`src/lib/order-status.ts` exporting the keys, labels, and allowed transitions
so both sides import the same source of truth.

## API surface (proposed ownership)

**Storefront owns (writes on behalf of the customer):**
- `POST /api/orders` — create an order from the cart. Body: `customerName`,
  `customerPhone`, optional `notes`, and `items: [{ productId, quantity }]`.
  The server looks up each product to snapshot `productName`/`unitPrice` and to
  compute `total` (never trust client-sent prices).
- `GET /api/orders/[id]` — customer checks their own order status.

**Admin owns (fulfilment):**
- `GET /api/admin/orders` — list all orders (filter by status), newest first.
- `PATCH /api/admin/orders/[id]` — change `status` (validated against allowed
  transitions), bump `updatedAt`.

## Open questions to settle together

1. **Stock decrement — who and when?** Proposed default: `POST /api/orders`
   decrements `products.stock` inside the same transaction as the insert, and
   rejects the order if any item is out of stock. Cancelling (`→ dibatalkan`)
   on the admin side restores the stock. Confirm this split, or move all stock
   mutation to the admin side.
2. **Order id format** — `crypto.randomUUID()` (proposed) vs. a shorter
   human-friendly code (e.g. `RTP-3F9K2`) that's easier to read out at the
   counter. Leaning toward a short code for a pickup bakery.
3. **Minimum customer fields** — name + phone only (proposed), or also a
   requested pickup time?
4. **Migration ownership** — since order management is admin-side Phase 3, the
   admin side can write the migration once (1) and (2) are agreed, and the
   storefront side builds checkout against these exact columns.

---

_This is a proposal from the admin-side work. Storefront side: please review and
amend inline, then we both build against the agreed version._
