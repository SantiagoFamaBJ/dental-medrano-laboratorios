export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491100000000";

export function resolveWhatsAppNumber(override?: string | null): string {
  const clean = override?.replace(/\D/g, "");
  return clean && clean.length > 0 ? clean : WHATSAPP_NUMBER;
}

export function buildWhatsAppUrl(mensaje: string, numero: string = WHATSAPP_NUMBER) {
  const texto = encodeURIComponent(mensaje);
  return `https://wa.me/${numero}?text=${texto}`;
}

interface ConsultaProductoOpts {
  /** Familia dentro de la linea (ej. "Body N"), si el producto se organiza por familias. */
  familia?: string;
  /** Tonalidad / presentacion exacta elegida. */
  variante?: string;
  /** SKU exacto de la variante elegida, o SKU del producto si no tiene variantes. */
  sku?: string;
}

/**
 * Mensaje de consulta para un solo producto. nombreProducto funciona como la "linea"
 * (ej. "Noritake EX-3"); familia/variante/SKU se agregan solo si ya fueron elegidos.
 */
export function mensajeConsultaProducto(nombreProducto: string, opts: ConsultaProductoOpts = {}) {
  const { familia, variante, sku } = opts;
  const detalles: string[] = [];
  if (familia) detalles.push(`Familia: ${familia}`);
  if (variante) detalles.push(`Tonalidad/Presentacion: ${variante}`);
  if (sku) detalles.push(`SKU: ${sku}`);
  const detalle = detalles.length > 0 ? `\n${detalles.join("\n")}` : "";
  return `Hola, quiero consultar por ${nombreProducto}.${detalle}`;
}

export function mensajeAsesorGeneral() {
  return "Hola, quiero hablar con un asesor de Dental Medrano sobre productos para mi laboratorio.";
}

export function mensajeTipoLaboratorio(tipo: string) {
  return `Hola, tengo un laboratorio ${tipo} y quiero recibir asesoramiento sobre productos de Dental Medrano.`;
}

interface ItemConsultaCarrito {
  nombre: string;
  marca?: string | null;
  familia?: string;
  variante?: string;
  sku?: string;
}

export function mensajeConsultaCarrito(items: ItemConsultaCarrito[]) {
  const lista = items
    .map((i) => {
      const marca = i.marca ? ` (${i.marca})` : "";
      const familia = i.familia ? ` — Familia: ${i.familia}` : "";
      const variante = i.variante ? ` — Tonalidad/Presentacion: ${i.variante}` : "";
      const sku = i.sku ? ` — SKU: ${i.sku}` : "";
      return `- ${i.nombre}${marca}${familia}${variante}${sku}`;
    })
    .join("\n");
  return `Hola, quiero consultar por estos productos:\n${lista}`;
}
