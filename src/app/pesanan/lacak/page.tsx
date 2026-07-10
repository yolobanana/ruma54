"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Clock, PartyPopper } from "lucide-react";

import { OrderStatusTimeline } from "@/components/order-status-timeline";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPaymentMethodById } from "@/lib/mock-payment-methods";
import { formatPrice } from "@/lib/utils";
import { useSimulatedOrderStatus } from "@/lib/use-simulated-order-status";

export default function LacakPesananPage() {
  return (
    <Suspense fallback={null}>
      <LacakPesananContent />
    </Suspense>
  );
}

function LacakPesananContent() {
  const searchParams = useSearchParams();

  const method = getPaymentMethodById(searchParams.get("method") ?? "");
  const total = Number(searchParams.get("total") ?? 0);
  const { currentStep, currentStatus, isSimulating } = useSimulatedOrderStatus(
    searchParams.get("status")
  );

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
        <h1 className="text-2xl font-semibold">Lacak Pesanan</h1>
      </SiteHeader>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6">
          <Card className="items-center gap-1 p-4 text-center">
            <span className="text-sm text-muted-foreground">
              Status pesanan saat ini
            </span>
            <span className="text-xl font-semibold text-primary">
              {currentStep.label}
            </span>
            {isSimulating && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                Memperbarui otomatis&hellip;
              </span>
            )}

            {currentStep.etaMinutes !== undefined ? (
              <div className="mt-2 flex items-center gap-2 rounded-lg border bg-accent/50 px-3 py-2 text-sm text-accent-foreground">
                <Clock className="size-4 shrink-0" />
                Estimasi siap dalam kurang lebih {currentStep.etaMinutes} menit
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-600/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
                <PartyPopper className="size-4 shrink-0" />
                Pesananmu sudah siap diambil!
              </div>
            )}
          </Card>

          <Card className="p-4">
            <OrderStatusTimeline currentStatus={currentStatus} />
          </Card>

          {(method || total > 0) && (
            <Card className="gap-3 p-4">
              <h2 className="font-medium">Detail Pesanan</h2>
              {method && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Metode pembayaran</span>
                  <span>{method.name}</span>
                </div>
              )}
              {total > 0 && (
                <div className="flex items-center justify-between border-t pt-3 font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              )}
            </Card>
          )}

          <Button asChild size="lg" className="w-full">
            <Link href="/">Kembali ke Menu Roti</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
