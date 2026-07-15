"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, X, Trash2 } from "lucide-react";
import { useCart, cartItemId } from "@/lib/cart-context";
import { publicImageUrl } from "@/lib/supabase";
import { buildWhatsAppUrl, mensajeConsultaCarrito } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

export default function CartDrawer({ open, onClose, whatsappNumber }: CartDrawerProps) {
  const { items, removeItem, clear } = useCart();

  const whatsappUrl =
    items.length > 0
      ? buildWhatsAppUrl(mensajeConsultaCarrito(items), whatsappNumber)
      : undefined;

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-300 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-mist-200 px-6 py-5">
          <span className="flex items-center gap-2 font-heading text-base font-bold text-ink">
            <ShoppingCart className="h-5 w-5 text-brand" />
            Carrito de consulta
          </span>
          <button onClick={onClose} aria-label="Cerrar carrito" className="rounded-full p-2 hover:bg-mist-100">
            <X className="h-5 w-5 text-graphite-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingCart className="h-10 w-10 text-mist-300" />
              <p className="mt-4 text-sm text-graphite-500">
                Todavia no agregaste productos. Suma los que te interesen y manda una sola consulta por todos.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const imageUrl = publicImageUrl(item.imagen);
                const id = cartItemId(item);
                return (
                  <li key={id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-mist-200 bg-mist-100">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={item.nombre} fill sizes="56px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-heading text-xs font-bold text-mist-300">DM</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      {item.marca && (
                        <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-brand">{item.marca}</p>
                      )}
                      <p className="truncate text-sm font-semibold text-ink">{item.nombre}</p>
                      {item.familia && (
                        <p className="truncate text-xs text-graphite-500">Familia: {item.familia}</p>
                      )}
                      {item.variante && (
                        <p className="truncate text-xs text-graphite-500">Tonalidad/Presentacion: {item.variante}</p>
                      )}
                      {item.sku && (
                        <p className="truncate text-xs text-graphite-400">SKU: {item.sku}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(id)}
                      aria-label={`Quitar ${item.nombre} del carrito`}
                      className="shrink-0 rounded-full p-2 text-graphite-400 hover:bg-mist-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t border-mist-200 px-6 py-5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-semibold text-white hover:opacity-90"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Consultar por WhatsApp
            </a>
            <Link
              href="/contacto"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-mist-300 py-3.5 text-sm font-semibold text-graphite-700 hover:border-brand/40"
            >
              Enviar por formulario
            </Link>
            <button
              onClick={clear}
              className="w-full text-center text-xs font-medium text-graphite-400 hover:text-red-600"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
