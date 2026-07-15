# Dental Medrano · Laboratorios

Micrositio B2B para laboratorios protéticos y técnicos dentales de Argentina. Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase, siguiendo el stack fijo de los proyectos de Dental Medrano.

## Stack

- **Next.js 14** (App Router, Server Components para lecturas, Client Components para formularios/admin)
- **Tailwind CSS** con paleta de marca (`#F15922` + grises grafito) y tipografías Montserrat / Barlow
- **Supabase** (proyecto compartido `larqxmgyutqiktsforgz`, tablas con prefijo `labs_`)
- **lucide-react** para iconografía

## Puesta en marcha local

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000`.

El archivo `.env.local` ya viene cargado con la URL y la anon key de Supabase (son públicas por diseño). Antes de publicar, cambiá:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número real de WhatsApp comercial (formato `549XXXXXXXXXX`, sin `+`).
- `NEXT_PUBLIC_ADMIN_PASSWORD`: contraseña del panel interno (hoy es `medrano2026`, cambiarla).
- `NEXT_PUBLIC_SITE_URL`: dominio final, para metadatos SEO / sitemap.

## Estructura de datos (Supabase)

Todas las tablas están en el proyecto Supabase compartido "Apps", prefijadas `labs_` para no chocar con otros proyectos de Dental Medrano:

- `labs_categories` — las 5 categorías principales (slug, nombre, subtítulo, descripción).
- `labs_brands` — marcas (Coltene, Noritake, Densell, Easydent, Keystone, Piocreat, Kenda, Bioloren, GC).
- `labs_products` — catálogo completo (101 productos cargados inicialmente, cubriendo las 5 categorías del brief).
- `labs_leads` — consultas enviadas desde el formulario de contacto.

Storage: bucket público `labs-images` (para fotos de producto, cargadas desde el panel `/admin`).

**Nunca se debe hacer `DROP TABLE` ni sobrescribir estas tablas** — siguiendo el estándar de los demás proyectos de Dental Medrano, cualquier cambio de esquema debe ser `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.

## Panel de administración

`/admin` — protegido por contraseña simple (`NEXT_PUBLIC_ADMIN_PASSWORD`, guardada en `localStorage` tras el login, mismo patrón que el resto de las apps internas de Dental Medrano).

Desde ahí se puede:
- Cargar fotos de producto (sube directo a Supabase Storage).
- Crear, editar y eliminar productos.
- Agregar marcas.
- Editar el copy (subtítulo/descripción) de las 5 categorías fijas.
- Ver y marcar como atendidas las consultas del formulario de contacto.

## Páginas principales

- `/` — landing (hero, 5 categorías, tipo de laboratorio, evolución analógico→digital, marcas, por qué Dental Medrano, CTA).
- `/laboratorios/[categoria]` — una por cada categoría (`ceramica-protesis-fija`, `cad-cam`, `digital`, `protesis-removible`, `consumo-diario`), con filtros por marca / tipo de producto / tecnología.
- `/producto/[slug]` — ficha de producto con Schema.org `Product`, WhatsApp de consulta precompletado, productos relacionados.
- `/contacto` — formulario completo (guarda en `labs_leads`) + WhatsApp directo.
- `/admin` — panel interno (ver arriba).

## Notas importantes

- **No hay precios ni stock hardcodeados** — el sitio muestra "Consultar disponibilidad" en todos los casos, tal como pide el brief.
- **Imágenes**: el catálogo se cargó con descripciones reales pero sin fotos (no se contaba con material fotográfico). Cargalas desde `/admin` — cada producto tiene su selector de imagen.
- **Nuevas categorías**: las 5 categorías actuales están ancladas en el código (para mantener las URLs `/laboratorios/...`). Agregar una sexta categoría requiere un pequeño cambio de código (no solo de datos); todo lo demás (marcas, productos, filtros) sí escala sin tocar código.
- **Build**: verificado con `npm install`, `npx tsc --noEmit` y `npx next lint` (0 errores). El build de producción (`npm run build`) necesita acceso a internet para traer las tipografías de Google Fonts y los datos de Supabase — andá a un entorno con salida a internet (tu máquina o Vercel) para correrlo.

## Despliegue

Mismo flujo que el resto de los proyectos de Dental Medrano:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SantiagoFamaBJ/<nombre-repo>.git
git push -u origin main
```

Después, importar el repo en Vercel y cargar las mismas variables de entorno del `.env.local`.
