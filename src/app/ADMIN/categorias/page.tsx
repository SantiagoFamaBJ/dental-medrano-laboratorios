"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Categoria } from "@/lib/types";

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("labs_categories")
      .select("*")
      .order("orden")
      .then(({ data }) => {
        setCategorias((data as Categoria[]) || []);
        setLoading(false);
      });
  }, []);

  async function handleSave(cat: Categoria) {
    setSavingId(cat.id);
    await supabase
      .from("labs_categories")
      .update({ subtitulo: cat.subtitulo, descripcion: cat.descripcion })
      .eq("id", cat.id);
    setSavingId(null);
  }

  function updateField(id: number, field: "subtitulo" | "descripcion", value: string) {
    setCategorias((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Categorías</h1>
      <p className="mt-1 max-w-lg text-sm text-graphite-500">
        Las 5 categorías principales están fijas en el código (para mantener las URLs /laboratorios/...). Desde acá podés
        editar el copy que se muestra en la landing y en cada página de categoría.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-graphite-500">Cargando...</p>
      ) : (
        <div className="mt-6 space-y-5">
          {categorias.map((cat) => (
            <div key={cat.id} className="rounded-2xl border border-mist-200 bg-white p-6">
              <p className="font-heading text-base font-bold text-ink">{cat.nombre}</p>
              <p className="text-xs text-graphite-400">/laboratorios/{cat.slug}</p>

              <label className="mb-1.5 mt-4 block text-sm font-medium text-graphite-700">Subtítulo (hero)</label>
              <input
                value={cat.subtitulo || ""}
                onChange={(e) => updateField(cat.id, "subtitulo", e.target.value)}
                className="w-full rounded-xl border border-mist-300 px-4 py-2.5 text-sm outline-none focus:border-brand"
              />

              <label className="mb-1.5 mt-4 block text-sm font-medium text-graphite-700">Descripción</label>
              <textarea
                value={cat.descripcion || ""}
                onChange={(e) => updateField(cat.id, "descripcion", e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-mist-300 px-4 py-2.5 text-sm outline-none focus:border-brand"
              />

              <button
                onClick={() => handleSave(cat)}
                disabled={savingId === cat.id}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
              >
                {savingId === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
