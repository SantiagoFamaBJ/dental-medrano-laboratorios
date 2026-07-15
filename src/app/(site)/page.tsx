import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import LabTypeSelector from "@/components/LabTypeSelector";
import EvolutionSection from "@/components/EvolutionSection";
import BrandsSection from "@/components/BrandsSection";
import WhyDMSection from "@/components/WhyDMSection";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import Highlighted from "@/components/Highlighted";
import { getCategorias, getMarcas } from "@/lib/data";
import { getSiteContent, DEFAULT_SITE_CONTENT } from "@/lib/site-content";

export default async function HomePage() {
  const [categorias, marcas, content] = await Promise.all([getCategorias(), getMarcas(), getSiteContent()]);
  const t = (key: keyof typeof DEFAULT_SITE_CONTENT) => content[key] ?? DEFAULT_SITE_CONTENT[key] ?? "";

  return (
    <main>
      <Hero content={content} />

      <section id="soluciones" className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">{t("soluciones_eyebrow")}</p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold text-ink sm:text-4xl">
              <Highlighted text={t("soluciones_titulo")} />
            </h2>
            <p className="mt-4 text-graphite-500">{t("soluciones_subtitulo")}</p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((categoria, i) => (
              <Reveal key={categoria.slug} delayMs={i * 80}>
                <CategoryCard categoria={categoria} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <LabTypeSelector content={content} />
      <EvolutionSection content={content} />
      <BrandsSection marcas={marcas} eyebrow={t("marcas_eyebrow")} title={t("marcas_titulo")} />
      <WhyDMSection content={content} />
      <CTASection content={content} />
    </main>
  );
}
