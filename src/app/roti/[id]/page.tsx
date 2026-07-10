import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { StockStatusLabel } from "@/components/stock-status-label";
import { getProductById, MOCK_PRODUCTS } from "@/lib/mock-products";
import { getStockLevel } from "@/lib/stock";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({ id: product.id }));
}

export default async function RotiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const isOutOfStock = getStockLevel(product) === "out";

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader maxWidthClassName="max-w-3xl">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Menu
        </Link>
      </SiteHeader>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className={
              isOutOfStock ? "object-cover grayscale opacity-50" : "object-cover"
            }
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Badge variant="destructive" className="text-base font-semibold">
                Habis
              </Badge>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant="outline">{product.category}</Badge>
              <h1 className="mt-2 text-2xl font-semibold">{product.name}</h1>
            </div>
            <StockStatusLabel product={product} className="mt-3 shrink-0" />
          </div>

          <p className="text-xl font-semibold">{formatPrice(product.price)}</p>

          {!isOutOfStock && product.bakeEtaMinutes && (
            <div className="flex items-center gap-2 rounded-lg border bg-accent/50 px-3 py-2 text-sm text-accent-foreground">
              <Clock className="size-4 shrink-0" />
              Baru dipanggang &mdash; siap dalam kurang lebih{" "}
              {product.bakeEtaMinutes} menit.
            </div>
          )}

          <div>
            <h2 className="mb-1 font-medium">Deskripsi</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          <AddToCartButton
            product={product}
            isOutOfStock={isOutOfStock}
            size="lg"
            className="mt-2 w-full sm:w-fit"
          />
        </div>
      </main>
    </div>
  );
}
