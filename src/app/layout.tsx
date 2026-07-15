import type { Metadata } from "next";
import { Montserrat, Barlow, Barlow_Condensed } from "next/font/google";
import { getThemeStyleTag } from "@/lib/theme";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["600", "700", "800"],
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "600"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  weight: ["500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://laboratorios.dentalmedrano.com.ar";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Productos para Laboratorios Dentales | Dental Medrano",
    template: "%s | Dental Medrano Laboratorios",
  },
  description:
    "Tecnología, materiales e insumos para laboratorios dentales tradicionales, mixtos y digitales. Cerámica, CAD/CAM, impresión 3D, prótesis removible y consumo diario.",
  keywords: [
    "laboratorio dental",
    "protesista",
    "CAD/CAM dental",
    "impresión 3D dental",
    "zirconia",
    "Dental Medrano",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Dental Medrano · Laboratorios",
    title: "Soluciones para el laboratorio dental del presente y del futuro",
    description:
      "Tecnología, materiales e insumos para laboratorios tradicionales, mixtos y digitales.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeStyle = await getThemeStyleTag();

  return (
    <html lang="es-AR" className={`${montserrat.variable} ${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="antialiased font-sans bg-white text-ink">
        {themeStyle && <style id="theme-overrides" dangerouslySetInnerHTML={{ __html: themeStyle }} />}
        {children}
      </body>
    </html>
  );
}
