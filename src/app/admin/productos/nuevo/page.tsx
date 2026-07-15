"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";

export default function NuevoProductoPage() {
  return (
    <div>
      <Link href="/admin/productos" className="inline-flex items-center gap-1.5 text-sm font-medium text-graphite-500 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Volver a productos
      </Link>
      <h1 className="mt-4 font-heading text-2xl font-bold text-ink">Nuevo producto</h1>
      <p className="mt-1 text-sm text-graphite-500">
        El slug de la URL se genera automáticamente a partir del nombre.
      </p>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
