import type { Metadata } from "next";
import Link from "next/link";
import { getCategorias, getMarcas, getProductos } from "@/lib/data";
import AllProductsExplorer from "@/components/AllProductsExplorer";

export const metadata: Metadata = {
  title: "Todos los productos",
  description:
    "Catálogo completo de productos para laboratorios dentales de Dental Medrano: cerámica, CAD/CAM, impresión 3D, prótesis removible y consumo diario.",
  alternates: { canonical: "/productos" },
};

// Revalida cada 30s para reflejar cambios cargados en /admin sin necesitar un deploy manual.
export const revalidate = 30;

export default async function ProductosPage() {
  const [productos, categorias, marcas] = await Promise.all([
    getProductos(),
    getCategorias(),
    getMarcas(),
  ]);

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
            <span className="text-mist-200">Productos</span>
          </nav>
          <h1 className="max-w-2xl font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Todos los productos
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mist-300 sm:text-lg">
            Explorá el catálogo completo de Dental Medrano. Elegí una categoría, marca o tipo de producto para
            encontrar lo que necesitás.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <AllProductsExplorer productos={productos} categorias={categorias} marcas={marcas} />
        </div>
      </section>
    </main>
  );
}
