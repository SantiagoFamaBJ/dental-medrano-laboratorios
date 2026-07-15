import type { MetadataRoute } from "next";
import { getCategorias, getTodosLosProductosParaBusqueda } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://laboratorios.dentalmedrano.com.ar";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categorias, productos] = await Promise.all([
    getCategorias(),
    getTodosLosProductosParaBusqueda(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/contacto`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorias.map((c) => ({
    url: `${siteUrl}/laboratorios/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const productRoutes: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${siteUrl}/producto/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
