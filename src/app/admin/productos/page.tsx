"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, EyeOff, Trash2, Loader2 } from "lucide-react";
import { supabase, publicImageUrl } from "@/lib/supabase";
import type { Producto } from "@/lib/types";

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("labs_products").select("*").order("categoria_slug").order("orden");
    setProductos((data as Producto[]) || []);
    setLoading(false);
  }

  const filtrados = useMemo(() => {
    if (!query.trim()) return productos;
    const q = query.toLowerCase();
    return productos.filter((p) => `${p.nombre} ${p.marca} ${p.categoria_slug}`.toLowerCase().includes(q));
  }, [productos, query]);

  async function handleDelete(p: Producto) {
    if (!confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(p.id);
    await supabase.from("labs_products").delete().eq("id", p.id);
    setProductos((prev) => prev.filter((x) => x.id !== p.id));
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Productos</h1>
          <p className="mt-1 text-sm text-graphite-500">{productos.length} productos cargados</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Nuevo producto
        </Link>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full rounded-full border border-mist-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-mist-200 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-graphite-500">Cargando...</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-mist-200 bg-mist-50 text-xs uppercase tracking-wider text-graphite-500">
              <tr>
                <th className="px-5 py-3">Producto</th>
                <th className="hidden px-5 py-3 sm:table-cell">Marca</th>
                <th className="hidden px-5 py-3 md:table-cell">Categoría</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => {
                const img = publicImageUrl(p.imagen);
                return (
                  <tr key={p.id} className="border-b border-mist-100 last:border-0 hover:bg-mist-50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/productos/${p.id}`} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-mist-100">
                          {img ? (
                            <Image src={img} alt={p.nombre} width={40} height={40} className="h-full w-full object-contain p-0.5" />
                          ) : (
                            <span className="text-[10px] font-bold text-mist-300">DM</span>
                          )}
                        </div>
                        <span className="font-medium text-ink">{p.nombre}</span>
                      </Link>
                    </td>
                    <td className="hidden px-5 py-3 text-graphite-600 sm:table-cell">{p.marca}</td>
                    <td className="hidden px-5 py-3 text-graphite-600 md:table-cell">{p.categoria_slug}</td>
                    <td className="px-5 py-3">
                      {p.activo ? (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">Activo</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium text-graphite-500">
                          <EyeOff className="h-3 w-3" /> Oculto
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(p)}
                        disabled={deletingId === p.id}
                        aria-label={`Eliminar ${p.nombre}`}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        {deletingId === p.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
