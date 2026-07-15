import { supabase, publicImageUrl } from "./supabase";

export const SITE_LOGO_KEY = "site_logo";
export const WHATSAPP_NUMBER_KEY = "whatsapp_numero";

/**
 * Textos editables del sitio público (home + contacto).
 * Cada campo tiene un valor por defecto que coincide con la copy original,
 * de forma que si todavía no se cargó nada en Supabase el sitio se ve igual.
 *
 * Los textos admiten resaltado en color marca envolviendo palabras en
 * doble asterisco, por ejemplo: "el **futuro** del laboratorio".
 */

export interface SiteContentField {
  key: string;
  label: string;
  section: string;
  multiline?: boolean;
  hint?: string;
}

export const SITE_CONTENT_FIELDS: SiteContentField[] = [
  // Menú superior (header)
  { key: "nav_productos", label: "Item 'Productos'", section: "Menú superior" },
  { key: "nav_soluciones", label: "Item 'Soluciones' (ancla a categorías del home)", section: "Menú superior" },
  { key: "nav_marcas", label: "Item 'Marcas'", section: "Menú superior" },
  { key: "nav_tecnologia", label: "Item 'Tecnología' (enlace a laboratorio digital)", section: "Menú superior" },
  { key: "nav_contacto", label: "Item 'Contacto'", section: "Menú superior" },

  // Hero
  { key: "hero_eyebrow", label: "Etiqueta superior", section: "Hero" },
  { key: "hero_title", label: "Título principal", section: "Hero", multiline: true, hint: "Usá **palabra** para resaltarla en naranja" },
  { key: "hero_subtitle", label: "Subtítulo", section: "Hero", multiline: true },
  { key: "hero_cta_primary", label: "Botón principal", section: "Hero" },
  { key: "hero_cta_secondary", label: "Botón secundario", section: "Hero" },
  { key: "hero_stat1_valor", label: "Estadística 1 - valor", section: "Hero" },
  { key: "hero_stat1_label", label: "Estadística 1 - texto", section: "Hero" },
  { key: "hero_stat2_valor", label: "Estadística 2 - valor", section: "Hero" },
  { key: "hero_stat2_label", label: "Estadística 2 - texto", section: "Hero" },
  { key: "hero_stat3_valor", label: "Estadística 3 - valor", section: "Hero" },
  { key: "hero_stat3_label", label: "Estadística 3 - texto", section: "Hero" },
  { key: "hero_card1_titulo", label: "Tarjeta flotante 1 - título", section: "Hero" },
  { key: "hero_card1_texto", label: "Tarjeta flotante 1 - texto", section: "Hero" },
  { key: "hero_card2_titulo", label: "Tarjeta flotante 2 - título", section: "Hero" },
  { key: "hero_card2_texto", label: "Tarjeta flotante 2 - texto", section: "Hero" },
  { key: "hero_card3_titulo", label: "Tarjeta flotante 3 - título", section: "Hero" },
  { key: "hero_card3_texto", label: "Tarjeta flotante 3 - texto", section: "Hero" },

  // Soluciones (categorías)
  { key: "soluciones_eyebrow", label: "Etiqueta superior", section: "Soluciones" },
  { key: "soluciones_titulo", label: "Título", section: "Soluciones" },
  { key: "soluciones_subtitulo", label: "Subtítulo", section: "Soluciones", multiline: true },

  // Tipo de laboratorio
  { key: "tipolab_eyebrow", label: "Etiqueta superior", section: "Tipo de laboratorio" },
  { key: "tipolab_titulo", label: "Título", section: "Tipo de laboratorio" },
  { key: "tipolab_subtitulo", label: "Subtítulo", section: "Tipo de laboratorio", multiline: true },
  { key: "tipolab_perfil1_titulo", label: "Perfil 1 - título", section: "Tipo de laboratorio" },
  { key: "tipolab_perfil1_texto", label: "Perfil 1 - texto", section: "Tipo de laboratorio" },
  { key: "tipolab_perfil2_titulo", label: "Perfil 2 - título", section: "Tipo de laboratorio" },
  { key: "tipolab_perfil2_texto", label: "Perfil 2 - texto", section: "Tipo de laboratorio" },
  { key: "tipolab_perfil3_titulo", label: "Perfil 3 - título", section: "Tipo de laboratorio" },
  { key: "tipolab_perfil3_texto", label: "Perfil 3 - texto", section: "Tipo de laboratorio" },

  // Evolución tecnológica
  { key: "evolucion_eyebrow", label: "Etiqueta superior", section: "Evolución tecnológica" },
  { key: "evolucion_titulo", label: "Título", section: "Evolución tecnológica" },
  { key: "evolucion_subtitulo", label: "Subtítulo", section: "Evolución tecnológica", multiline: true },
  { key: "evolucion_cta", label: "Texto del botón", section: "Evolución tecnológica" },

  // Marcas
  { key: "marcas_eyebrow", label: "Etiqueta superior", section: "Marcas" },
  { key: "marcas_titulo", label: "Título", section: "Marcas" },

  // Por qué Dental Medrano
  { key: "porque_eyebrow", label: "Etiqueta superior", section: "Por qué Dental Medrano" },
  { key: "porque_titulo", label: "Título", section: "Por qué Dental Medrano" },
  { key: "porque_beneficio1_titulo", label: "Beneficio 1 - título", section: "Por qué Dental Medrano" },
  { key: "porque_beneficio1_texto", label: "Beneficio 1 - texto", section: "Por qué Dental Medrano" },
  { key: "porque_beneficio2_titulo", label: "Beneficio 2 - título", section: "Por qué Dental Medrano" },
  { key: "porque_beneficio2_texto", label: "Beneficio 2 - texto", section: "Por qué Dental Medrano" },
  { key: "porque_beneficio3_titulo", label: "Beneficio 3 - título", section: "Por qué Dental Medrano" },
  { key: "porque_beneficio3_texto", label: "Beneficio 3 - texto", section: "Por qué Dental Medrano" },
  { key: "porque_beneficio4_titulo", label: "Beneficio 4 - título", section: "Por qué Dental Medrano" },
  { key: "porque_beneficio4_texto", label: "Beneficio 4 - texto", section: "Por qué Dental Medrano" },
  { key: "porque_beneficio5_titulo", label: "Beneficio 5 - título", section: "Por qué Dental Medrano" },
  { key: "porque_beneficio5_texto", label: "Beneficio 5 - texto", section: "Por qué Dental Medrano" },
  { key: "porque_beneficio6_titulo", label: "Beneficio 6 - título", section: "Por qué Dental Medrano" },
  { key: "porque_beneficio6_texto", label: "Beneficio 6 - texto", section: "Por qué Dental Medrano" },

  // CTA final del home
  { key: "cta_titulo", label: "Título", section: "Llamado a la acción final" },
  { key: "cta_subtitulo", label: "Subtítulo", section: "Llamado a la acción final", multiline: true },
  { key: "cta_boton_primario", label: "Botón principal", section: "Llamado a la acción final" },
  { key: "cta_boton_whatsapp", label: "Botón de WhatsApp", section: "Llamado a la acción final" },

  // Contacto
  { key: "contacto_eyebrow", label: "Etiqueta superior", section: "Página de contacto" },
  { key: "contacto_titulo", label: "Título", section: "Página de contacto" },
  { key: "contacto_subtitulo", label: "Subtítulo", section: "Página de contacto", multiline: true },
  { key: "contacto_lateral_titulo", label: "Título columna lateral", section: "Página de contacto" },
  { key: "contacto_lateral_texto", label: "Texto columna lateral", section: "Página de contacto" },
  { key: "contacto_email", label: "Email de contacto", section: "Página de contacto" },
  { key: "contacto_cobertura", label: "Texto de cobertura", section: "Página de contacto" },
];

