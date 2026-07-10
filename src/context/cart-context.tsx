"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { MOCK_CART } from "@/lib/mock-cart";
import type { CartItem, Product } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  getQuantity: (productId: string) => number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(MOCK_CART);

  function addItem(product: Product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const nextQuantity = Math.min(
          existing.quantity + quantity,
          product.stock
        );
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: nextQuantity }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  }

  function updateQuantity(productId: string, delta: number) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + delta,
                  item.product.stock
                ),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  function getQuantity(productId: string) {
    return items.find((item) => item.product.id === productId)?.quantity ?? 0;
  }

  const { totalItems, totalPrice } = useMemo(
    () => ({
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    }),
    [items]
  );

  const value: CartContextValue = {
    items,
    totalItems,
    totalPrice,
    getQuantity,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
