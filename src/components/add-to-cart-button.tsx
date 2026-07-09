"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  isOutOfStock,
  className,
  size = "sm",
}: {
  product: Product;
  isOutOfStock: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
}) {
  const { addItem, getQuantity } = useCart();
  const inCart = getQuantity(product.id);
  const reachedStockLimit = !isOutOfStock && inCart >= product.stock;

  return (
    <Button
      type="button"
      size={size}
      disabled={isOutOfStock || reachedStockLimit}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1);
      }}
      className={cn("gap-1.5", className)}
    >
      <Plus />
      {isOutOfStock
        ? "Habis"
        : reachedStockLimit
          ? "Stok Maksimal"
          : "Tambah ke Keranjang"}
    </Button>
  );
}
