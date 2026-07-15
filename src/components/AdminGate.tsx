"use client";

import { useEffect, useState, FormEvent, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, LayoutGrid, Tags, Layers, MessageSquareText, LogOut, FileText, Palette } from "lucide-react";

const STORAGE_KEY = "labs_admin_auth";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

const NAV = [
  { href: "/admin", label: "Resumen", icon: LayoutGrid },
  { href: "/admin/productos", label: "Productos", icon: Layers },
  { href: "/admin/categorias", label: "Categorías", icon: Layers },
  { href: "/admin/marcas", label: "Marcas", icon: Tags },
  { href: "/admin/contenido", label: "Textos del sitio", icon: FileText },
  { href: "/admin/colores", label: "Colores", icon: Palette },
  { href: "/admin/leads", label: "Consultas", icon: MessageSquareText },
];

export default function AdminGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setAuthed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD && ADMIN_PASSWORD.length > 0) {
      localStorage.setItem(STORAGE_KEY, "true");
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
  }

  if (authed === null) {
    return <div className="flex min-h-screen items-center justify-center bg-mist-50" />;
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-5">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/20 text-brand">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-5 font-heading text-xl font-bold text-white">Panel interno</h1>
          <p className="mt-1 text-sm text-mist-400">Acceso exclusivo para el equipo de Dental Medrano.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="mt-6 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
            autoFocus
          />
          {error && <p className="mt-2 text-xs text-red-400">Contraseña incorrecta.</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist-50">
      <div className="flex">
        <aside className="hidden w-60 shrink-0 border-r border-mist-200 bg-white sm:block">
          <div className="flex h-16 items-center gap-2 border-b border-mist-200 px-6 font-heading text-sm font-bold text-ink">
            Panel Laboratorios
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    active ? "bg-brand/10 text-brand" : "text-graphite-600 hover:bg-mist-100"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-graphite-500 hover:bg-mist-100"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </nav>
        </aside>
        <main className="min-h-screen flex-1 px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
