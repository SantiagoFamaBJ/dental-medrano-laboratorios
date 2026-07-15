"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Save, RotateCcw, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SITE_CONTENT_FIELDS, DEFAULT_SITE_CONTENT, SITE_LOGO_KEY, WHATSAPP_NUMBER_KEY } from "@/lib/site-content";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import ImageUploader from "@/components/ImageUploader";

export default function AdminContenidoPage() {
  const [values, setValues] = useState<Record<string, string>>({ ...DEFAULT_SITE_CONTENT });
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [logoSaving, setLogoSaving] = useState(false);
  const [whatsappNumero, setWhatsappNumero] = useState("");
  const [whatsappSaving, setWhatsappSaving] = useState(false);
  const [whatsappSaved, setWhatsappSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("labs_site_content").select("key, value");
      if (!error && data) {
        const overrides: Record<string, string> = {};
        for (const row of data as { key: string; value: string | null }[]) {
          if (row.value !== null) overrides[row.key] = row.value;
        }
        setValues({ ...DEFAULT_SITE_CONTENT, ...overrides });
        setLogoPath(overrides[SITE_LOGO_KEY] ?? null);
        setWhatsappNumero(overrides[WHATSAPP_NUMBER_KEY] ?? "");
      }
      setLoading(false);
    }
    load();
  }, []);

  const secciones = useMemo(() => {
    const orden: string[] = [];
    const grupos: Record<string, typeof SITE_CONTENT_FIELDS> = {};
    for (const field of SITE_CONTENT_FIELDS) {
      if (!grupos[field.section]) {
        grupos[field.section] = [];
        orden.push(field.section);
      }
      grupos[field.section].push(field);
    }
    return orden.map((section) => ({ section, fields: grupos[section] }));
  }, []);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleReset(key: string) {
    setValues((prev) => ({ ...prev, [key]: DEFAULT_SITE_CONTENT[key] }));
    setSaved(false);
  }

  async function handleLogoChange(path: string | null) {
    setLogoSaving(true);
    setLogoPath(path);
    await supabase.from("labs_site_content").upsert({ key: SITE_LOGO_KEY, value: path ?? "" }, { onConflict: "key" });
    setLogoSaving(false);
  }

  async function handleWhatsappBlur() {
    setWhatsappSaving(true);
    await supabase
      .from("labs_site_content")
      .upsert({ key: WHATSAPP_NUMBER_KEY, value: whatsappNumero.replace(/\D/g, "") }, { onConflict: "key" });
    setWhatsappSaving(false);
    setWhatsappSaved(true);
    setTimeout(() => setWhatsappSaved(false), 2000);
  }

  async function handleSave() {
    setSaving(true);
    const rows = SITE_CONTENT_FIELDS.map((field) => ({
      key: field.key,
      value: values[field.key] ?? "",
    }));
    const { error } = await supabase.from("labs_site_content").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-graphite-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando textos...
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Textos del sitio</h1>
          <p className="mt-1 max-w-2xl text-sm text-graphite-500">
            Editá los textos del home y de la página de contacto. Donde el texto lo permite, podés escribir{" "}
            <code className="rounded bg-mist-100 px-1 py-0.5 text-xs">**palabra**</code> para resaltarla en naranja.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Guardado" : "Guardar cambios"}
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-mist-200 bg-white p-6">
        <h2 className="font-heading text-base font-bold text-ink">Configuración general</h2>
        <p className="mt-1 text-sm text-graphite-500">
          Estos cambios se guardan solos, no hace falta tocar &quot;Guardar cambios&quot;.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <ImageUploader label="Logo (PNG con fondo transparente recomendado)" value={logoPath} onChange={handleLogoChange} folder="logo" />
              {logoSaving && <Loader2 className="h-4 w-4 animate-spin text-graphite-400" />}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-graphite-700">Número de WhatsApp</p>
            <div className="flex items-center gap-2">
              <input
                value={whatsappNumero}
                onChange={(e) => setWhatsappNumero(e.target.value)}
                onBlur={handleWhatsappBlur}
                placeholder={WHATSAPP_NUMBER}
                className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
              />
              {whatsappSaving && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-graphite-400" />}
              {whatsappSaved && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />}
            </div>
            <p className="mt-1 text-xs text-graphite-400">
              Código de país + área + número, sin espacios ni signo +. Ej: 5491123456789. Se usa en todos los botones de
              WhatsApp del sitio.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {secciones.map(({ section, fields }) => (
          <div key={section}>
            <h2 className="font-heading text-base font-bold text-ink">{section}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.key} className={field.multiline ? "sm:col-span-2" : ""}>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <label htmlFor={field.key} className="text-sm font-medium text-graphite-700">
                      {field.label}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleReset(field.key)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-graphite-400 hover:text-brand"
                      title="Restablecer al texto original"
                    >
                      <RotateCcw className="h-3 w-3" /> Original
                    </button>
                  </div>
                  {field.multiline ? (
                    <textarea
                      id={field.key}
                      value={values[field.key] ?? ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
                    />
                  ) : (
                    <input
                      id={field.key}
                      value={values[field.key] ?? ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
                    />
                  )}
                  {field.hint && <p className="mt-1 text-xs text-graphite-400">{field.hint}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-mist-200 bg-white/90 px-5 py-3 backdrop-blur sm:hidden">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
