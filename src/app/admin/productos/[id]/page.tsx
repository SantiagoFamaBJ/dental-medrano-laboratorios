"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Producto } from "@/lib/types";
import ProductForm from "@/components/admin/ProductForm";

export default function EditarProductoPage() {
  const params = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("labs_products")
      .select("*")
      .eq("id", params.id)
      .maybeSingle()
      .then(({ data }) => {
        setProducto(data as Producto | null);
        setLoading(false);
      });
  }, [params.id]);

  return (
    <div>
      <Link href="/admin/productos" className="inline-flex items-center gap-1.5 text-sm font-medium text-graphite-500 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Volver a productos
      </Link>

      {loading && (
        <div className="mt-10 flex items-center gap-2 text-sm text-graphite-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando producto...
        </div>
      )}

      {!loading && !producto && <p className="mt-10 text-sm text-graphite-500">No se encontró el producto.</p>}

      {!loading && producto && (
        <>
          <h1 className="mt-4 font-heading text-2xl font-bold text-ink">{producto.nombre}</h1>
          <p className="mt-1 text-sm text-graphite-500">/producto/{producto.slug}</p>
          <div className="mt-6">
            <ProductForm producto={producto} />
          </div>
        </>
      )}
    </div>
  );
}
