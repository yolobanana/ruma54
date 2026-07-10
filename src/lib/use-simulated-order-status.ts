"use client";

import { useEffect, useState } from "react";

import { ORDER_STATUS_STEPS, getOrderStatusIndex } from "@/lib/order-status";

const STEP_DURATION_MS = 5000;

export function useSimulatedOrderStatus(initialStatus: string | null) {
  const [index, setIndex] = useState(() => getOrderStatusIndex(initialStatus));

  useEffect(() => {
    if (index >= ORDER_STATUS_STEPS.length - 1) return;

    const timer = setTimeout(() => {
      setIndex((prev) => Math.min(prev + 1, ORDER_STATUS_STEPS.length - 1));
    }, STEP_DURATION_MS);

    return () => clearTimeout(timer);
  }, [index]);

  return {
    currentStep: ORDER_STATUS_STEPS[index],
    currentStatus: ORDER_STATUS_STEPS[index].key,
    isSimulating: index < ORDER_STATUS_STEPS.length - 1,
  };
}
