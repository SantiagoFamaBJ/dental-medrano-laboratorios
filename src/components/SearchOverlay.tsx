"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Producto } from "@/lib/types";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      const term = `%${query.trim()}%`;

      // Busca tambien por SKU y por el contenido de variantes_matriz (sku exacto, baseCode,
      // familia, tono, medida) para que un vendedor pueda encontrar un producto tipeando un
      // codigo o una tonalidad, no solo el nombre.
      const { data, error } = await supabase
        .from("labs_products")
        .select("*")
        .eq("activo", true)
        .or(
          `nombre.ilike.${term},marca.ilike.${term},subcategoria.ilike.${term},tecnologia.ilike.${term},descripcion_corta.ilike.${term},sku.ilike.${term},variantes_matriz::text.ilike.${term}`
        )
        .limit(12);

      if (!error && data) {
        setResults(data as Producto[]);
        setLoading(false);
        return;
      }

      // Fallback defensivo por si el cast dentro de .or() no esta soportado: repetimos la
      // busqueda basica (sin variantes_matriz) para no dejar el buscador roto.
      const { data: dataBasica } = await supabase
        .from("labs_products")
        .select("*")
        .eq("activo", true)
        .or(
          `nombre.ilike.${term},marca.ilike.${term},subcategoria.ilike.${term},tecnologia.ilike.${term},descripcion_corta.ilike.${term},sku.ilike.${term}`
        )
        .limit(12);
      setResults((dataBasica as Producto[]) || []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/70 px-4 pt-24 backdrop-blur-sm sm:pt-32">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-mist-200 px-5 py-4">
          <Search className="h-5 w-5 text-graphite-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscá por producto, marca, material o tecnología..."
            className="flex-1 bg-transparent text-base text-ink outline-none placeholder:text-graphite-500"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-graphite-500" />}
          <button onClick={onClose} aria-label="Cerrar búsqueda" className="rounded-full p-1.5 hover:bg-mist-100">
            <X className="h-5 w-5 text-graphite-600" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-2">
          {query.trim() === "" && (
            <p className="px-4 py-8 text-center text-sm text-graphite-500">
              Probá con &quot;zirconia&quot;, &quot;BRILLIANT Crios&quot;, &quot;impresión 3D&quot; o &quot;Noritake&quot;.
            </p>
          )}
          {query.trim() !== "" && !loading && results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-graphite-500">
              No encontramos productos para &quot;{query}&quot;. Probá con otro término o consultá con un asesor.
            </p>
          )}
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/producto/${p.slug}`}
              onClick={onClose}
              className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-mist-100"
            >
              <div>
                <p className="text-sm font-semibold text-ink">{p.nombre}</p>
                <p className="text-xs text-graphite-500">
                  {p.marca} · {p.subcategoria}
                  {p.sku ? ` · SKU ${p.sku}` : ""}
                </p>
              </div>
              <span className="text-xs font-medium text-brand">Ver producto</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
