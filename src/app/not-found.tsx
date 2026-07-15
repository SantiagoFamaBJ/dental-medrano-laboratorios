import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-5 text-center">
      <p className="font-heading text-6xl font-black text-mist-300">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold text-ink">No encontramos esta página</h1>
      <p className="mt-2 max-w-sm text-sm text-graphite-500">
        Puede que el producto o la categoría ya no estén disponibles. Volvé al inicio para seguir explorando.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
