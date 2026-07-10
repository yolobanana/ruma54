import Link from "next/link";

import { ArchiveProductButton } from "@/components/admin/archive-product-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getStockLabel } from "@/lib/stock";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const rows = await db.select().from(products);
  const activeCount = rows.filter((p) => !p.archived).length;
  const archivedCount = rows.length - activeCount;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Produk</h1>
          <p className="text-sm text-muted-foreground">
            {activeCount} aktif
            {archivedCount > 0 ? ` · ${archivedCount} diarsipkan` : ""}.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/produk/baru">Tambah Produk</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Harga</th>
              <th className="px-4 py-3 font-medium">Stok</th>
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Belum ada produk. Tambah roti pertamamu.
                </td>
              </tr>
            )}
            {rows.map((product) => (
              <tr
                key={product.id}
                className={`border-b last:border-0 ${
                  product.archived ? "opacity-55" : ""
                }`}
              >
                <td className="px-4 py-3 font-medium">
                  <span className="inline-flex items-center gap-2">
                    {product.name}
                    {product.archived && (
                      <Badge variant="secondary">Diarsipkan</Badge>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.category}
                </td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  {product.stock}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({getStockLabel(product)})
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/produk/${product.id}`}>Edit</Link>
                    </Button>
                    <ArchiveProductButton
                      id={product.id}
                      name={product.name}
                      archived={product.archived}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
