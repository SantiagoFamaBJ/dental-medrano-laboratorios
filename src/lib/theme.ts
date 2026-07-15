import { supabase } from "./supabase";

/**
 * Colores editables desde el admin. Cada token controla una variable CSS
 * (definida en tailwind.config.ts como fallback de cada color de Tailwind),
 * así que cambiarlos acá cambia el color en TODOS los textos y fondos del
 * sitio que usan esa clase (texto-ink, texto-graphite-500, texto-mist-400,
 * bg-brand, etc.) sin necesidad de tocar código ni recompilar.
 *
 * Importante: esto se llama desde el layout raíz, así que nunca debe tirar
 * una excepción (si Supabase falla o no responde, el sitio tiene que seguir
 * viéndose con los colores por defecto en vez de romperse entero).
 */

export interface ThemeToken {
  key: string; // clave en labs_site_content (prefijo color_)
  cssVar: string; // variable CSS que sobreescribe
  label: string;
  group: string;
  defaultHex: string;
}

export const THEME_TOKENS: ThemeToken[] = [
  // Marca
  { key: "color_brand", cssVar: "--color-brand", label: "Naranja marca", group: "Marca", defaultHex: "#F15922" },
  { key: "color_brand_dark", cssVar: "--color-brand-dark", label: "Naranja marca (oscuro, hover)", group: "Marca", defaultHex: "#D6491A" },
  { key: "color_brand_light", cssVar: "--color-brand-light", label: "Naranja marca (claro)", group: "Marca", defaultHex: "#FF7A45" },
  { key: "color_cyan_accent", cssVar: "--color-cyan-accent", label: "Celeste de acento", group: "Marca", defaultHex: "#3BC7D1" },

  // Fondos oscuros (header oscuro, hero, footer, CTA) y sus textos
  { key: "color_ink", cssVar: "--color-ink", label: "Fondo oscuro principal / títulos", group: "Fondos oscuros", defaultHex: "#14171A" },
  { key: "color_ink_soft", cssVar: "--color-ink-soft", label: "Fondo oscuro secundario", group: "Fondos oscuros", defaultHex: "#22262B" },
  { key: "color_mist_300", cssVar: "--color-mist-300", label: "Texto claro sobre fondo oscuro", group: "Fondos oscuros", defaultHex: "#D3D7DC" },
  { key: "color_mist_400", cssVar: "--color-mist-400", label: "Texto secundario sobre fondo oscuro", group: "Fondos oscuros", defaultHex: "#9AA0A8" },

  // Fondos claros (secciones blancas / grises) y sus textos
  { key: "color_mist_50", cssVar: "--color-mist-50", label: "Fondo gris muy claro", group: "Fondos claros", defaultHex: "#FAFAFA" },
  { key: "color_mist_100", cssVar: "--color-mist-100", label: "Fondo gris claro", group: "Fondos claros", defaultHex: "#F4F5F6" },
  { key: "color_mist_200", cssVar: "--color-mist-200", label: "Bordes y separadores", group: "Fondos claros", defaultHex: "#E7E9EC" },
  { key: "color_graphite_400", cssVar: "--color-graphite-400", label: "Texto gris claro", group: "Fondos claros", defaultHex: "#6B7280" },
  { key: "color_graphite_500", cssVar: "--color-graphite-500", label: "Texto gris (principal)", group: "Fondos claros", defaultHex: "#454B53" },
  { key: "color_graphite_600", cssVar: "--color-graphite-600", label: "Texto gris oscuro", group: "Fondos claros", defaultHex: "#2E333A" },
  { key: "color_graphite_700", cssVar: "--color-graphite-700", label: "Texto gris muy oscuro", group: "Fondos claros", defaultHex: "#22262B" },
];

export async function getThemeOverrides(): Promise<Record<string, string>> {
  try {
    const keys = THEME_TOKENS.map((t) => t.key);
    const { data, error } = await supabase.from("labs_site_content").select("key, value").in("key", keys);
    if (error || !data) return {};
    const overrides: Record<string, string> = {};
    for (const row of data as { key: string; value: string | null }[]) {
      if (row.value) overrides[row.key] = row.value;
    }
    return overrides;
  } catch {
    return {};
  }
}

export async function getThemeStyleTag(): Promise<string> {
  try {
    const overrides = await getThemeOverrides();
    const declarations = THEME_TOKENS.filter((t) => overrides[t.key]).map((t) => `${t.cssVar}: ${overrides[t.key]};`);
    if (declarations.length === 0) return "";
    return `:root { ${declarations.join(" ")} }`;
  } catch {
    return "";
  }
}
