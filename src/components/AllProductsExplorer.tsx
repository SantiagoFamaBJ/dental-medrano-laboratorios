"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X, Search, ArrowUpRight } from "lucide-react";
import type { Categoria, Marca, Producto } from "@/lib/types";
import ProductGrid from "./ProductGrid";

interface AllProductsExplorerProps {
  productos: Producto[];
  categorias: Categoria[];
  marcas: Marca[];
}

const TECNOLOGIA_LABEL: Record<string, string> = {
  analogico: "Analógico",
  digital: "Digital",
  mixto: "Mixto",
};

export default function AllProductsExplorer({ productos, categorias, marcas }: AllProductsExplorerProps) {
  const [query, setQuery] = useState("");
  const [categoriaSlug, setCategoriaSlug] = useState<string | null>(null);
  const [subcategoria, setSubcategoria] = useState<string | null>(null);
  const [tecnologia, setTecnologia] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const productosPorCategoria = useMemo(() => {
    if (!categoriaSlug) return productos;
    return productos.filter((p) => p.categoria_slug === categoriaSlug);
  }, [productos, categoriaSlug]);

  const marcasPresentes = useMemo(() => {
    const nombres = Array.from(new Set(productosPorCategoria.map((p) => p.marca).filter(Boolean))) as string[];
    return nombres
      .map((nombre) => ({
        nombre,
        slug: marcas.find((m) => m.nombre.toLowerCase() === nombre.toLowerCase())?.slug ?? null,
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [productosPorCategoria, marcas]);

  const subcategorias = useMemo(
    () => Array.from(new Set(productosPorCategoria.map((p) => p.subcategoria).filter(Boolean))) as string[],
    [productosPorCategoria]
  );
  const tecnologias = useMemo(
    () => Array.from(new Set(productosPorCategoria.map((p) => p.tecnologia).filter(Boolean))) as string[],
    [productosPorCategoria]
  );

  const filtrados = useMemo(() => {
    return productosPorCategoria.filter((p) => {
      if (subcategoria && p.subcategoria !== subcategoria) return false;
      if (tecnologia && p.tecnologia !== tecnologia) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const haystack = `${p.nombre} ${p.marca} ${p.subcategoria} ${p.tags?.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [productosPorCategoria, subcategoria, tecnologia, query]);

  const activeCount = [categoriaSlug, subcategoria, tecnologia].filter(Boolean).length;

  const clearAll = () => {
    setCategoriaSlug(null);
    setSubcategoria(null);
    setTecnologia(null);
    setQuery("");
  };

  function handleCategoriaChange(slug: string | null) {
    setCategoriaSlug(slug);
    setSubcategoria(null);
    setTecnologia(null);
  }

  const FilterContent = (
    <div className="flex flex-col gap-7">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-graphite-500">Categoría</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleCategoriaChange(null)}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-left text-xs font-medium transition-colors ${
              categoriaSlug === null
                ? "border-brand bg-brand text-white"
                : "border-mist-300 bg-white text-graphite-600 hover:border-brand/40"
            }`}
          >
            Todas las categorías
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoriaChange(categoriaSlug === cat.slug ? null : cat.slug)}
              className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-left text-xs font-medium transition-colors ${
                categoriaSlug === cat.slug
                  ? "border-brand bg-brand text-white"
                  : "border-mist-300 bg-white text-graphite-600 hover:border-brand/40"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {marcasPresentes.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-graphite-500">Marca</p>
          <div className="flex flex-col gap-2">
            {marcasPresentes.map(({ nombre, slug }) =>
              slug ? (
                <Link
                  key={nombre}
                  href={`/marca/${slug}`}
                  className="group flex items-center justify-between rounded-full border border-mist-300 bg-white px-3.5 py-1.5 text-xs font-medium text-graphite-600 transition-colors hover:border-brand/40 hover:text-brand"
                >
                  <span className="truncate">{nombre}</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ) : (
                <span
                  key={nombre}
                  className="rounded-full border border-mist-300 bg-white px-3.5 py-1.5 text-xs font-medium text-graphite-600"
                >
                  {nombre}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {subcategorias.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-graphite-500">Tipo de producto</p>
          <div className="flex flex-col gap-2">
            {subcategorias.map((s) => (
              <button
                key={s}
                onClick={() => setSubcategoria(subcategoria === s ? null : s)}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-left text-xs font-medium transition-colors ${
                  subcategoria === s
                    ? "border-brand bg-brand text-white"
                    : "border-mist-300 bg-white text-graphite-600 hover:border-brand/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {tecnologias.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-graphite-500">Tecnología</p>
          <div className="flex flex-col gap-2">
            {tecnologias.map((t) => (
              <button
                key={t}
                onClick={() => setTecnologia(tecnologia === t ? null : t)}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-left text-xs font-medium transition-colors ${
                  tecnologia === t
                    ? "border-brand bg-brand text-white"
                    : "border-mist-300 bg-white text-graphite-600 hover:border-brand/40"
                }`}
              >
                {TECNOLOGIA_LABEL[t] || t}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeCount > 0 && (
        <button onClick={clearAll} className="self-start text-xs font-semibold text-brand hover:underline">
          Limpiar filtros ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en todo el catálogo..."
            className="w-full rounded-full border border-mist-300 bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors focus:border-brand"
          />
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-mist-300 bg-white px-4 py-2.5 text-sm font-semibold text-graphite-700 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros {activeCount > 0 && `(${activeCount})`}
        </button>
        <p className="hidden text-sm text-graphite-500 lg:block">
          {filtrados.length} producto{filtrados.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin rounded-2xl border border-mist-200 bg-white p-6">
            {FilterContent}
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-graphite-500 lg:hidden">
            {filtrados.length} producto{filtrados.length !== 1 ? "s" : ""}
          </p>
          <ProductGrid productos={filtrados} />
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[70] transition-opacity duration-300 lg:hidden ${
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
        <div
          className={`absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto scrollbar-thin rounded-t-3xl bg-white p-6 transition-transform duration-300 ${
            drawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="font-heading text-base font-bold">Filtros</span>
            <button onClick={() => setDrawerOpen(false)} className="rounded-full p-2 hover:bg-mist-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          {FilterContent}
          <button
            onClick={() => setDrawerOpen(false)}
            className="mt-8 w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white"
          >
            Ver {filtrados.length} producto{filtrados.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
