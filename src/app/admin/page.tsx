"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, Tags, MessageSquareText, Plus, LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminHomePage() {
  const [counts, setCounts] = useState({ productos: 0, marcas: 0, leads: 0, leadsPendientes: 0 });

  useEffect(() => {
    async function load() {
      const [productos, marcas, leads, leadsPendientes] = await Promise.all([
        supabase.from("labs_products").select("id", { count: "exact", head: true }),
        supabase.from("labs_brands").select("id", { count: "exact", head: true }),
        supabase.from("labs_leads").select("id", { count: "exact", head: true }),
        supabase.from("labs_leads").select("id", { count: "exact", head: true }).eq("atendido", false),
      ]);
      setCounts({
        productos: productos.count || 0,
        marcas: marcas.count || 0,
        leads: leads.count || 0,
        leadsPendientes: leadsPendientes.count || 0,
      });
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Resumen</h1>
      <p className="mt-1 text-sm text-graphite-500">
        Panel interno del micrositio de laboratorios. Cargá fotos, productos y revisá las consultas comerciales.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard icon={Layers} label="Productos activos" value={counts.productos} />
        <StatCard icon={Tags} label="Marcas" value={counts.marcas} />
        <StatCard icon={MessageSquareText} label="Consultas sin atender" value={counts.leadsPendientes} sub={`${counts.leads} en total`} />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Nuevo producto
        </Link>
        <Link
          href="/admin/productos"
          className="inline-flex items-center gap-2 rounded-full border border-mist-300 bg-white px-5 py-2.5 text-sm font-semibold text-graphite-700 hover:border-brand/40"
        >
          Ver catálogo completo
        </Link>
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 rounded-full border border-mist-300 bg-white px-5 py-2.5 text-sm font-semibold text-graphite-700 hover:border-brand/40"
        >
          Ver consultas
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: LucideIcon; label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-mist-200 bg-white p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 font-heading text-3xl font-extrabold text-ink">{value}</p>
      <p className="mt-1 text-sm text-graphite-500">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-graphite-400">{sub}</p>}
    </div>
  );
}
