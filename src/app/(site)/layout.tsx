import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/lib/cart-context";
import { getCategorias } from "@/lib/data";
import { getSiteContent, SITE_LOGO_KEY } from "@/lib/site-content";
import { publicImageUrl } from "@/lib/supabase";
import { resolveWhatsAppNumber } from "@/lib/whatsapp";

// El header/footer leen categorías y textos del sitio desde Supabase. Sin esto, Next.js
// cachea la respuesta indefinidamente y los cambios hechos en /admin no se ven en la web
// hasta el próximo deploy. Con esto, se revalidan solos cada 30 segundos.
export const revalidate = 30;

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
