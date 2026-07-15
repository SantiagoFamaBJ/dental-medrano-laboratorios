export type Tecnologia = "analogico" | "digital" | "mixto";
export type TipoLaboratorio = "tradicional" | "mixto" | "digital";

export interface Categoria {
  id: number;
  slug: string;
  nombre: string;
  subtitulo: string | null;
  descripcion: string | null;
  hero_image: string | null;
  icon: string | null;
  orden: number;
}

export interface Marca {
  id: number;
  slug: string;
  nombre: string;
  logo_url: string | null;
  sitio_url: string | null;
  orden: number;
}

export type TipoCatalogo = "producto" | "linea" | "coleccion";

/** Una combinacion especifica de variante (ej. tono + tipo + translucidez + medida) con su propio SKU. */
export interface VarianteMatriz {
  etiqueta: string;
  sku?: string;
  tipo?: string;
  translucidez?: string;
  tono?: string;
  medida?: string;
}

export interface Producto {
  id: number;
  slug: string;
  nombre: string;
  marca: string | null;
  categoria_slug: string;
  subcategoria: string | null;
  descripcion_corta: string | null;
  descripcion_completa: string | null;
  imagen: string | null;
  imagenes_adicionales: string[];
  aplicaciones: string[];
  beneficios: string[];
  caracteristicas: string[];
  variantes: string[];
  sku: string | null;
  tipo: TipoCatalogo;
  variantes_matriz: VarianteMatriz[];
  tecnologia: Tecnologia | null;
  tipo_laboratorio: TipoLaboratorio[];
  tags: string[];
  badges: string[];
  destacado: boolean;
  consulta_disponible: boolean;
  url_externa: string | null;
  activo: boolean;
  orden: number;
}

export interface Lead {
  id?: number;
  created_at?: string;
  nombre: string;
  laboratorio: string;
  provincia: string;
  ciudad: string;
  whatsapp: string;
  email: string;
  tipo_laboratorio: string;
  interes_principal: string;
  mensaje: string;
  atendido?: boolean;
}
