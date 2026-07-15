import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Todos los colores de acá abajo apuntan a variables CSS con un valor
        // de respaldo (fallback). El admin (/admin/colores) puede sobreescribir
        // esas variables en tiempo de ejecución sin necesidad de recompilar.
        brand: {
          DEFAULT: "var(--color-brand, #F15922)",
          dark: "var(--color-brand-dark, #D6491A)",
          light: "var(--color-brand-light, #FF7A45)",
        },
        ink: {
          DEFAULT: "var(--color-ink, #14171A)",
          soft: "var(--color-ink-soft, #22262B)",
        },
        graphite: {
          900: "#14171A",
          800: "#1B1F24",
          700: "var(--color-graphite-700, #22262B)",
          600: "var(--color-graphite-600, #2E333A)",
          500: "var(--color-graphite-500, #454B53)",
          400: "var(--color-graphite-400, #6B7280)",
        },
        mist: {
          50: "var(--color-mist-50, #FAFAFA)",
          100: "var(--color-mist-100, #F4F5F6)",
          200: "var(--color-mist-200, #E7E9EC)",
          300: "var(--color-mist-300, #D3D7DC)",
          400: "var(--color-mist-400, #9AA0A8)",
        },
        cyan: {
          accent: "var(--color-cyan-accent, #3BC7D1)",
        },
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        sans: ["var(--font-barlow)", "sans-serif"],
        condensed: ["var(--font-barlow-condensed)", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "grid-pattern-dark":
          "linear-gradient(rgba(20,23,26,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,23,26,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20,23,26,0.04), 0 8px 24px -8px rgba(20,23,26,0.10)",
        glow: "0 0 0 1px rgba(241,89,34,0.25), 0 0 40px -8px rgba(241,89,34,0.35)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        float: "float 7s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
