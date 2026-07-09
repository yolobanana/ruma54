import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { MenuCatalog } from "@/components/menu-catalog";
import { MOCK_CART } from "@/lib/mock-cart";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

export default function Home() {
  const cartCount = MOCK_CART.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">RotiPilih</h1>
            <p className="text-sm text-muted-foreground">
              Pesan roti favoritmu online, ambil tanpa antre di toko.
            </p>
          </div>
          <Link
            href="/keranjang"
            aria-label={`Keranjang, ${cartCount} item`}
            className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ShoppingBag className="size-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <MenuCatalog products={MOCK_PRODUCTS} />
      </main>
    </div>
  );
}
