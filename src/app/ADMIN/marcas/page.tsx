"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import { Plus, Trash2, Loader2, Upload } from "lucide-react";
import { supabase, publicImageUrl, LABS_IMAGES_BUCKET } from "@/lib/supabase";
import type { Marca } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminMarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("labs_brands").select("*").order("orden");
    setMarcas((data as Marca[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nombre = String(form.get("nombre") || "").trim();
    if (!nombre) return;
    setSaving(true);
    await supabase.from("labs_brands").insert({
      nombre,
      slug: slugify(nombre),
      orden: marcas.length + 1,
    });
    e.currentTarget.reset();
    setSaving(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar esta marca? Los productos que la referencian no se eliminan.")) return;
    await supabase.from("labs_brands").delete().eq("id", id);
    load();
  }

  async function handleLogoUpload(marca: Marca, file: File) {
    setUploadingId(marca.id);
    try {
      const ext = file.name.split(".").pop();
      const path = `marcas/${marca.slug}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from(LABS_IMAGES_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      await supabase.from("labs_brands").update({ logo_url: path }).eq("id", marca.id);
      setMarcas((prev) => prev.map((m) => (m.id === marca.id ? { ...m, logo_url: path } : m)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al subir el logo");
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Marcas</h1>
      <p className="mt-1 max-w-lg text-sm text-graphite-500">
        Se muestran en la sección de marcas de la landing con su logo (si todavía no lo cargaste, se ve el nombre como
        respaldo). Formato recomendado: PNG con fondo transparente.
      </p>

      <form onSubmit={handleAdd} className="mt-6 flex max-w-md gap-2">
        <input
          name="nombre"
          placeholder="Nombre de la marca"
          required
          className="flex-1 rounded-full border border-mist-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Agregar
        </button>
      </form>

      <div className="mt-6 max-w-xl overflow-hidden rounded-2xl border border-mist-200 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-graphite-500">Cargando...</p>
        ) : (
          <ul>
            {marcas.map((m) => {
              const logoUrl = publicImageUrl(m.logo_url);
              return (
                <li key={m.id} className="flex items-center justify-between gap-4 border-b border-mist-100 px-5 py-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <label className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-mist-300 bg-mist-50 hover:border-brand/50">
                      {uploadingId === m.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-graphite-500" />
                      ) : logoUrl ? (
                        <Image src={logoUrl} alt={m.nombre} width={56} height={56} className="h-full w-full object-contain p-1.5" />
                      ) : (
                        <Upload className="h-4 w-4 text-graphite-400" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload(m, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <span className="text-sm font-medium text-ink">{m.nombre}</span>
                  </div>
                  <button onClick={() => handleDelete(m.id)} className="text-graphite-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
