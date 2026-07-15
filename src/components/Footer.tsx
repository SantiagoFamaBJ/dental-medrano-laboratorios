import Link from "next/link";
import Image from "next/image";
import type { Categoria } from "@/lib/types";

interface FooterProps {
  categorias: Categoria[];
  logoUrl?: string | null;
  email?: string;
}

export default function Footer({ categorias, logoUrl, email = "info@dental-medrano.com.ar" }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-mist-200">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            {logoUrl ? (
              <span className="relative block h-9 w-36">
                <Image src={logoUrl} alt="Dental Medrano" fill className="object-contain object-left" />
              </span>
            ) : (
              <div className="flex items-center gap-2 font-heading text-lg font-extrabold text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <span className="text-sm font-black text-brand">DM</span>
                </span>
                DENTAL MEDRANO
              </div>
            )}
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-300">
              Tecnología, materiales e insumos para laboratorios dentales tradicionales, mixtos y digitales de toda Argentina.
            </p>
            <a
              href="https://dentalmedrano.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand-light"
            >
              Ir al sitio institucional →
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-mist-300">Categorías</p>
            <ul className="mt-4 space-y-3">
              {categorias.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/laboratorios/${cat.slug}`} className="text-sm text-mist-200 hover:text-white">
                    {cat.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-mist-300">Navegación</p>
            <ul className="mt-4 space-y-3">
              <li><Link href="/#soluciones" className="text-sm text-mist-200 hover:text-white">Soluciones</Link></li>
              <li><Link href="/#marcas" className="text-sm text-mist-200 hover:text-white">Marcas</Link></li>
              <li><Link href="/#tipo-laboratorio" className="text-sm text-mist-200 hover:text-white">Tipo de laboratorio</Link></li>
              <li><Link href="/contacto" className="text-sm text-mist-200 hover:text-white">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-mist-300">Contacto</p>
            <ul className="mt-4 space-y-3 text-sm text-mist-200">
              <li>{email}</li>
              <li>Buenos Aires, Argentina</li>
              <li>Atención a laboratorios de todo el país</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-mist-400 sm:flex-row">
          <p>© {year} Dental Medrano. Todos los derechos reservados.</p>
          <p>Distribución y comercialización de productos odontológicos en Argentina.</p>
        </div>
      </div>
    </footer>
  );
}
