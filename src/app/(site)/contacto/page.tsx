import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { buildWhatsAppUrl, mensajeAsesorGeneral, resolveWhatsAppNumber } from "@/lib/whatsapp";
import { getSiteContent, DEFAULT_SITE_CONTENT } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contanos cómo trabaja tu laboratorio y te ayudamos a encontrar materiales, tecnología y soluciones para tu flujo de trabajo.",
};

export default async function ContactoPage() {
  const content = await getSiteContent();
  const t = (key: keyof typeof DEFAULT_SITE_CONTENT) => content[key] ?? DEFAULT_SITE_CONTENT[key] ?? "";
  const whatsappUrl = buildWhatsAppUrl(mensajeAsesorGeneral(), resolveWhatsAppNumber(content.whatsapp_numero));

  return (
    <main className="bg-mist-50">
      <section className="relative overflow-hidden bg-ink py-20 sm:py-24">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">{t("contacto_eyebrow")}</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-white sm:text-5xl">{t("contacto_titulo")}</h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-mist-300 sm:text-lg">{t("contacto_subtitulo")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-heading text-xl font-bold text-ink">{t("contacto_lateral_titulo")}</h2>
            <p className="mt-2 text-sm text-graphite-500">{t("contacto_lateral_texto")}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Consultar por WhatsApp
            </a>

            <div className="mt-10 space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-brand" />
                <div>
                  <p className="text-sm font-semibold text-ink">Email</p>
                  <p className="text-sm text-graphite-500">{t("contacto_email")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-brand" />
                <div>
                  <p className="text-sm font-semibold text-ink">Cobertura</p>
                  <p className="text-sm text-graphite-500">{t("contacto_cobertura")}</p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}
