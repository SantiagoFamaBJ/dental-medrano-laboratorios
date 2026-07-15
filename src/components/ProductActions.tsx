"use client";

import { useState } from "react";
import { ShoppingCart, Check, Trash2 } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { useCart } from "@/lib/cart-context";
import { buildWhatsAppUrl, mensajeConsultaProducto } from "@/lib/whatsapp";

interface ProductActionsProps {
  slug: string;
  nombre: string;
  marca: string | null;
  imagen: string | null;
  variantes?: string[];
  whatsappNumber?: string;
}

export default function ProductActions({
  slug,
  nombre,
  marca,
  imagen,
  variantes = [],
  whatsappNumber,
}: ProductActionsProps) {
  const { items, addItem, removeItem, isInCart } = useCart();
  const tieneVariantes = variantes.length > 0;
  const itemEnCarrito = items.find((i) => i.slug === slug);
  const enCarrito = isInCart(slug);

  const [variante, setVariante] = useState(itemEnCarrito?.variante || "");

  const whatsappUrl = buildWhatsAppUrl(mensajeConsultaProducto(nombre, variante || undefined), whatsappNumber);

  function handleAgregar() {
    addItem({ slug, nombre, marca, imagen, variante: variante || undefined });
  }

  return (
    <div className="mt-8 space-y-4">
      {tieneVariantes && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-graphite-700">
            Tonalidad / medida (opcional)
          </label>
          <select
            value={variante}
            onChange={(e) => setVariante(e.target.value)}
            className="w-full max-w-xs rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand sm:w-auto"
          >
            <option value="">Sin especificar</option>
            {variantes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-graphite-500">
            Elegí una opción antes de consultar o agregar al carrito, así queda incluida en el mensaje.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.02] hover:bg-brand-dark"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Consultar por este producto
        </a>
        <button
          onClick={handleAgregar}
          className={`inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors ${
            enCarrito
              ? "border-brand bg-brand/10 text-brand"
              : "border-mist-300 text-graphite-600 hover:border-brand/40 hover:text-brand"
          }`}
        >
          {enCarrito ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          {enCarrito ? "Actualizar en el carrito" : "Agregar al carrito"}
        </button>
        {enCarrito && (
          <button
            onClick={() => removeItem(slug)}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-graphite-400 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Quitar del carrito
          </button>
        )}
      </div>
    </div>
  );
}
