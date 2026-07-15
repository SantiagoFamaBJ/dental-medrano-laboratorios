"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search, ShoppingCart } from "lucide-react";
import type { Categoria } from "@/lib/types";
import { buildWhatsAppUrl, mensajeAsesorGeneral, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";
import { useCart } from "@/lib/cart-context";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "./CartDrawer";

interface HeaderProps {
  categorias: Categoria[];
  logoUrl?: string | null;
  whatsappNumber?: string;
  navContent?: Record<string, string>;
}

export default function Header({ categorias, logoUrl, whatsappNumber = WHATSAPP_NUMBER, navContent = {} }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  const whatsappUrl = buildWhatsAppUrl(mensajeAsesorGeneral(), whatsappNumber);
  const { items } = useCart();

  const nav = (key: keyof typeof DEFAULT_SITE_CONTENT) => navContent[key] ?? DEFAULT_SITE_CONTENT[key] ?? "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProductosOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/90 shadow-soft backdrop-blur-md"
            : "bg-white/70 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-heading text-lg font-extrabold tracking-tight text-ink">
            {logoUrl ? (
              <span className="relative h-9 w-36 sm:h-10 sm:w-44">
                <Image src={logoUrl} alt="Dental Medrano" fill className="object-contain object-left" priority />
              </span>
            ) : (
              <>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white">
                  <span className="text-sm font-black text-brand">DM</span>
                </span>
                <span className="hidden sm:flex sm:flex-col sm:leading-none">
                  <span>DENTAL MEDRANO</span>
                  <span className="text-[10px] font-medium tracking-[0.2em] text-graphite-500">
                    LABORATORIOS
                  </span>
                </span>
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <div
              className="group relative"
              onMouseEnter={() => setProductosOpen(true)}
              onMouseLeave={() => setProductosOpen(false)}
            >
              <Link href="/productos" className="flex items-center gap-1 text-sm font-medium text-graphite-600 transition-colors hover:text-ink">
                {nav("nav_productos")} <ChevronDown className="h-3.5 w-3.5" />
              </Link>
              {productosOpen && (
                <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3">
                  <div className="grid grid-cols-1 gap-1 rounded-2xl border border-mist-200 bg-white p-3 shadow-soft">
                    <Link
                      href="/productos"
                      className="rounded-xl px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-mist-100"
                    >
                      Ver todos los productos
                    </Link>
                    <div className="my-1 h-px bg-mist-200" />
                    {categorias.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/laboratorios/${cat.slug}`}
                        className="rounded-xl px-4 py-2.5 text-sm font-medium text-graphite-600 transition-colors hover:bg-mist-100 hover:text-ink"
                      >
                        {cat.nombre}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/#soluciones" className="text-sm font-medium text-graphite-600 transition-colors hover:text-ink">
              {nav("nav_soluciones")}
            </Link>
            <Link href="/#marcas" className="text-sm font-medium text-graphite-600 transition-colors hover:text-ink">
              {nav("nav_marcas")}
            </Link>
            <Link href="/laboratorios/digital" className="text-sm font-medium text-graphite-600 transition-colors hover:text-ink">
              {nav("nav_tecnologia")}
            </Link>
            <Link href="/contacto" className="text-sm font-medium text-graphite-600 transition-colors hover:text-ink">
              {nav("nav_contacto")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar productos"
              className="flex h-10 w-10 items-center justify-center rounded-full text-graphite-600 transition-colors hover:bg-mist-100 hover:text-ink"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Ver carrito de consulta"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-graphite-600 transition-colors hover:bg-mist-100 hover:text-ink"
            >
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                  {items.length}
                </span>
              )}
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.03] hover:bg-brand-dark sm:inline-block"
            >
              Hablar con un asesor
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
              className="flex h-10 w-10 items-center justify-center rounded-full text-graphite-600 hover:bg-mist-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-6 shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="font-heading text-base font-bold">Menú</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menú" className="rounded-full p-2 hover:bg-mist-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            <Link href="/productos" className="rounded-xl px-3 py-3 text-base font-semibold text-brand hover:bg-mist-100">
              Ver todos los productos
            </Link>
            <p className="mb-1 mt-2 px-2 text-xs font-semibold uppercase tracking-wider text-graphite-500">
              Categorías
            </p>
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                href={`/laboratorios/${cat.slug}`}
                className="rounded-xl px-3 py-3 text-base font-medium text-graphite-700 hover:bg-mist-100"
              >
                {cat.nombre}
              </Link>
            ))}
            <div className="my-3 h-px bg-mist-200" />
            <Link href="/#soluciones" className="rounded-xl px-3 py-3 text-base font-medium text-graphite-700 hover:bg-mist-100">
              {nav("nav_soluciones")}
            </Link>
            <Link href="/#marcas" className="rounded-xl px-3 py-3 text-base font-medium text-graphite-700 hover:bg-mist-100">
              {nav("nav_marcas")}
            </Link>
            <Link href="/contacto" className="rounded-xl px-3 py-3 text-base font-medium text-graphite-700 hover:bg-mist-100">
              {nav("nav_contacto")}
            </Link>
          </nav>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center rounded-full bg-brand px-5 py-3.5 text-base font-semibold text-white shadow-soft"
          >
            Hablar con un asesor
          </a>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} whatsappNumber={whatsappNumber} />
    </>
  );
}
