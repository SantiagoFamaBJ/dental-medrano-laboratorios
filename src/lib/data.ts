import { supabase } from "./supabase";
import type { Categoria, Marca, Producto } from "./types";

export async function getCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from("labs_categories")
    .select("*")
    .order("orden", { ascending: true });
  if (error) {
    console.error("Error cargando categorías:", error.message);
    return [];
  }
  return data as Categoria[];
}

export async function getCategoria(slug: string): Promise<Categoria | null> {
  const { data, error } = await supabase
    .from("labs_categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("Error cargando categoría:", error.message);
    return null;
  }
  return data as Categoria | null;
}

export async function getMarcas(): Promise<Marca[]> {
  const { data, error } = await supabase
    .from("labs_brands")
    .select("*")
    .order("orden", { ascending: true });
  if (error) {
    console.error("Error cargando marcas:", error.message);
    return [];
  }
  return data as Marca[];
}

export async function getMarcaBySlug(slug: string): Promise<Marca | null> {
  const { data, error } = await supabase
    .from("labs_brands")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("Error cargando marca:", error.message);
    return null;
  }
  return data as Marca | null;
}

export async function getProductos(filtros?: {
  categoria_slug?: string;
  destacado?: boolean;
}): Promise<Producto[]> {
  let query = supabase.from("labs_products").select("*").eq("activo", true);
  if (filtros?.categoria_slug) {
    query = query.eq("categoria_slug", filtros.categoria_slug);
  }
  if (filtros?.destacado) {
    query = query.eq("destacado", true);
  }
  const { data, error } = await query.order("orden", { ascending: true });
  if (error) {
    console.error("Error cargando productos:", error.message);
    return [];
  }
  return data as Producto[];
}

/** Todos los productos activos de una marca (por nombre, sin distinguir mayúsculas), sin importar la categoría. */
export async function getProductosPorMarca(nombreMarca: string): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("labs_products")
    .select("*")
    .eq("activo", true)
    .ilike("marca", nombreMarca)
    .order("orden", { ascending: true });
  if (error) {
    console.error("Error cargando productos de la marca:", error.message);
    return [];
  }
  return data as Producto[];
}

export async function getProducto(slug: string): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("labs_products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("Error cargando producto:", error.message);
    return null;
  }
  return data as Producto | null;
}

export async function getProductosRelacionados(
  producto: Producto,
  limit = 4
): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("labs_products")
    .select("*")
    .eq("categoria_slug", producto.categoria_slug)
    .eq("activo", true)
    .neq("id", producto.id)
    .limit(limit);
  if (error) return [];
  return data as Producto[];
}

export async function getTodosLosProductosParaBusqueda(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("labs_products")
    .select("*")
    .eq("activo", true)
    .order("orden", { ascending: true });
  if (error) return [];
  return data as Producto[];
}
