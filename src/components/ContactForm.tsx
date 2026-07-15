"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";

const TIPOS_LABORATORIO = ["Tradicional", "Mixto", "Digital"];
const INTERESES = [
  "Ceramica y protesis fija",
  "CAD/CAM",
  "Impresion 3D",
  "Protesis removible",
  "Consumibles",
  "Equipamiento",
  "Otro",
];

const PROVINCIAS = [
  "Buenos Aires","CABA","Catamarca","Chaco","Chubut","Cordoba","Corrientes","Entre Rios",
  "Formosa","Jujuy","La Pampa","La Rioja","Mendoza","Misiones","Neuquen","Rio Negro",
  "Salta","San Juan","San Luis","Santa Cruz","Santa Fe","Santiago del Estero",
  "Tierra del Fuego","Tucuman",
];

interface ContactFormProps {
  interesInicial?: string;
}

export default function ContactForm({ interesInicial }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { items, removeItem, clear } = useCart();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);

    const mensajeUsuario = String(form.get("mensaje") || "");
    const listaProductos =
      items.length > 0
        ? `Productos consultados:\n${items
            .map((i) => {
              const marca = i.marca ? ` (${i.marca})` : "";
              const variante = i.variante ? ` — Tonalidad/medida: ${i.variante}` : "";
              const sku = i.sku ? ` — SKU: ${i.sku}` : "";
              return `- ${i.nombre}${marca}${variante}${sku}`;
            })
            .join("\n")}`
        : "";
    const mensajeFinal = [listaProductos, mensajeUsuario].filter(Boolean).join("\n\n");

    const payload = {
      nombre: String(form.get("nombre") || ""),
      laboratorio: String(form.get("laboratorio") || ""),
      provincia: String(form.get("provincia") || ""),
      ciudad: String(form.get("ciudad") || ""),
      whatsapp: String(form.get("whatsapp") || ""),
      email: String(form.get("email") || ""),
      tipo_laboratorio: String(form.get("tipo_laboratorio") || ""),
      interes_principal: String(form.get("interes_principal") || ""),
      mensaje: mensajeFinal,
    };

    const { error } = await supabase.from("labs_leads").insert(payload);
    if (error) {
      console.error(error.message);
      setStatus("error");
      return;
    }
    setStatus("success");
    clear();
    e.currentTarget.reset();
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-mist-200 bg-white px-8 py-14 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand" />
        <h3 className="mt-4 font-heading text-xl font-bold text-ink">Gracias! Ya recibimos tu consulta.</h3>
        <p className="mt-2 max-w-sm text-sm text-graphite-500">
          Un asesor de Dental Medrano se va a poner en contacto con vos a la brevedad.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-brand hover:underline"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-mist-200 bg-white p-6 sm:p-8">
      {items.length > 0 && (
        <div className="mb-6 rounded-xl border border-brand/20 bg-brand/5 p-4">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-brand">
            Productos que vas a consultar ({items.length})
          </p>
          <ul className="flex flex-wrap gap-2">
            {items.map((item) => (
              <li
                key={item.slug}
                className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-graphite-700 shadow-soft"
              >
                {item.nombre}
                {item.variante && <span className="text-graphite-400">. {item.variante}</span>}
                {item.sku && <span className="text-graphite-400">. SKU {item.sku}</span>}
                <button
                  type="button"
                  onClick={() => removeItem(item.slug)}
                  aria-label={`Quitar ${item.nombre}`}
                  className="text-graphite-400 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nombre" name="nombre" required />
        <Field label="Nombre del laboratorio" name="laboratorio" required />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-graphite-700">Provincia</label>
          <select
            name="provincia"
            required
            className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
          >
            <option value="">Selecciona una provincia</option>
            {PROVINCIAS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <Field label="Ciudad" name="ciudad" required />

        <Field label="WhatsApp" name="whatsapp" type="tel" required placeholder="Ej: 11 2233 4455" />
        <Field label="Email" name="email" type="email" required />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-graphite-700">Tipo de laboratorio</label>
          <select
            name="tipo_laboratorio"
            required
            className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
          >
            <option value="">Selecciona una opcion</option>
            {TIPOS_LABORATORIO.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-graphite-700">Interes principal</label>
          <select
            name="interes_principal"
            required
            defaultValue={interesInicial || ""}
            className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
          >
            <option value="">Selecciona una opcion</option>
            {INTERESES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-graphite-700">Mensaje</label>
          <textarea
            name="mensaje"
            rows={4}
            placeholder="Contanos que necesita tu laboratorio..."
            className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-600">
          Ocurrio un error al enviar tu consulta. Proba de nuevo o escribinos por WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.01] hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Quiero recibir asesoramiento
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-graphite-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
      />
    </div>
  );
}
