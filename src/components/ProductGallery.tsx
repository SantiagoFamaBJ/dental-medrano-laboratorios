"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { publicImageUrl } from "@/lib/supabase";
import ProductActions from "@/components/ProductActions";
import type { Producto } from "@/lib/types";

interface ProductGalleryProps {
  producto: Producto;
  whatsappNumber?: string;
}

/**
 * Muestra la foto principal + el selector de variante, y cambia la foto mostrada segun la
 * variante elegida (si esa variante tiene su propia foto cargada en el admin). Si la variante
 * no tiene foto propia, o todavia no se eligio ninguna, se muestra la foto principal del
 * producto sin cambios (por eso en bloques/Noritake, que no cargan foto por variante, nunca
 * cambia nada).
 */
export default function ProductGallery({ producto, whatsappNumber }: ProductGalleryProps) {
  const [imagenVariante, setImagenVariante] = useState<string | null>(null);
  const imagenMostrada = imagenVariante || producto.imagen;
  const imageUrl = publicImageUrl(imagenMostrada);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-mist-200 bg-white">
        {imageUrl ? (
          <Image
            key={imageUrl}
            src={imageUrl}
            alt={producto.nombre}
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-contain p-6"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-grid-light">
            <span className="font-heading text-5xl font-bold text-mist-300">DM</span>
          </div>
        )}
      </div>

      <div>
        {(producto.badges?.length > 0 || producto.tipo !== "producto") && (
          <div className="mb-4 flex flex-wrap gap-2">
            {producto.tipo !== "producto" && (
              <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-graphite-700">
                {producto.tipo === "linea" ? "Linea" : "Coleccion"}
              </span>
            )}
            {producto.badges?.map((b) => (
              <span key={b} className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {b}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">{producto.marca}</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          {producto.nombre}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-graphite-600">
          {producto.descripcion_completa || producto.descripcion_corta}
        </p>

        <ProductActions
          slug={producto.slug}
          nombre={producto.nombre}
          marca={producto.marca}
          imagen={producto.imagen}
          sku={producto.sku}
          variantes={producto.variantes}
          variantesMatriz={producto.variantes_matriz}
          whatsappNumber={whatsappNumber}
          onImagenChange={setImagenVariante}
        />

        {producto.beneficios?.length > 0 && (
          <div className="mt-10">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-ink">Beneficios</h2>
            <ul className="mt-3 space-y-2.5">
              {producto.beneficios.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-graphite-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {producto.aplicaciones?.length > 0 && (
          <div className="mt-8">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-ink">Aplicaciones</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {producto.aplicaciones.map((a) => (
                <span key={a} className="rounded-full bg-mist-100 px-3.5 py-1.5 text-xs font-medium text-graphite-600">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {producto.caracteristicas?.length > 0 && (
          <div className="mt-8">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-ink">Caracteristicas</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-graphite-600">
              {producto.caracteristicas.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
