"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Building2, QrCode, Wallet } from "lucide-react";

import { PaymentStatusIndicator } from "@/components/payment-status-indicator";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import { getPaymentMethodById } from "@/lib/mock-payment-methods";
import { formatPrice } from "@/lib/utils";

export default function KonfirmasiPembayaranPage() {
  return (
    <Suspense fallback={null}>
      <KonfirmasiPembayaranContent />
    </Suspense>
  );
}

function KonfirmasiPembayaranContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { totalPrice, clearCart } = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const [paidTotal, setPaidTotal] = useState<number | null>(null);

  const method = getPaymentMethodById(searchParams.get("method") ?? "");
  const displayTotal = confirmed && paidTotal !== null ? paidTotal : totalPrice;

  function handleConfirmPayment() {
    setPaidTotal(totalPrice);
    setConfirmed(true);
    clearCart();
  }

  if (!method) {
    return (
      <div className="flex flex-1 flex-col">
        <SiteHeader maxWidthClassName="max-w-3xl">
          <Link
            href="/checkout"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Checkout
          </Link>
          <h1 className="text-2xl font-semibold">Konfirmasi Pembayaran</h1>
        </SiteHeader>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
            <p className="font-medium">Metode pembayaran tidak ditemukan</p>
            <p className="text-sm text-muted-foreground">
              Silakan pilih metode pembayaran terlebih dahulu.
            </p>
            <Link
              href="/checkout"
              className="mt-1 text-sm font-medium text-primary hover:underline"
            >
              Kembali ke Checkout
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader maxWidthClassName="max-w-3xl">
        <Link
          href="/checkout"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Checkout
        </Link>
        <h1 className="text-2xl font-semibold">Konfirmasi Pembayaran</h1>
      </SiteHeader>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6">
          <Card className="flex-row items-center justify-between gap-3 p-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-muted-foreground">
                Total yang harus dibayar
              </span>
              <span className="text-xl font-semibold">
                {formatPrice(displayTotal)}
              </span>
            </div>
          </Card>

          <PaymentStatusIndicator isPaid={confirmed} />

          <Card className="gap-4 p-4">
            <h2 className="font-medium">Instruksi Pembayaran &mdash; {method.name}</h2>

            {method.type === "qris" && (
              <div className="flex flex-col items-center gap-3 py-2 text-center">
                <div className="flex size-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted">
                  <QrCode className="size-16 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Scan kode QR di atas menggunakan aplikasi bank atau e-wallet
                  favoritmu, lalu selesaikan pembayaran sejumlah{" "}
                  {formatPrice(displayTotal)}.
                </p>
              </div>
            )}

            {method.type === "e-wallet" && (
              <div className="flex flex-col items-center gap-3 py-2 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-accent">
                  <Wallet className="size-7 text-accent-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Buka aplikasi <strong>{method.name}</strong>, pilih menu
                  Bayar/Scan, lalu selesaikan pembayaran sejumlah{" "}
                  {formatPrice(displayTotal)} untuk pesanan RotiPilih-mu.
                </p>
              </div>
            )}

            {method.type === "bank" && (
              <div className="flex flex-col gap-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent">
                    <Building2 className="size-5 text-accent-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Nomor Virtual Account
                    </span>
                    <span className="font-mono text-lg font-semibold tracking-wide">
                      {method.virtualAccount}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Transfer tepat sejumlah <strong>{formatPrice(displayTotal)}</strong>{" "}
                  ke nomor Virtual Account di atas melalui ATM, mobile banking,
                  atau internet banking {method.name.replace("Transfer ", "")}.
                </p>
              </div>
            )}
          </Card>

          {confirmed ? (
            <Button
              size="lg"
              className="w-full"
              onClick={() =>
                router.push(
                  `/pesanan/status?paid=true&method=${method.id}&total=${displayTotal}`
                )
              }
            >
              Lihat Status Pesanan
            </Button>
          ) : (
            <Button size="lg" className="w-full" onClick={handleConfirmPayment}>
              Saya Sudah Bayar
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
