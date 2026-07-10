export type PaymentMethodType = "qris" | "e-wallet" | "bank";

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  description: string;
  /** Mock virtual account number, shown for bank transfer methods. */
  virtualAccount?: string;
}

export const PAYMENT_METHOD_GROUPS: {
  type: PaymentMethodType;
  label: string;
  methods: PaymentMethod[];
}[] = [
  {
    type: "qris",
    label: "QRIS",
    methods: [
      {
        id: "qris",
        name: "QRIS",
        type: "qris",
        description: "Scan kode QR dari aplikasi bank atau e-wallet apa saja",
      },
    ],
  },
  {
    type: "e-wallet",
    label: "E-Wallet",
    methods: [
      {
        id: "gopay",
        name: "GoPay",
        type: "e-wallet",
        description: "Bayar langsung pakai saldo GoPay",
      },
      {
        id: "ovo",
        name: "OVO",
        type: "e-wallet",
        description: "Bayar langsung pakai saldo OVO",
      },
      {
        id: "dana",
        name: "DANA",
        type: "e-wallet",
        description: "Bayar langsung pakai saldo DANA",
      },
    ],
  },
  {
    type: "bank",
    label: "Transfer Bank",
    methods: [
      {
        id: "bca",
        name: "Transfer BCA",
        type: "bank",
        description: "Transfer manual ke rekening virtual BCA",
        virtualAccount: "39012345678901",
      },
      {
        id: "mandiri",
        name: "Transfer Mandiri",
        type: "bank",
        description: "Transfer manual ke rekening virtual Mandiri",
        virtualAccount: "88808123456789",
      },
      {
        id: "bni",
        name: "Transfer BNI",
        type: "bank",
        description: "Transfer manual ke rekening virtual BNI",
        virtualAccount: "98800123456789",
      },
    ],
  },
];

export const ALL_PAYMENT_METHODS: PaymentMethod[] =
  PAYMENT_METHOD_GROUPS.flatMap((group) => group.methods);

export function getPaymentMethodById(id: string): PaymentMethod | undefined {
  return ALL_PAYMENT_METHODS.find((method) => method.id === id);
}
