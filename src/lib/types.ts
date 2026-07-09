export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  /** Minutes until a fresh batch is out of the oven; omitted when already ready. */
  bakeEtaMinutes?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
