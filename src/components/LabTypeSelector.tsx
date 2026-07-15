import Link from "next/link";
import { Hammer, GitMerge, Cpu } from "lucide-react";
import Reveal from "./Reveal";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";

interface LabTypeSelectorProps {
  content?: Record<string, string>;
}

export default function LabTypeSelector({ content = DEFAULT_SITE_CONTENT }: LabTypeSelectorProps) {
  const t = (key: keyof typeof DEFAULT_SITE_CONTENT) => content[key] ?? DEFAULT_SITE_CONTENT[key] ?? "";

  const PERFILES = [
    {
      tipo: "tradicional",
      icon: Hammer,
      titulo: t("tipolab_perfil1_titulo"),
      texto: t("tipolab_perfil1_texto"),
      href: "/laboratorios/consumo-diario",
    },
    {
      tipo: "mixto",
      icon: GitMerge,
      titulo: t("tipolab_perfil2_titulo"),
      texto: t("tipolab_perfil2_texto"),
      href: "/laboratorios/protesis-removible",
    },
    {
      tipo: "digital",
      icon: Cpu,
      titulo: t("tipolab_perfil3_titulo"),
      texto: t("tipolab_perfil3_texto"),
      href: "/laboratorios/digital",
    },
  ];

  return (
    <section id="tipo-laboratorio" className="bg-mist-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">{t("tipolab_eyebrow")}</p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-ink sm:text-4xl">{t("tipolab_titulo")}</h2>
          <p className="mt-4 text-graphite-500">{t("tipolab_subtitulo")}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PERFILES.map((perfil, i) => (
            <Reveal key={perfil.tipo} delayMs={i * 100}>
              <Link
                href={perfil.href}
                className="group flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-glow"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white transition-colors group-hover:bg-brand">
                  <perfil.icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold text-ink">{perfil.titulo}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-500">{perfil.texto}</p>
                <span className="mt-5 text-sm font-semibold text-brand">Ver productos →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
