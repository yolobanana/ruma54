"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/context/cart-context";

export function CartBadgeLink() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/keranjang"
      aria-label={`Keranjang, ${totalItems} item`}
      className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ShoppingBag className="size-4.5" />
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
