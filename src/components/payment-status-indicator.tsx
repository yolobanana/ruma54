import { CheckCircle2, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";

export function PaymentStatusIndicator({
  isPaid,
  size = "default",
  className,
}: {
  isPaid: boolean;
  size?: "default" | "lg";
  className?: string;
}) {
  const isLarge = size === "lg";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border p-6 text-center",
        isPaid
          ? "border-emerald-600/30 bg-emerald-600/10"
          : "border-amber-600/30 bg-amber-600/10",
        className
      )}
    >
      {isPaid ? (
        <CheckCircle2
          className={cn(
            "text-emerald-600 dark:text-emerald-400",
            isLarge ? "size-16" : "size-10"
          )}
        />
      ) : (
        <Clock3
          className={cn(
            "text-amber-600 dark:text-amber-400",
            isLarge ? "size-16" : "size-10"
          )}
        />
      )}
      <div className="flex flex-col gap-1">
        <span
          className={cn(
            "font-semibold",
            isPaid
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-amber-700 dark:text-amber-400",
            isLarge ? "text-xl" : "text-base"
          )}
        >
          {isPaid ? "Lunas" : "Belum Dibayar"}
        </span>
        <span className="text-sm text-muted-foreground">
          {isPaid
            ? "Pembayaranmu sudah kami terima."
            : "Selesaikan pembayaran sebelum pesanan diproses."}
        </span>
      </div>
    </div>
  );
}
