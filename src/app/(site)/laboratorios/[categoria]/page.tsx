import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategoria, getCategorias, getMarcas, getProductos } from "@/lib/data";
import CategoryExplorer from "@/components/CategoryExplorer";
import ProductGrid from "@/components/ProductGrid";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";

// Revalida cada 30s para reflejar cambios cargados en /admin sin necesitar un deploy manual.
export const revalidate = 30;

export async function generateStaticParams() {
  const categorias = await getCategorias();
  return categorias.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { categoria: string };
}): Promise<Metadata> {
  const categoria = await getCategoria(params.categoria);
  if (!categoria) return {};
  return {
    title: `${categoria.nombre} para Laboratorios Dentales`,
    description: categoria.descripcion || undefined,
    alternates: { canonical: `/laboratorios/${categoria.slug}` },
    openGraph: {
      title: `${categoria.nombre} | Dental Medrano Laboratorios`,
      description: categoria.descripcion || undefined,
    },
  };
}

export default async function CategoriaPage({ params }: { params: { categoria: string } }) {
  const categoria = await getCategoria(params.categoria);
  if (!categoria) notFound();

  const [productos, marcas] = await Promise.all([
    getProductos({ categoria_slug: categoria.slug }),
    getMarcas(),
  ]);
  const destacados = productos.filter((p) => p.destacado).slice(0, 4);

  return (
    <main>
      <section className="relative overflow-hidden bg-ink py-20 sm:py-24">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div
          className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand/20 blur-[120px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav className="mb-6 text-xs text-mist-400">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/productos" className="hover:text-white">Productos</Link>
            <span className="mx-2">/</span>
            <span className="text-mist-200">{categoria.nombre}</span>
          </nav>
          <h1 className="max-w-2xl font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {categoria.nombre}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mist-300 sm:text-lg">
            {categoria.subtitulo}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist-400">{categoria.descripcion}</p>
        </div>
      </section>

      {destacados.length > 0 && (
        <section className="border-b border-mist-200 bg-mist-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand">Destacados</p>
              <h2 className="mt-3 font-heading text-2xl font-bold text-ink sm:text-3xl">
                Lo más elegido en {categoria.nombre.toLowerCase()}
              </h2>
            </Reveal>
            <div className="mt-8">
              <ProductGrid productos={destacados} />
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
              Todos los productos
            </h2>
          </div>
          <CategoryExplorer productos={productos} marcas={marcas} />
        </div>
      </section>

      <section className="bg-mist-50 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5 text-center sm:px-8">
          <p className="text-sm text-graphite-500">¿No encontraste lo que buscabas?</p>
          <Link href="/contacto" className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline">
            Consultá con un asesor especializado <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
