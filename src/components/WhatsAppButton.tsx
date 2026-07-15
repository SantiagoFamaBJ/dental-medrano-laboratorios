"use client";

import WhatsAppIcon from "./WhatsAppIcon";
import { buildWhatsAppUrl, mensajeAsesorGeneral, WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  numero?: string;
}

export default function WhatsAppButton({ numero = WHATSAPP_NUMBER }: WhatsAppButtonProps) {
  return (
    <a
      href={buildWhatsAppUrl(mensajeAsesorGeneral(), numero)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablar por WhatsApp con un asesor de Dental Medrano"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-4 py-3.5 text-white shadow-soft transition-all hover:pr-5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:pr-5"
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[160px] sm:inline-block sm:max-w-0">
        Escribinos
      </span>
    </a>
  );
}
