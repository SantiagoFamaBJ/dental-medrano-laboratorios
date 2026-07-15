"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Lead } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("labs_leads").select("*").order("created_at", { ascending: false });
    setLeads((data as Lead[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleAtendido(id: number | undefined, atendido: boolean) {
    if (!id) return;
    await supabase.from("labs_leads").update({ atendido: !atendido }).eq("id", id);
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Consultas comerciales</h1>
      <p className="mt-1 text-sm text-graphite-500">{leads.length} consultas recibidas desde el formulario de contacto.</p>

      <div className="mt-6 space-y-4">
        {loading && <p className="text-sm text-graphite-500">Cargando...</p>}
        {!loading && leads.length === 0 && <p className="text-sm text-graphite-500">Todavía no hay consultas.</p>}

        {leads.map((lead) => (
          <div key={lead.id} className="rounded-2xl border border-mist-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading text-base font-bold text-ink">{lead.nombre}</p>
                <p className="text-sm text-graphite-500">
                  {lead.laboratorio} · {lead.ciudad}, {lead.provincia}
                </p>
              </div>
              <button
                onClick={() => toggleAtendido(lead.id, !!lead.atendido)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  lead.atendido ? "bg-green-100 text-green-700" : "bg-mist-100 text-graphite-600"
                }`}
              >
                {lead.atendido ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                {lead.atendido ? "Atendido" : "Marcar como atendido"}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-graphite-600 sm:grid-cols-2">
              <p><span className="font-medium text-graphite-700">Tipo de laboratorio:</span> {lead.tipo_laboratorio}</p>
              <p><span className="font-medium text-graphite-700">Interés:</span> {lead.interes_principal}</p>
              <p><span className="font-medium text-graphite-700">Email:</span> {lead.email}</p>
              <p><span className="font-medium text-graphite-700">WhatsApp:</span> {lead.whatsapp}</p>
            </div>

            {lead.mensaje && <p className="mt-3 rounded-xl bg-mist-50 p-3 text-sm text-graphite-600">{lead.mensaje}</p>}

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-graphite-400">
                {lead.created_at && new Date(lead.created_at).toLocaleString("es-AR")}
              </p>
              <a
                href={buildWhatsAppUrl(`Hola ${lead.nombre}, te escribo de Dental Medrano por tu consulta.`, lead.whatsapp.replace(/\D/g, ""))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" /> Responder por WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
