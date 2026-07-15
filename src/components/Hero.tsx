"use client";

import Link from "next/link";
import { ArrowRight, Box, Layers3, Scan, Sparkles, Check } from "lucide-react";
import { buildWhatsAppUrl, mensajeAsesorGeneral, resolveWhatsAppNumber } from "@/lib/whatsapp";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";
import Highlighted from "./Highlighted";

const FLUJO_CADCAM = ["Escaneo digital", "Diseño 3D", "Fresado de precisión"];

interface HeroProps {
  content?: Record<string, string>;
}

export default function Hero({ content = DEFAULT_SITE_CONTENT }: HeroProps) {
  const t = (key: keyof typeof DEFAULT_SITE_CONTENT) => content[key] ?? DEFAULT_SITE_CONTENT[key] ?? "";
  const whatsappUrl = buildWhatsAppUrl(mensajeAsesorGeneral(), resolveWhatsAppNumber(content.whatsapp_numero));

  return (
    <section className="relative overflow-hidden bg-ink pb-24 pt-20 sm:pb-32 sm:pt-28">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
      <div
        className="absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand/20 blur-[140px]"
        aria-hidden
      />
      <div
        className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-cyan-accent/10 blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mist-200">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            {t("hero_eyebrow")}
          </span>

          <h1 className="mt-6 max-w-xl font-heading text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            <Highlighted text={t("hero_title")} />
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-mist-300 sm:text-lg">
            {t("hero_subtitle")}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#soluciones"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03] hover:bg-brand-dark"
            >
              {t("hero_cta_primary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              {t("hero_cta_secondary")}
            </a>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
            <div>
              <dt className="font-heading text-2xl font-extrabold text-white sm:text-3xl">{t("hero_stat1_valor")}</dt>
              <dd className="mt-1 text-xs text-mist-400">{t("hero_stat1_label")}</dd>
            </div>
            <div>
              <dt className="font-heading text-2xl font-extrabold text-white sm:text-3xl">{t("hero_stat2_valor")}</dt>
              <dd className="mt-1 text-xs text-mist-400">{t("hero_stat2_label")}</dd>
            </div>
            <div>
              <dt className="font-heading text-2xl font-extrabold text-white sm:text-3xl">{t("hero_stat3_valor")}</dt>
              <dd className="mt-1 text-xs text-mist-400">{t("hero_stat3_label")}</dd>
            </div>
          </dl>
        </div>

        <div className="relative hidden h-[480px] lg:block" aria-hidden>
          <div className="absolute right-0 top-0 z-30 w-60 animate-float rounded-[1.75rem] border border-white/10 bg-ink-soft/95 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl [animation-delay:0s]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <Scan className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <p className="mt-4 font-heading text-sm font-bold text-white">{t("hero_card1_titulo")}</p>
            <p className="mt-1 text-xs text-mist-400">{t("hero_card1_texto")}</p>
            <div className="mt-4 h-px w-full bg-white/10" />
            <ul className="mt-4 space-y-2">
              {FLUJO_CADCAM.map((paso) => (
                <li key={paso} className="flex items-center gap-2 text-xs text-mist-300">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {paso}
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute left-0 top-[170px] z-20 w-52 animate-float rounded-[1.75rem] border border-white/10 bg-ink-soft/95 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl [animation-delay:1.4s]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-accent/15 text-cyan-accent">
              <Box className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <p className="mt-4 font-heading text-sm font-bold text-white">{t("hero_card2_titulo")}</p>
            <p className="mt-1 text-xs text-mist-400">{t("hero_card2_texto")}</p>
          </div>

          <div className="absolute right-2 top-[300px] z-10 w-56 animate-float rounded-[1.75rem] border border-white/10 bg-ink-soft/95 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl [animation-delay:2.8s]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <Layers3 className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <p className="mt-4 font-heading text-sm font-bold text-white">{t("hero_card3_titulo")}</p>
            <p className="mt-1 text-xs text-mist-400">{t("hero_card3_texto")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
