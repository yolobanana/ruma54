import { asc } from "drizzle-orm";

import { StockAdjuster } from "@/components/admin/stock-adjuster";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getStockLevel } from "@/lib/stock";

export const dynamic = "force-dynamic";

export default async function AdminStockPage() {
  const rows = await db.select().from(products).orderBy(asc(products.stock));

  const outOfStock = rows.filter((p) => getStockLevel(p) === "out").length;
  const lowStock = rows.filter((p) => getStockLevel(p) === "low").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Stok</h1>
        <p className="text-sm text-muted-foreground">
          {outOfStock} habis · {lowStock} menipis. Diurutkan dari stok terendah.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Atur Stok</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => {
              const level = getStockLevel(product);
              return (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.category}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {level === "out" ? (
                      <Badge variant="destructive">Habis</Badge>
                    ) : level === "low" ? (
                      <Badge variant="secondary">Menipis · {product.stock}</Badge>
                    ) : (
                      <Badge variant="secondary">Tersedia · {product.stock}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StockAdjuster id={product.id} stock={product.stock} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
