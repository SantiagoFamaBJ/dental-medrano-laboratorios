"use client";

import { useState } from "react";
import { ShoppingCart, Check, Trash2 } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { useCart } from "@/lib/cart-context";
import { buildWhatsAppUrl, mensajeConsultaProducto } from "@/lib/whatsapp";
import type { VarianteMatriz } from "@/lib/types";

const AXES = ["tipo", "translucidez", "tono", "medida"] as const;
type Axis = (typeof AXES)[number];

const AXIS_LABEL: Record<Axis, string> = {
  tipo: "Tipo",
  translucidez: "Translucidez",
  tono: "Tono",
  medida: "Medida",
};

interface ProductActionsProps {
  slug: string;
  nombre: string;
  marca: string | null;
  imagen: string | null;
  sku?: string | null;
  variantes?: string[];
  variantesMatriz?: VarianteMatriz[];
  whatsappNumber?: string;
}

export default function ProductActions({
  slug,
  nombre,
  marca,
  imagen,
  sku,
  variantes = [],
  variantesMatriz = [],
  whatsappNumber,
}: ProductActionsProps) {
  const { items, addItem, removeItem, isInCart } = useCart();
  const itemEnCarrito = items.find((i) => i.slug === slug);
  const enCarrito = isInCart(slug);

  const usaMatriz = variantesMatriz.length > 0;
  const tieneVariantesSimples = !usaMatriz && variantes.length > 0;

  const [varianteSimple, setVarianteSimple] = useState(itemEnCarrito?.variante || "");

  const axesPresentes = AXES.filter((a) => variantesMatriz.some((v) => v[a]));
  const esListaSimpleDeEtiquetas = usaMatriz && axesPresentes.length === 0;
  const [selecciones, setSelecciones] = useState<Partial<Record<Axis, string>>>({});
  const [etiquetaElegida, setEtiquetaElegida] = useState("");

  function opcionesPara(axis: Axis) {
    const idx = AXES.indexOf(axis);
    const previas = AXES.slice(0, idx).filter((a) => axesPresentes.includes(a));
    const compatibles = variantesMatriz.filter((v) =>
      previas.every((a) => !selecciones[a] || v[a] === selecciones[a])
    );
    return Array.from(new Set(compatibles.map((v) => v[axis]).filter(Boolean))) as string[];
  }

  function handleAxisChange(axis: Axis, value: string) {
    setSelecciones((prev) => {
      const idx = AXES.indexOf(axis);
      const next: Partial<Record<Axis, string>> = {};
      for (const a of AXES) {
        if (AXES.indexOf(a) < idx) next[a] = prev[a];
      }
      next[axis] = value;
      return next;
    });
  }

  const coincidencias = variantesMatriz.filter((v) =>
    axesPresentes.every((a) => !selecciones[a] || v[a] === selecciones[a])
  );
  const seleccionCompleta = esListaSimpleDeEtiquetas
    ? Boolean(etiquetaElegida)
    : axesPresentes.every((a) => selecciones[a]);
  const matchMatriz: VarianteMatriz | null = esListaSimpleDeEtiquetas
    ? variantesMatriz.find((v) => v.etiqueta === etiquetaElegida) || null
    : seleccionCompleta && coincidencias.length >= 1
      ? coincidencias[0]
      : null;

  const varianteActiva = usaMatriz ? matchMatriz?.etiqueta : varianteSimple || undefined;
  const skuActivo = usaMatriz ? matchMatriz?.sku : sku || undefined;
  const puedeAccionar = usaMatriz ? Boolean(matchMatriz) : true;

  const whatsappUrl = buildWhatsAppUrl(
    mensajeConsultaProducto(nombre, varianteActiva, skuActivo || undefined),
    whatsappNumber
  );

  function handleAgregar() {
    addItem({
      slug,
      nombre,
      marca,
      imagen,
      variante: varianteActiva,
      sku: skuActivo || undefined,
    });
  }

  return (
    <div className="mt-8 space-y-4">
      {esListaSimpleDeEtiquetas && (
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-700">Presentacion</label>
            <select
              value={etiquetaElegida}
              onChange={(e) => setEtiquetaElegida(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand sm:w-auto"
            >
              <option value="">Elegir presentacion</option>
              {variantesMatriz.map((v) => (
                <option key={v.etiqueta} value={v.etiqueta}>
                  {v.etiqueta}
                </option>
              ))}
            </select>
          </div>
          {matchMatriz?.sku && (
            <p className="text-xs font-medium text-graphite-500">
              SKU: <span className="font-semibold text-ink">{matchMatriz.sku}</span>
            </p>
          )}
        </div>
      )}

      {usaMatriz && !esListaSimpleDeEtiquetas && (
        <div className="space-y-3">
          {axesPresentes.map((axis) => (
            <div key={axis}>
              <label className="mb-1.5 block text-sm font-medium text-graphite-700">
                {AXIS_LABEL[axis]}
              </label>
              <select
                value={selecciones[axis] || ""}
                onChange={(e) => handleAxisChange(axis, e.target.value)}
                className="w-full max-w-xs rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand sm:w-auto"
              >
                <option value="">Elegir {AXIS_LABEL[axis].toLowerCase()}</option>
                {opcionesPara(axis).map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {matchMatriz?.sku && (
            <p className="text-xs font-medium text-graphite-500">
              SKU: <span className="font-semibold text-ink">{matchMatriz.sku}</span>
            </p>
          )}
          {!seleccionCompleta && (
            <p className="text-xs text-graphite-500">
              Elegi todas las opciones para ver el SKU y poder consultar o agregar al carrito.
            </p>
          )}
          {seleccionCompleta && !matchMatriz && (
            <p className="text-xs text-graphite-500">
              Esa combinacion no esta disponible. Proba con otra opcion.
            </p>
          )}
        </div>
      )}

      {tieneVariantesSimples && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-graphite-700">
            Tonalidad / medida (opcional)
          </label>
          <select
            value={varianteSimple}
            onChange={(e) => setVarianteSimple(e.target.value)}
            className="w-full max-w-xs rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand sm:w-auto"
          >
            <option value="">Sin especificar</option>
            {variantes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-graphite-500">
            Elegi una opcion antes de consultar o agregar al carrito, asi queda incluida en el mensaje.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={puedeAccionar ? whatsappUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!puedeAccionar}
          onClick={(e) => {
            if (!puedeAccionar) e.preventDefault();
          }}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform ${
            puedeAccionar
              ? "bg-brand hover:scale-[1.02] hover:bg-brand-dark"
              : "cursor-not-allowed bg-mist-300"
          }`}
        >
          <WhatsAppIcon className="h-4 w-4" />
          Consultar por este producto
        </a>
        <button
          onClick={handleAgregar}
          disabled={!puedeAccionar}
          className={`inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            enCarrito
              ? "border-brand bg-brand/10 text-brand"
              : "border-mist-300 text-graphite-600 hover:border-brand/40 hover:text-brand"
          }`}
        >
          {enCarrito ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          {enCarrito ? "Actualizar en el carrito" : "Agregar al carrito"}
        </button>
        {enCarrito && (
          <button
            onClick={() => removeItem(slug)}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-graphite-400 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Quitar del carrito
          </button>
        )}
      </div>

      {!usaMatriz && sku && (
        <p className="text-xs font-medium text-graphite-500">
          SKU: <span className="font-semibold text-ink">{sku}</span>
        </p>
      )}
    </div>
  );
}
