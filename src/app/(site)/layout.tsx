import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/lib/cart-context";
import { getCategorias } from "@/lib/data";
import { getSiteContent, SITE_LOGO_KEY } from "@/lib/site-content";
import { publicImageUrl } from "@/lib/supabase";
import { resolveWhatsAppNumber } from "@/lib/whatsapp";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [categorias, content] = await Promise.all([getCategorias(), getSiteContent()]);
  const logoUrl = publicImageUrl(content[SITE_LOGO_KEY]);
  const numero = resolveWhatsAppNumber(content.whatsapp_numero);

  return (
    <CartProvider>
      <Header categorias={categorias} logoUrl={logoUrl} whatsappNumber={numero} navContent={content} />
      {children}
      <Footer categorias={categorias} logoUrl={logoUrl} email={content.contacto_email} />
      <WhatsAppButton numero={numero} />
    </CartProvider>
  );
}
