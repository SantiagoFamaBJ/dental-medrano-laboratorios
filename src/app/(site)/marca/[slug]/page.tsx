import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getMarcaBySlug, getMarcas, getProductosPorMarca } from "@/lib/data";
import { publicImageUrl } from "@/lib/supabase";
import ProductGrid from "@/components/ProductGrid";
import CTASection from "@/components/CTASection";

export async function generateStaticParams() {
  const marcas = await getMarcas();
  return marcas.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const marca = await getMarcaBySlug(params.slug);
  if (!marca) return {};
  return {
    title: `Productos ${marca.nombre}`,
    description: `Todos los productos de ${marca.nombre} disponibles en Dental Medrano Laboratorios.`,
    alternates: { canonical: `/marca/${marca.slug}` },
  };
}

export default async function MarcaPage({ params }: { params: { slug: string } }) {
  const marca = await getMarcaBySlug(params.slug);
  if (!marca) notFound();

  const productos = await getProductosPorMarca(marca.nombre);
  const logoUrl = publicImageUrl(marca.logo_url);

  return (
    <main>
      <section className="relative overflow-hidden bg-ink py-20 sm:py-24">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav className="mb-6 text-xs text-mist-400">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/#marcas" className="hover:text-white">Marcas</Link>
            <span className="mx-2">/</span>
            <span className="text-mist-200">{marca.nombre}</span>
          </nav>
          <div className="flex items-center gap-5">
            {logoUrl && (
              <div className="relative h-16 w-32 shrink-0 rounded-xl bg-white/95 p-3 sm:h-20 sm:w-40">
                <Image src={logoUrl} alt={marca.nombre} fill className="object-contain p-2" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand">Marca</p>
              <h1 className="mt-1 font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                {marca.nombre}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
              {productos.length} producto{productos.length !== 1 ? "s" : ""} de {marca.nombre}
            </h2>
          </div>
          <ProductGrid productos={productos} />
        </div>
      </section>

      <CTASection />
    </main>
  );
}
