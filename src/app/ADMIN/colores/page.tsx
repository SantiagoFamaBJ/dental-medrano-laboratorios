"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Save, RotateCcw, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { THEME_TOKENS } from "@/lib/theme";

export default function AdminColoresPage() {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(THEME_TOKENS.map((t) => [t.key, t.defaultHex]))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const keys = THEME_TOKENS.map((t) => t.key);
      const { data, error } = await supabase.from("labs_site_content").select("key, value").in("key", keys);
      if (!error && data) {
        const overrides: Record<string, string> = {};
        for (const row of data as { key: string; value: string | null }[]) {
          if (row.value) overrides[row.key] = row.value;
        }
        setValues((prev) => ({ ...prev, ...overrides }));
      }
      setLoading(false);
    }
    load();
  }, []);

  const grupos = useMemo(() => {
    const orden: string[] = [];
    const map: Record<string, typeof THEME_TOKENS> = {};
    for (const token of THEME_TOKENS) {
      if (!map[token.group]) {
        map[token.group] = [];
        orden.push(token.group);
      }
      map[token.group].push(token);
    }
    return orden.map((group) => ({ group, tokens: map[group] }));
  }, []);

  function handleChange(key: string, hex: string) {
    setValues((prev) => ({ ...prev, [key]: hex }));
    setSaved(false);
  }

  function handleReset(key: string, defaultHex: string) {
    setValues((prev) => ({ ...prev, [key]: defaultHex }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const rows = THEME_TOKENS.map((t) => ({ key: t.key, value: values[t.key] || t.defaultHex }));
    const { error } = await supabase.from("labs_site_content").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      // Recargamos para que los cambios de color se vean reflejados de inmediato en todo el sitio.
      window.location.reload();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-graphite-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando colores...
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Colores del sitio</h1>
          <p className="mt-1 max-w-2xl text-sm text-graphite-500">
            Estos colores controlan todos los textos y fondos del sitio (incluido este panel). Cambiar uno lo cambia en
            todas las páginas donde se usa.
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

      <div className="mt-8 space-y-10">
        {grupos.map(({ group, tokens }) => (
          <div key={group}>
            <h2 className="font-heading text-base font-bold text-ink">{group}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tokens.map((token) => (
                <div key={token.key} className="flex items-center gap-3 rounded-xl border border-mist-200 bg-white p-3">
                  <label className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-mist-300">
                    <input
                      type="color"
                      value={values[token.key] || token.defaultHex}
                      onChange={(e) => handleChange(token.key, e.target.value)}
                      className="absolute -left-1 -top-1 h-12 w-12 cursor-pointer"
                    />
                  </label>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-graphite-700">{token.label}</p>
                    <input
                      value={values[token.key] || token.defaultHex}
                      onChange={(e) => handleChange(token.key, e.target.value)}
                      className="mt-0.5 w-full bg-transparent font-mono text-xs text-graphite-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReset(token.key, token.defaultHex)}
                    className="shrink-0 rounded-full p-1.5 text-graphite-400 hover:bg-mist-100 hover:text-brand"
                    title="Restablecer color original"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
