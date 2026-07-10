import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { ORDER_STATUS_STEPS, getOrderStatusIndex } from "@/lib/order-status";

export function OrderStatusTimeline({
  currentStatus,
}: {
  currentStatus: string | null;
}) {
  const currentIndex = getOrderStatusIndex(currentStatus);

  return (
    <ol className="flex flex-col">
      {ORDER_STATUS_STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === ORDER_STATUS_STEPS.length - 1;

        return (
          <li key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                  isDone &&
                    "border-primary bg-primary text-primary-foreground",
                  isCurrent &&
                    "border-primary bg-primary/10 text-primary",
                  !isDone && !isCurrent && "border-border text-muted-foreground"
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 py-1",
                    isDone ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>

            <div className={cn("flex flex-col gap-0.5 pb-6", isLast && "pb-0")}>
              <span
                className={cn(
                  "font-medium",
                  isCurrent && "text-primary",
                  !isDone && !isCurrent && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
              <span className="text-sm text-muted-foreground">
                {step.description}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
