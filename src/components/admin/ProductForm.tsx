"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Categoria, Marca, Producto, VarianteAtributos, VarianteMatriz } from "@/lib/types";
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
const TIPOS_CATALOGO = [
  { value: "producto", label: "Producto" },
  { value: "linea", label: "Linea" },
  { value: "coleccion", label: "Coleccion" },
];

function nuevaVariante(): VarianteMatriz {
  return {
    etiqueta: "",
    sku: "",
    baseCode: "",
    atributos: { familia: "", tipo: "", translucidez: "", tono: "", medida: "" },
  };
}

export default function ProductForm({ producto }: ProductFormProps) {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagen, setImagen] = useState<string | null>(producto?.imagen || null);
  const [tipoLab, setTipoLab] = useState<string[]>(producto?.tipo_laboratorio || []);
  const [variantesMatriz, setVariantesMatriz] = useState<VarianteMatriz[]>(
    producto?.variantes_matriz?.length ? producto.variantes_matriz : []
  );

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
      sku: String(form.get("sku") || "") || null,
      tipo: String(form.get("tipo") || "producto"),
      variantes_matriz: variantesMatriz.filter((v) => v.etiqueta.trim()),
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
    if (!confirm(`Eliminar "${producto.nombre}"? Esta accion no se puede deshacer.`)) return;
    await supabase.from("labs_products").delete().eq("id", producto.id);
    router.push("/admin/productos");
    router.refresh();
  }

  function toggleTipoLab(tipo: string) {
    setTipoLab((prev) => (prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]));
  }

  function actualizarVariante(idx: number, campo: "etiqueta" | "sku" | "baseCode", valor: string) {
    setVariantesMatriz((prev) => prev.map((v, i) => (i === idx ? { ...v, [campo]: valor } : v)));
  }

  function actualizarAtributo(idx: number, campo: keyof VarianteAtributos, valor: string) {
    setVariantesMatriz((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, atributos: { ...v.atributos, [campo]: valor } } : v))
    );
  }

  function eliminarVariante(idx: number) {
    setVariantesMatriz((prev) => prev.filter((_, i) => i !== idx));
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
            <label className="mb-1.5 block text-sm font-medium text-graphite-700">Categoria</label>
            <select
              name="categoria_slug"
              defaultValue={producto?.categoria_slug || ""}
              required
              className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
            >
              <option value="">Selecciona una categoria</option>
              {categorias.map((c) => (
                <option key={c.slug} value={c.slug}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <TextField label="Subcategoria / linea" name="subcategoria" defaultValue={producto?.subcategoria} />

          <TextField
            label="SKU (codigo de producto)"
            name="sku"
            defaultValue={producto?.sku}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-700">Tipo de ficha</label>
            <select
              name="tipo"
              defaultValue={producto?.tipo || "producto"}
              className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
            >
              {TIPOS_CATALOGO.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-700">Tecnologia</label>
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
          <TextArea label="Descripcion corta" name="descripcion_corta" defaultValue={producto?.descripcion_corta} rows={2} />
          <TextArea label="Descripcion completa" name="descripcion_completa" defaultValue={producto?.descripcion_completa} rows={4} />
          <TextArea
            label="Aplicaciones (una por linea)"
            name="aplicaciones"
            defaultValue={arrayToLines(producto?.aplicaciones)}
            rows={3}
          />
          <TextArea
            label="Beneficios (uno por linea)"
            name="beneficios"
            defaultValue={arrayToLines(producto?.beneficios)}
            rows={3}
          />
          <TextArea
            label="Caracteristicas (una por linea)"
            name="caracteristicas"
            defaultValue={arrayToLines(producto?.caracteristicas)}
            rows={3}
          />
          <TextArea
            label="Variantes / presentaciones simples (una por linea, sin SKU propio)"
            name="variantes"
            defaultValue={arrayToLines(producto?.variantes)}
            rows={2}
          />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-graphite-700">
                Variantes con SKU propio (Familia / Tipo / Translucidez / Tonalidad / Presentacion)
              </label>
              <button
                type="button"
                onClick={() => setVariantesMatriz((prev) => [...prev, nuevaVariante()])}
                className="text-xs font-semibold text-brand hover:underline"
              >
                + Agregar variante
              </button>
            </div>
            <p className="mb-3 text-xs text-graphite-500">
              Usa esto solo si el producto tiene combinaciones reales con SKU propio (jerarquia Linea -&gt; Familia
              -&gt; Variante -&gt; SKU). Ej. Noritake EX-3: familia &quot;Body N&quot;, tonalidad &quot;A1&quot;,
              presentacion &quot;50g&quot;, SKU &quot;033512-A1000&quot;. Cargá solo codigos reales del catalogo de
              Dental Medrano, nunca inventados. Deja vacio el campo que no aplique.
            </p>
            {variantesMatriz.length === 0 && (
              <p className="text-xs text-graphite-400">No hay variantes con SKU cargadas.</p>
            )}
            <div className="space-y-3">
              {variantesMatriz.map((v, idx) => (
                <div key={idx} className="rounded-xl border border-mist-200 p-3">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <MiniField
                      placeholder="Etiqueta (ej: Body N . A1 . 50g)"
                      value={v.etiqueta}
                      onChange={(val) => actualizarVariante(idx, "etiqueta", val)}
                      className="col-span-2 sm:col-span-3"
                    />
                    <MiniField placeholder="SKU exacto" value={v.sku || ""} onChange={(val) => actualizarVariante(idx, "sku", val)} />
                    <MiniField
                      placeholder="Codigo base (ej: 033512)"
                      value={v.baseCode || ""}
                      onChange={(val) => actualizarVariante(idx, "baseCode", val)}
                    />
                    <MiniField
                      placeholder="Familia (ej: Body N)"
                      value={v.atributos?.familia || ""}
                      onChange={(val) => actualizarAtributo(idx, "familia", val)}
                    />
                    <MiniField
                      placeholder="Tipo"
                      value={v.atributos?.tipo || ""}
                      onChange={(val) => actualizarAtributo(idx, "tipo", val)}
                    />
                    <MiniField
                      placeholder="Translucidez"
                      value={v.atributos?.translucidez || ""}
                      onChange={(val) => actualizarAtributo(idx, "translucidez", val)}
                    />
                    <MiniField
                      placeholder="Tonalidad"
                      value={v.atributos?.tono || ""}
                      onChange={(val) => actualizarAtributo(idx, "tono", val)}
                    />
                    <MiniField
                      placeholder="Presentacion (ej: 50g)"
                      value={v.atributos?.medida || ""}
                      onChange={(val) => actualizarAtributo(idx, "medida", val)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarVariante(idx)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                  >
                    <Trash2 className="h-3 w-3" /> Quitar esta variante
                  </button>
                </div>
              ))}
            </div>
          </div>

          <TextArea label="Tags de busqueda (uno por linea)" name="tags" defaultValue={arrayToLines(producto?.tags)} rows={2} />
          <TextArea
            label="Badges (uno por linea, ej: Nuevo, Destacado, CAD/CAM)"
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

function MiniField({
  placeholder,
  value,
  onChange,
  className = "",
}: {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`rounded-lg border border-mist-300 px-3 py-2 text-xs outline-none focus:border-brand ${className}`}
    />
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
