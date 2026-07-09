import { MenuCatalog } from "@/components/menu-catalog";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-semibold">RotiPilih</h1>
          <p className="text-sm text-muted-foreground">
            Pesan roti favoritmu online, ambil tanpa antre di toko.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <MenuCatalog products={MOCK_PRODUCTS} />
      </main>
    </div>
  );
}
