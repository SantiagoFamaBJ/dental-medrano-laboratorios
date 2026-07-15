"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
  slug: string;
  nombre: string;
  marca: string | null;
  imagen: string | null;
  /** Familia dentro de la linea (ej. "Body N"), cuando el producto usa variantes agrupadas por familia. */
  familia?: string;
  /** Tonalidad / presentacion exacta elegida (etiqueta de la variante). */
  variante?: string;
  /** SKU exacto de la variante elegida, o SKU del producto si no tiene variantes. */
  sku?: string;
}

/**
 * Identidad unica de una linea de carrito. Dos variantes del mismo producto (distinto SKU o
 * distinta variante) deben poder convivir como lineas separadas: por eso la identidad no es
 * el slug del producto solo, sino slug + sku/variante.
 */
export function cartItemId(item: Pick<CartItem, "slug" | "sku" | "variante">): string {
  return `${item.slug}__${item.sku || item.variante || "base"}`;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: CartItem) => void;
  clear: () => void;
  isInCart: (id: string) => boolean;
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
      // localStorage no disponible o corrupto: seguimos con carrito vacio.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // si falla el guardado no es critico, el carrito sigue funcionando en memoria.
    }
  }, [items, hydrated]);

  function addItem(item: CartItem) {
    const id = cartItemId(item);
    setItems((prev) => {
      const existe = prev.some((p) => cartItemId(p) === id);
      if (existe) return prev.map((p) => (cartItemId(p) === id ? item : p));
      return [...prev, item];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((p) => cartItemId(p) !== id));
  }

  function toggleItem(item: CartItem) {
    const id = cartItemId(item);
    setItems((prev) =>
      prev.some((p) => cartItemId(p) === id) ? prev.filter((p) => cartItemId(p) !== id) : [...prev, item]
    );
  }

  function clear() {
    setItems([]);
  }

  function isInCart(id: string) {
    return items.some((p) => cartItemId(p) === id);
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
