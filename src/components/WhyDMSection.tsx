import { Layers, Cpu, Award, Headset, MapPinned, Boxes } from "lucide-react";
import Reveal from "./Reveal";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";

interface WhyDMSectionProps {
  content?: Record<string, string>;
}

export default function WhyDMSection({ content = DEFAULT_SITE_CONTENT }: WhyDMSectionProps) {
  const t = (key: keyof typeof DEFAULT_SITE_CONTENT) => content[key] ?? DEFAULT_SITE_CONTENT[key] ?? "";

  const BENEFICIOS = [
    { icon: Layers, titulo: t("porque_beneficio1_titulo"), texto: t("porque_beneficio1_texto") },
    { icon: Cpu, titulo: t("porque_beneficio2_titulo"), texto: t("porque_beneficio2_texto") },
    { icon: Award, titulo: t("porque_beneficio3_titulo"), texto: t("porque_beneficio3_texto") },
    { icon: Headset, titulo: t("porque_beneficio4_titulo"), texto: t("porque_beneficio4_texto") },
    { icon: MapPinned, titulo: t("porque_beneficio5_titulo"), texto: t("porque_beneficio5_texto") },
    { icon: Boxes, titulo: t("porque_beneficio6_titulo"), texto: t("porque_beneficio6_texto") },
  ];

  return (
    <section className="bg-mist-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">{t("porque_eyebrow")}</p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-ink sm:text-4xl">{t("porque_titulo")}</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFICIOS.map((b, i) => (
            <Reveal key={b.titulo} delayMs={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <b.icon className="h-5.5 w-5.5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-ink">{b.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-500">{b.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
