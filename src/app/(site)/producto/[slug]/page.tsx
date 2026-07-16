import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { getProducto, getProductosRelacionados, getTodosLosProductosParaBusqueda, getCategoria } from "@/lib/data";
import { publicImageUrl } from "@/lib/supabase";
import { getSiteContent } from "@/lib/site-content";
import { resolveWhatsAppNumber } from "@/lib/whatsapp";
import ProductGrid from "@/components/ProductGrid";
import ProductActions from "@/components/ProductActions";
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

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-mist-200 bg-mist-50">
            {imageUrl ? (
              <Image src={imageUrl} alt={producto.nombre} fill sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" priority />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-grid-light">
                <span className="font-heading text-5xl font-bold text-mist-300">DM</span>
              </div>
            )}
          </div>

          <div>
            {(producto.badges?.length > 0 || producto.tipo !== "producto") && (
              <div className="mb-4 flex flex-wrap gap-2">
                {producto.tipo !== "producto" && (
                  <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-graphite-700">
                    {producto.tipo === "linea" ? "Linea" : "Coleccion"}
                  </span>
                )}
                {producto.badges?.map((b) => (
                  <span key={b} className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                    {b}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">{producto.marca}</p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              {producto.nombre}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-graphite-600">
              {producto.descripcion_completa || producto.descripcion_corta}
            </p>

            <ProductActions
              slug={producto.slug}
              nombre={producto.nombre}
              marca={producto.marca}
              imagen={producto.imagen}
              sku={producto.sku}
              variantes={producto.variantes}
              variantesMatriz={producto.variantes_matriz}
              whatsappNumber={whatsappNumber}
            />

            {producto.beneficios?.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-ink">Beneficios</h2>
                <ul className="mt-3 space-y-2.5">
                  {producto.beneficios.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-graphite-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {producto.aplicaciones?.length > 0 && (
              <div className="mt-8">
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-ink">Aplicaciones</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {producto.aplicaciones.map((a) => (
                    <span key={a} className="rounded-full bg-mist-100 px-3.5 py-1.5 text-xs font-medium text-graphite-600">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}


            {producto.caracteristicas?.length > 0 && (
              <div className="mt-8">
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-ink">Caracteristicas</h2>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-graphite-600">
                  {producto.caracteristicas.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

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
