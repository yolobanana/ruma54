export type StockLevel = "out" | "low" | "available";

export function getStockLevel(product: { stock: number }): StockLevel {
  if (product.stock <= 0) return "out";
  if (product.stock <= 5) return "low";
  return "available";
}

export function getStockLabel(product: { stock: number }): string {
  switch (getStockLevel(product)) {
    case "out":
      return "Habis";
    case "low":
      return "Stok Terbatas";
    case "available":
      return "Tersedia";
  }
}
