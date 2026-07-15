import Link from "next/link";
import { Layers, Cpu, Printer, Grip, Wrench, ArrowRight, LucideIcon } from "lucide-react";
import type { Categoria } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  cpu: Cpu,
  printer: Printer,
  grip: Grip,
  wrench: Wrench,
};

const ACCENTS: Record<string, string> = {
  "ceramica-protesis-fija": "from-[#2A2E33] to-[#14171A]",
  "cad-cam": "from-[#1B2A2E] to-[#14171A]",
  digital: "from-[#1A2233] to-[#14171A]",
  "protesis-removible": "from-[#28242E] to-[#14171A]",
  "consumo-diario": "from-[#2E2620] to-[#14171A]",
};

export default function CategoryCard({ categoria, index }: { categoria: Categoria; index: number }) {
  const Icon = ICONS[categoria.icon || "layers"] || Layers;
  const accent = ACCENTS[categoria.slug] || "from-[#22262B] to-[#14171A]";

  return (
    <Link
      href={`/laboratorios/${categoria.slug}`}
      className={`group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${accent} p-8 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl`}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid opacity-40" />
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="relative flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition-colors group-hover:bg-brand/90">
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <span className="font-heading text-5xl font-black text-white/10">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative">
        <h3 className="font-heading text-2xl font-bold leading-tight text-white">{categoria.nombre}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{categoria.descripcion}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-light">
          Explorar categoría
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
