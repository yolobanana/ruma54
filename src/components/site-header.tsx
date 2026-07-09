import type { ReactNode } from "react";

import { CartBadgeLink } from "@/components/cart-badge-link";
import { cn } from "@/lib/utils";

export function SiteHeader({
  maxWidthClassName = "max-w-6xl",
  children,
}: {
  maxWidthClassName?: string;
  children: ReactNode;
}) {
  return (
    <header className="border-b bg-card">
      <div
        className={cn(
          "mx-auto flex items-start justify-between gap-4 px-4 py-6 sm:px-6",
          maxWidthClassName
        )}
      >
        <div className="flex flex-col gap-1">{children}</div>
        <CartBadgeLink />
      </div>
    </header>
  );
}
