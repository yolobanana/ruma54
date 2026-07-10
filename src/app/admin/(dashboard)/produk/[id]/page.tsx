import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { db } from "@/db";
import { products } from "@/db/schema";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [row] = await db.select().from(products).where(eq(products.id, id));

  if (!row) {
    notFound();
  }

  const product: Product = {
    ...row,
    bakeEtaMinutes: row.bakeEtaMinutes ?? undefined,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Produk</h1>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