export const DEFAULT_SITE_CONTENT: Record<string, string> = {
  nav_productos: "Productos",
  nav_soluciones: "Categorías",
  nav_marcas: "Marcas",
  nav_tecnologia: "Digital",
  nav_contacto: "Contacto",

  hero_eyebrow: "Para laboratorios protéticos y técnicos dentales",
  hero_title: "Soluciones para el laboratorio dental del **presente** y del **futuro**.",
  hero_subtitle: "Tecnología, materiales e insumos para laboratorios tradicionales, mixtos y digitales.",
  hero_cta_primary: "Explorar soluciones",
  hero_cta_secondary: "Hablar con un asesor",
  hero_stat1_valor: "+100",
  hero_stat1_label: "Productos y líneas",
  hero_stat2_valor: "5",
  hero_stat2_label: "Soluciones especializadas",
  hero_stat3_valor: "9+",
  hero_stat3_label: "Marcas nacionales e internacionales",
  hero_card1_titulo: "Flujo CAD/CAM",
  hero_card1_texto: "Fresado de precisión",
  hero_card2_titulo: "Impresión 3D",
  hero_card2_texto: "Modelos y guías",
  hero_card3_titulo: "Estratificación",
  hero_card3_texto: "Cerámica de alta estética",

  soluciones_eyebrow: "Nuestras soluciones",
  soluciones_titulo: "Encontrá la solución para tu laboratorio",
  soluciones_subtitulo:
    "Cinco grandes soluciones que cubren todo el flujo de trabajo del laboratorio protético, del más tradicional al más digital.",

  tipolab_eyebrow: "Tu punto de partida",
  tipolab_titulo: "¿Qué tipo de laboratorio tenés?",
  tipolab_subtitulo:
    "Sin importar el nivel tecnológico de tu laboratorio, tenemos una solución pensada para tu flujo de trabajo.",
  tipolab_perfil1_titulo: "Tradicional",
  tipolab_perfil1_texto: "Materiales, herramientas y consumibles para el trabajo diario.",
  tipolab_perfil2_titulo: "Mixto",
  tipolab_perfil2_texto: "Combiná procesos tradicionales con nuevas soluciones digitales.",
  tipolab_perfil3_titulo: "Digital",
  tipolab_perfil3_texto: "Impresión 3D, CAD/CAM y tecnología para un flujo completamente digital.",

  evolucion_eyebrow: "Evolución tecnológica",
  evolucion_titulo: "Del flujo analógico al digital",
  evolucion_subtitulo:
    "No todos los laboratorios necesitan el mismo nivel tecnológico. Te acompañamos en cualquier etapa de tu evolución.",
  evolucion_cta: "Encontrá la solución para tu laboratorio",

  marcas_eyebrow: "Marcas",
  marcas_titulo: "Marcas nacionales e internacionales",

  porque_eyebrow: "Por qué Dental Medrano",
  porque_titulo: "Un proveedor integral para tu laboratorio",
  porque_beneficio1_titulo: "Amplia cartera",
  porque_beneficio1_texto: "Soluciones para distintos tipos de laboratorio y flujos de trabajo.",
  porque_beneficio2_titulo: "Tecnología",
  porque_beneficio2_texto: "Equipamiento y materiales para avanzar hacia la odontología digital.",
  porque_beneficio3_titulo: "Marcas reconocidas",
  porque_beneficio3_texto: "Productos de fabricantes nacionales e internacionales.",
  porque_beneficio4_titulo: "Asesoramiento",
  porque_beneficio4_texto: "Acompañamiento para encontrar la solución adecuada para cada laboratorio.",
  porque_beneficio5_titulo: "Cobertura nacional",
  porque_beneficio5_texto: "Atención a laboratorios de distintas regiones de Argentina.",
  porque_beneficio6_titulo: "Soluciones integrales",
  porque_beneficio6_texto: "Desde el consumo diario hasta el equipamiento tecnológico.",

  cta_titulo: "¿Qué necesita hoy tu laboratorio?",
  cta_subtitulo:
    "Contanos cómo trabajás y te ayudamos a encontrar materiales, tecnología y soluciones para tu flujo de trabajo.",
  cta_boton_primario: "Hablar con un asesor",
  cta_boton_whatsapp: "Consultar por WhatsApp",

  contacto_eyebrow: "Contacto",
  contacto_titulo: "¿Qué necesita hoy tu laboratorio?",
  contacto_subtitulo:
    "Contanos cómo trabajás y te ayudamos a encontrar materiales, tecnología y soluciones para tu flujo de trabajo.",
  contacto_lateral_titulo: "Hablemos directamente",
  contacto_lateral_texto: "Si preferís una respuesta inmediata, escribinos por WhatsApp.",
  contacto_email: "info@dental-medrano.com.ar",
  contacto_cobertura: "Atención a laboratorios de toda Argentina.",
};

export async function getSiteContent(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase.from("labs_site_content").select("key, value");
    if (error || !data) {
      return { ...DEFAULT_SITE_CONTENT };
    }
    const overrides: Record<string, string> = {};
    for (const row of data as { key: string; value: string | null }[]) {
      if (row.value !== null && row.value !== "") {
        overrides[row.key] = row.value;
      }
    }
    return { ...DEFAULT_SITE_CONTENT, ...overrides };
  } catch {
    return { ...DEFAULT_SITE_CONTENT };
  }
}

export function c(content: Record<string, string>, key: keyof typeof DEFAULT_SITE_CONTENT): string {
  return content[key] ?? DEFAULT_SITE_CONTENT[key] ?? "";
}

/** Devuelve la URL pública del logo subido desde el admin, o null si todavía no se cargó ninguno. */
export async function getSiteLogoUrl(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("labs_site_content")
      .select("value")
      .eq("key", SITE_LOGO_KEY)
      .maybeSingle();
    if (error || !data?.value) return null;
    return publicImageUrl(data.value);
  } catch {
    return null;
  }
}
