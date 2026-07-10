"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";

export default function KeranjangPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } =
    useCart();

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
        <h1 className="text-2xl font-semibold">Keranjang</h1>
      </SiteHeader>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
            <ShoppingBag className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="font-medium">Keranjang masih kosong</p>
            <p className="text-sm text-muted-foreground">
              Yuk pilih roti favoritmu dulu.
            </p>
            <Link
              href="/"
              className="mt-1 text-sm font-medium text-primary hover:underline"
            >
              Lihat Menu Roti
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.product.id}>
                  <Card className="flex-row items-center gap-3 p-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <h3 className="line-clamp-1 font-medium">
                        {item.product.name}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {formatPrice(item.product.price)} / pcs
                      </span>

                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            aria-label={`Kurangi jumlah ${item.product.name}`}
                            onClick={() => updateQuantity(item.product.id, -1)}
                          >
                            <Minus />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            aria-label={`Tambah jumlah ${item.product.name}`}
                            onClick={() => updateQuantity(item.product.id, 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus />
                          </Button>
                        </div>
                        <span className="font-semibold">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Hapus ${item.product.name} dari keranjang`}
                      className="self-start text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 />
                    </Button>
                  </Card>
                </li>
              ))}
            </ul>

            <Card className="gap-3 p-4">
              <h2 className="font-medium">Ringkasan Pesanan</h2>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Jumlah item</span>
                <span>{totalItems} pcs</span>
              </div>
              <div className="flex items-center justify-between border-t pt-3 font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </Card>

            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">Lanjut ke Pembayaran</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
