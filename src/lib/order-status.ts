export type OrderQueueStatus = "diterima" | "diproses" | "siap_diambil";

export interface OrderStatusStep {
  key: OrderQueueStatus;
  label: string;
  description: string;
  /** Estimated minutes remaining until the order is ready; omitted once ready. */
  etaMinutes?: number;
}

export const ORDER_STATUS_STEPS: OrderStatusStep[] = [
  {
    key: "diterima",
    label: "Diterima",
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
    key: "siap_diambil",
    label: "Siap Diambil",
    description: "Pesananmu sudah dibungkus, siap diambil di loket toko.",
  },
];

export function getOrderStatusIndex(status: string | null): number {
  const index = ORDER_STATUS_STEPS.findIndex((step) => step.key === status);
  return index === -1 ? 0 : index;
}
