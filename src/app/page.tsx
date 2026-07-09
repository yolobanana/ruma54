import { ProductCard } from "@/components/product-card";
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Menu Roti</h2>
          <span className="text-sm text-muted-foreground">
            {MOCK_PRODUCTS.length} roti tersedia
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
