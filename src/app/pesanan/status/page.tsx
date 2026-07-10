"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PaymentStatusIndicator } from "@/components/payment-status-indicator";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPaymentMethodById } from "@/lib/mock-payment-methods";
import { formatPrice } from "@/lib/utils";

export default function StatusPembayaranPage() {
  return (
    <Suspense fallback={null}>
      <StatusPembayaranContent />
    </Suspense>
  );
}

function StatusPembayaranContent() {
  const searchParams = useSearchParams();

  const isPaid = searchParams.get("paid") === "true";
  const method = getPaymentMethodById(searchParams.get("method") ?? "");
  const total = Number(searchParams.get("total") ?? 0);

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
        <h1 className="text-2xl font-semibold">Status Pembayaran</h1>
      </SiteHeader>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6">
          <PaymentStatusIndicator isPaid={isPaid} size="lg" />

          <Card className="gap-3 p-4">
            <h2 className="font-medium">Detail Pesanan</h2>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Metode pembayaran</span>
              <span>{method?.name ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3 font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </Card>

          <Button asChild size="lg" className="w-full">
            <Link href="/">Kembali ke Menu Roti</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
