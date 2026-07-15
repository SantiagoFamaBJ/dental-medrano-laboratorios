import Link from "next/link";
import Image from "next/image";
import type { Marca } from "@/lib/types";
import { publicImageUrl } from "@/lib/supabase";
import Reveal from "./Reveal";
import Highlighted from "./Highlighted";

interface BrandsSectionProps {
  marcas: Marca[];
  eyebrow?: string;
  title?: string;
}

export default function BrandsSection({
  marcas,
  eyebrow = "Marcas",
  title = "Marcas nacionales e internacionales",
}: BrandsSectionProps) {
  return (
    <section id="marcas" className="border-y border-mist-200 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">{eyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-ink sm:text-4xl">
            <Highlighted text={title} />
          </h2>
        </Reveal>

        <Reveal delayMs={100} className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {marcas.map((marca) => {
            const logoUrl = publicImageUrl(marca.logo_url);
            return (
              <Link
                key={marca.slug}
                href={`/marca/${marca.slug}`}
                className="group flex h-24 items-center justify-center rounded-2xl border border-mist-200 bg-white px-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-glow"
              >
                {logoUrl ? (
                  <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={logoUrl}
                      alt={marca.nombre}
                      fill
                      sizes="160px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="font-heading text-base font-bold tracking-tight text-graphite-600 transition-colors group-hover:text-brand">
                    {marca.nombre}
                  </span>
                )}
              </Link>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
