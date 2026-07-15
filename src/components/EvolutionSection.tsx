import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import Highlighted from "./Highlighted";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";

interface EvolutionSectionProps {
  content?: Record<string, string>;
}

export default function EvolutionSection({ content = DEFAULT_SITE_CONTENT }: EvolutionSectionProps) {
  const t = (key: keyof typeof DEFAULT_SITE_CONTENT) => content[key] ?? DEFAULT_SITE_CONTENT[key] ?? "";

  const PASOS = [
    { titulo: t("tipolab_perfil1_titulo"), texto: "Modelado, colado y procesamiento manual con precisión artesanal." },
    { titulo: t("tipolab_perfil2_titulo"), texto: "Suma flujo digital puntual sin abandonar los procesos que ya dominás." },
    { titulo: t("tipolab_perfil3_titulo"), texto: "Impresión 3D, CAD/CAM y fresado integrados de punta a punta." },
  ];

  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-28">
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">{t("evolucion_eyebrow")}</p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-white sm:text-4xl">
            <Highlighted text={t("evolucion_titulo")} />
          </h2>
          <p className="mt-4 text-mist-300">{t("evolucion_subtitulo")}</p>
        </Reveal>

        <div className="relative mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0">
          <div
            className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-8 hidden h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0 sm:block"
            aria-hidden
          />
          {PASOS.map((paso, i) => (
            <Reveal key={paso.titulo} delayMs={i * 120}>
              <div className="flex flex-col items-center px-6 text-center">
                <div
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-ink font-heading text-lg font-bold text-brand shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.05)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold text-white">{paso.titulo}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-mist-400">{paso.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex justify-center">
          <Link
            href="/#soluciones"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03] hover:bg-brand-dark"
          >
            {t("evolucion_cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
