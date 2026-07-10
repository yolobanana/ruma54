"use client";

import { BellRing, X } from "lucide-react";

export function NotificationToast({
  show,
  title,
  message,
  onDismiss,
}: {
  show: boolean;
  title: string;
  message: string;
  onDismiss: () => void;
}) {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-in fade-in slide-in-from-top-2 fixed inset-x-4 top-4 z-50 mx-auto flex max-w-sm items-start gap-3 rounded-xl border border-primary/30 bg-card p-4 shadow-lg duration-300"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <BellRing className="size-4.5" />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
