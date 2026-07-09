import type { Product } from "@/lib/types";

export type StockLevel = "out" | "low" | "available";

export function getStockLevel(product: Product): StockLevel {
  if (product.stock <= 0) return "out";
  if (product.stock <= 5) return "low";
  return "available";
}

export function getStockLabel(product: Product): string {
  switch (getStockLevel(product)) {
    case "out":
      return "Habis";
    case "low":
      return "Stok Terbatas";
    case "available":
      return "Tersedia";
  }
}
