"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShoppingCart, Check } from "lucide-react";
import type { Producto } from "@/lib/types";
import { publicImageUrl } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";

const BADGE_STYLES: Record<string, string> = {
  Nuevo: "bg-cyan-accent/15 text-cyan-accent",
  Destacado: "bg-brand/10 text-brand",
  "CAD/CAM": "bg-ink/5 text-ink",
  "Impresion 3D": "bg-ink/5 text-ink",
  "Alta estetica": "bg-brand/10 text-brand",
};

export default function ProductCard({ producto }: { producto: Producto }) {
  const imageUrl = publicImageUrl(producto.imagen);
  const { toggleItem, isInCart } = useCart();
  const enCarrito = isInCart(producto.slug);

  function handleToggleCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({ slug: producto.slug, nombre: producto.nombre, marca: producto.marca, imagen: producto.imagen });
  }

  return (
    <Link
      href={`/producto/${producto.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-glow"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-mist-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={producto.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-grid-light bg-mist-100">
            <span className="font-heading text-2xl font-bold text-mist-300">DM</span>
          </div>
        )}
        {(producto.badges?.length > 0 || producto.tipo !== "producto") && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {producto.tipo !== "producto" && (
              <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-graphite-700 backdrop-blur">
                {producto.tipo === "linea" ? "Linea" : "Coleccion"}
              </span>
            )}
            {producto.badges?.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur ${
                  BADGE_STYLES[badge] || "bg-white/80 text-ink"
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={handleToggleCart}
          aria-label={enCarrito ? "Quitar del carrito de consulta" : "Agregar al carrito de consulta"}
          title={enCarrito ? "Quitar del carrito de consulta" : "Agregar al carrito de consulta"}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-soft backdrop-blur transition-colors ${
            enCarrito ? "bg-brand text-white" : "bg-white/90 text-graphite-600 hover:bg-white hover:text-brand"
          }`}
        >
          {enCarrito ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">{producto.marca}</p>
        <h3 className="font-heading text-base font-bold leading-snug text-ink">{producto.nombre}</h3>
        <p className="line-clamp-2 text-sm text-graphite-500">{producto.descripcion_corta}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="min-w-0 flex-1 truncate text-xs font-medium text-graphite-500">{producto.subcategoria}</span>
          <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold text-ink transition-colors group-hover:text-brand">
            Ver producto
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
