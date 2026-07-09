"use client";

import { useMemo, useState } from "react";
import { Search, WheatOff } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/mock-products";
import type { Product } from "@/lib/types";

export function MenuCatalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Semua");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        category === "Semua" || product.category === category;
      const matchesQuery =
        q.length === 0 ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  const hasActiveFilter = query.trim().length > 0 || category !== "Semua";

  function resetFilters() {
    setQuery("");
    setCategory("Semua");
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari nama roti atau kategori..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 pl-8"
            aria-label="Cari roti"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Menu Roti</h2>
        <span className="text-sm text-muted-foreground">
          {filtered.length} roti tersedia
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <WheatOff className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="font-medium">Roti tidak ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Coba kata kunci atau kategori lain.
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-1 text-sm font-medium text-primary hover:underline"
            >
              Reset pencarian
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
