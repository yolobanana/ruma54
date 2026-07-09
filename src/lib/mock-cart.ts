import { getProductById } from "@/lib/mock-products";
import type { CartItem } from "@/lib/types";

export const MOCK_CART: CartItem[] = [
  { product: getProductById("roti-kasur-manis")!, quantity: 2 },
  { product: getProductById("croissant-butter")!, quantity: 1 },
  { product: getProductById("donat-gula")!, quantity: 3 },
];
