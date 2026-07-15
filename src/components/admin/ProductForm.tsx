"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Categoria, Marca, Producto } from "@/lib/types";
import ImageUploader from "@/components/ImageUploader";

interface ProductFormProps {
  producto?: Producto;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function arrayToLines(arr: string[] | null | undefined): string {
  return (arr || []).join("\n");
}

const TECNOLOGIAS = ["analogico", "mixto", "digital"];
const TIPOS_LABORATORIO = ["tradicional", "mixto", "digital"];

export default function ProductForm({ producto }: ProductFormProps) {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagen, setImagen] = useState<string | null>(producto?.imagen || null);
  const [tipoLab, setTipoLab] = useState<string[]>(producto?.tipo_laboratorio || []);

  useEffect(() => {
    supabase.from("labs_categories").select("*").order("orden").then(({ data }) => setCategorias(data || []));
    supabase.from("labs_brands").select("*").order("orden").then(({ data }) => setMarcas(data || []));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const nombre = String(form.get("nombre") || "");

    const payload = {
      slug: producto?.slug || slugify(nombre),
      nombre,
      marca: String(form.get("marca") || ""),
      categoria_slug: String(form.get("categoria_slug") || ""),
      subcategoria: String(form.get("subcategoria") || ""),
      descripcion_corta: String(form.get("descripcion_corta") || ""),
      descripcion_completa: String(form.get("descripcion_completa") || ""),
      imagen,
      aplicaciones: linesToArray(String(form.get("aplicaciones") || "")),
      beneficios: linesToArray(String(form.get("beneficios") || "")),
      caracteristicas: linesToArray(String(form.get("caracteristicas") || "")),
      variantes: linesToArray(String(form.get("variantes") || "")),
      tecnologia: String(form.get("tecnologia") || "") || null,
      tipo_laboratorio: tipoLab,
      tags: linesToArray(String(form.get("tags") || "")),
      badges: linesToArray(String(form.get("badges") || "")),
      destacado: form.get("destacado") === "on",
      activo: form.get("activo") === "on",
      updated_at: new Date().toISOString(),
    };

    const query = producto
      ? supabase.from("labs_products").update(payload).eq("id", producto.id)
      : supabase.from("labs_products").insert(payload);

    const { error: saveError } = await query;
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    router.push("/admin/productos");
    router.refresh();
  }

  async function handleDelete() {
    if (!producto) return;
    if (!confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return;
    await supabase.from("labs_products").delete().eq("id", producto.id);
    router.push("/admin/productos");
    router.refresh();
  }

  function toggleTipoLab(tipo: string) {
    setTipoLab((prev) => (prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="rounded-2xl border border-mist-200 bg-white p-6 sm:p-8">
        <ImageUploader label="Imagen principal" value={imagen} onChange={setImagen} />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField label="Nombre del producto" name="nombre" defaultValue={producto?.nombre} required />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-700">Marca</label>
            <input
              name="marca"
              list="marcas-list"
              defaultValue={producto?.marca || ""}
              className="w-full rounded-xl border border-mist-300 px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
            <datalist id="marcas-list">
              {marcas.map((m) => (
                <option key={m.slug} value={m.nombre} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-700">Categoría</label>
            <select
              name="categoria_slug"
              defaultValue={producto?.categoria_slug || ""}
              required
              className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
            >
              <option value="">Seleccioná una categoría</option>
              {categorias.map((c) => (
                <option key={c.slug} value={c.slug}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <TextField label="Subcategoría / línea" name="subcategoria" defaultValue={producto?.subcategoria} />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-700">Tecnología</label>
            <select
              name="tecnologia"
              defaultValue={producto?.tecnologia || ""}
              className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
            >
              <option value="">Sin especificar</option>
              {TECNOLOGIAS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-700">Tipo de laboratorio</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {TIPOS_LABORATORIO.map((tipo) => (
                <button
                  type="button"
                  key={tipo}
                  onClick={() => toggleTipoLab(tipo)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    tipoLab.includes(tipo) ? "border-brand bg-brand text-white" : "border-mist-300 text-graphite-600"
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5">
          <TextArea label="Descripción corta" name="descripcion_corta" defaultValue={producto?.descripcion_corta} rows={2} />
          <TextArea label="Descripción completa" name="descripcion_completa" defaultValue={producto?.descripcion_completa} rows={4} />
          <TextArea
            label="Aplicaciones (una por línea)"
            name="aplicaciones"
            defaultValue={arrayToLines(producto?.aplicaciones)}
            rows={3}
          />
          <TextArea
            label="Beneficios (uno por línea)"
            name="beneficios"
            defaultValue={arrayToLines(producto?.beneficios)}
            rows={3}
          />
          <TextArea
            label="Características (una por línea)"
            name="caracteristicas"
            defaultValue={arrayToLines(producto?.caracteristicas)}
            rows={3}
          />
          <TextArea
            label="Variantes / presentaciones (una por línea)"
            name="variantes"
            defaultValue={arrayToLines(producto?.variantes)}
            rows={2}
          />
          <TextArea label="Tags de búsqueda (uno por línea)" name="tags" defaultValue={arrayToLines(producto?.tags)} rows={2} />
          <TextArea
            label="Badges (uno por línea, ej: Nuevo, Destacado, CAD/CAM)"
            name="badges"
            defaultValue={arrayToLines(producto?.badges)}
            rows={2}
          />
        </div>

        <div className="mt-6 flex gap-6">
          <label className="flex items-center gap-2 text-sm text-graphite-700">
            <input type="checkbox" name="destacado" defaultChecked={producto?.destacado} className="h-4 w-4 accent-brand" />
            Destacado
          </label>
          <label className="flex items-center gap-2 text-sm text-graphite-700">
            <input type="checkbox" name="activo" defaultChecked={producto?.activo ?? true} className="h-4 w-4 accent-brand" />
            Activo (visible en el sitio)
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {producto ? "Guardar cambios" : "Crear producto"}
          </button>

          {producto && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
            >
              <Trash2 className="h-4 w-4" /> Eliminar producto
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function TextField({ label, name, defaultValue, required }: { label: string; name: string; defaultValue?: string | null; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-graphite-700">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue || ""}
        required={required}
        className="w-full rounded-xl border border-mist-300 px-4 py-2.5 text-sm outline-none focus:border-brand"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-graphite-700">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue || ""}
        rows={rows}
        className="w-full rounded-xl border border-mist-300 px-4 py-2.5 text-sm outline-none focus:border-brand"
      />
    </div>
  );
}
