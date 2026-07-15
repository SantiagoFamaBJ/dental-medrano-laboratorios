"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
  slug: string;
  nombre: string;
  marca: string | null;
  imagen: string | null;
  variante?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (slug: string) => void;
  toggleItem: (item: CartItem) => void;
  clear: () => void;
  isInCart: (slug: string) => boolean;
}

const STORAGE_KEY = "labs_cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage no disponible o corrupto: seguimos con carrito vacío.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // si falla el guardado no es crítico, el carrito sigue funcionando en memoria.
    }
  }, [items, hydrated]);

  /** Agrega el producto al carrito. Si ya estaba (mismo slug), actualiza sus datos (por ej. la tonalidad/medida elegida). */
  function addItem(item: CartItem) {
    setItems((prev) => {
      const existe = prev.some((p) => p.slug === item.slug);
      if (existe) return prev.map((p) => (p.slug === item.slug ? item : p));
      return [...prev, item];
    });
  }

  function removeItem(slug: string) {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }

  function toggleItem(item: CartItem) {
    setItems((prev) =>
      prev.some((p) => p.slug === item.slug) ? prev.filter((p) => p.slug !== item.slug) : [...prev, item]
    );
  }

  function clear() {
    setItems([]);
  }

  function isInCart(slug: string) {
    return items.some((p) => p.slug === slug);
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, toggleItem, clear, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return ctx;
}
