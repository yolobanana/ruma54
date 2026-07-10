import { cn } from "@/lib/utils";
import { getStockLabel, getStockLevel } from "@/lib/stock";
import type { Product } from "@/lib/types";

export function StockStatusLabel({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const level = getStockLevel(product);

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium",
        level === "out" && "text-destructive",
        level === "low" && "text-amber-600 dark:text-amber-500",
        level === "available" && "text-emerald-600 dark:text-emerald-500",
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          level === "out" && "bg-destructive",
          level === "low" && "bg-amber-600 dark:bg-amber-500",
          level === "available" && "bg-emerald-600 dark:bg-emerald-500"
        )}
      />
      {getStockLabel(product)}
    </span>
  );
}
