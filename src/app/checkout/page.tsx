"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import { PAYMENT_METHOD_GROUPS } from "@/lib/mock-payment-methods";
import { cn, formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader maxWidthClassName="max-w-3xl">
        <Link
          href="/keranjang"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Keranjang
        </Link>
        <h1 className="text-2xl font-semibold">Checkout</h1>
      </SiteHeader>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
            <ShoppingBag className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="font-medium">Keranjang masih kosong</p>
            <p className="text-sm text-muted-foreground">
              Isi keranjangmu dulu sebelum checkout.
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

            <div className="flex flex-col gap-4">
              <h2 className="font-medium">Pilih Metode Pembayaran</h2>

              {PAYMENT_METHOD_GROUPS.map((group) => (
                <div key={group.type} className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {group.label}
                  </span>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {group.methods.map((method) => {
                      const isSelected = selectedMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedMethod(method.id)}
                          aria-pressed={isSelected}
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors",
                            isSelected
                              ? "border-primary bg-accent/50"
                              : "border-border hover:bg-muted"
                          )}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{method.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {method.description}
                            </span>
                          </div>
                          <div
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-full border",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border"
                            )}
                          >
                            {isSelected && <Check className="size-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={!selectedMethod}
              onClick={() => {
                if (selectedMethod) {
                  router.push(`/checkout/konfirmasi?method=${selectedMethod}`);
                }
              }}
            >
              {selectedMethod
                ? "Konfirmasi Pembayaran"
                : "Pilih metode pembayaran dulu"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
