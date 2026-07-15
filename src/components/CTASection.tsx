import Link from "next/link";
import Reveal from "./Reveal";
import WhatsAppIcon from "./WhatsAppIcon";
import { buildWhatsAppUrl, mensajeAsesorGeneral, resolveWhatsAppNumber } from "@/lib/whatsapp";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";

interface CTASectionProps {
  content?: Record<string, string>;
}

export default function CTASection({ content = DEFAULT_SITE_CONTENT }: CTASectionProps) {
  const t = (key: keyof typeof DEFAULT_SITE_CONTENT) => content[key] ?? DEFAULT_SITE_CONTENT[key] ?? "";
  const whatsappUrl = buildWhatsAppUrl(mensajeAsesorGeneral(), resolveWhatsAppNumber(content.whatsapp_numero));

  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-28">
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
      <div
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/25 blur-[140px]"
        aria-hidden
      />
      <Reveal className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">{t("cta_titulo")}</h2>
        <p className="mt-4 text-base text-mist-300 sm:text-lg">{t("cta_subtitulo")}</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03] hover:bg-brand-dark"
          >
            {t("cta_boton_primario")}
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {t("cta_boton_whatsapp")}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
