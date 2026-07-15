import type { Producto } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-mist-300 bg-mist-50 px-6 py-16 text-center">
        <p className="font-heading text-lg font-bold text-ink">No encontramos productos con estos filtros.</p>
        <p className="mt-2 text-sm text-graphite-500">
          Probá ajustando los filtros o consultá directamente con un asesor: seguro tenemos una solución para tu laboratorio.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
