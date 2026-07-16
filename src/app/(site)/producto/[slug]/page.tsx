import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProducto, getProductosRelacionados, getTodosLosProductosParaBusqueda, getCategoria } from "@/lib/data";
import { publicImageUrl } from "@/lib/supabase";
import { getSiteContent } from "@/lib/site-content";
import { resolveWhatsAppNumber } from "@/lib/whatsapp";
import ProductGrid from "@/components/ProductGrid";
import ProductGallery from "@/components/ProductGallery";
import Reveal from "@/components/Reveal";

// Revalida cada 30s para que ediciones de producto en /admin (precio, SKU, variantes, texto,
// imagen) se vean en la ficha pública sin necesitar un deploy manual.
export const revalidate = 30;

export async function generateStaticParams() {
  const productos = await getTodosLosProductosParaBusqueda();
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const producto = await getProducto(params.slug);
  if (!producto) return {};
  return {
    title: producto.nombre,
    description: producto.descripcion_corta || undefined,
    alternates: { canonical: `/producto/${producto.slug}` },
    openGraph: {
      title: `${producto.nombre} | ${producto.marca}`,
      description: producto.descripcion_corta || undefined,
      images: producto.imagen ? [publicImageUrl(producto.imagen) as string] : undefined,
    },
  };
}

export default async function ProductoPage({ params }: { params: { slug: string } }) {
  const producto = await getProducto(params.slug);
  if (!producto) notFound();

  const [relacionados, categoria, content] = await Promise.all([
    getProductosRelacionados(producto),
    getCategoria(producto.categoria_slug),
    getSiteContent(),
  ]);

  const imageUrl = publicImageUrl(producto.imagen);
  const whatsappNumber = resolveWhatsAppNumber(content.whatsapp_numero);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    brand: producto.marca ? { "@type": "Brand", name: producto.marca } : undefined,
    description: producto.descripcion_completa || producto.descripcion_corta,
    image: imageUrl || undefined,
    category: categoria?.nombre,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "ARS",
      price: "0",
      description: "Consultar disponibilidad",
    },
  };

  return (
    <main className="bg-white">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8">
        <nav className="mb-8 text-xs text-graphite-500">
          <Link href="/" className="hover:text-ink">Inicio</Link>
          <span className="mx-2">/</span>
          {categoria && (
            <>
              <Link href={`/laboratorios/${categoria.slug}`} className="hover:text-ink">{categoria.nombre}</Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-graphite-700">{producto.nombre}</span>
        </nav>

        <ProductGallery producto={producto} whatsappNumber={whatsappNumber} />

        {relacionados.length > 0 && (
          <Reveal className="mt-24">
            <h2 className="font-heading text-2xl font-bold text-ink">Productos relacionados</h2>
            <div className="mt-8">
              <ProductGrid productos={relacionados} />
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}
