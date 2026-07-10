/**
 * Mirrors the shared fulfilment vocabulary from src/db/schema.ts (ORDER_STATUSES),
 * agreed with the admin side in issue #5. Only the "still waiting to be picked up"
 * steps are shown here — "selesai" and "dibatalkan" fall outside this tracker.
 */
export type OrderQueueStatus = "baru" | "diproses" | "siap";

export interface OrderStatusStep {
  key: OrderQueueStatus;
  label: string;
  description: string;
  /** Estimated minutes remaining until the order is ready; omitted once ready. */
  etaMinutes?: number;
}

export const ORDER_STATUS_STEPS: OrderStatusStep[] = [
  {
    key: "baru",
    label: "Pesanan Baru",
    description: "Pesananmu sudah kami terima dan akan segera disiapkan.",
    etaMinutes: 15,
  },
  {
    key: "diproses",
    label: "Diproses",
    description: "Roti pilihanmu sedang disiapkan/dipanggang di dapur.",
    etaMinutes: 8,
  },
  {
    key: "siap",
    label: "Siap Diambil",
    description: "Pesananmu sudah dibungkus, siap diambil di loket toko.",
  },
];

export function getOrderStatusIndex(status: string | null): number {
  const index = ORDER_STATUS_STEPS.findIndex((step) => step.key === status);
  return index === -1 ? 0 : index;
}
