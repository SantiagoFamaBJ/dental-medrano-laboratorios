export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491100000000";

/** Si el admin cargó un número propio en /admin/contenido, se usa ese; si no, el de las variables de entorno. */
export function resolveWhatsAppNumber(override?: string | null): string {
  const clean = override?.replace(/\D/g, "");
  return clean && clean.length > 0 ? clean : WHATSAPP_NUMBER;
}

export function buildWhatsAppUrl(mensaje: string, numero: string = WHATSAPP_NUMBER) {
  const texto = encodeURIComponent(mensaje);
  return `https://wa.me/${numero}?text=${texto}`;
}

export function mensajeConsultaProducto(nombreProducto: string, variante?: string) {
  const detalle = variante ? ` (${variante})` : "";
  return `Hola, quiero consultar por ${nombreProducto}${detalle}.`;
}

export function mensajeAsesorGeneral() {
  return "Hola, quiero hablar con un asesor de Dental Medrano sobre productos para mi laboratorio.";
}

export function mensajeTipoLaboratorio(tipo: string) {
  return `Hola, tengo un laboratorio ${tipo} y quiero recibir asesoramiento sobre productos de Dental Medrano.`;
}

/** Mensaje para consultar por varios productos a la vez (carrito de consulta). */
export function mensajeConsultaCarrito(
  items: { nombre: string; marca?: string | null; variante?: string }[]
) {
  const lista = items
    .map((i) => {
      const marca = i.marca ? ` (${i.marca})` : "";
      const variante = i.variante ? ` — Tonalidad/medida: ${i.variante}` : "";
      return `- ${i.nombre}${marca}${variante}`;
    })
    .join("\n");
  return `Hola, quiero consultar por estos productos:\n${lista}`;
}
