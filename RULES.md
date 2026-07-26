# RULES.md — [Nombre del proyecto]

Reglas de proyecto. Todos los agentes deben leer este archivo antes de comenzar cualquier tarea.
Estas reglas tienen precedencia sobre los defaults globales de los agentes.

---

## Stack

- Framework: Astro 5.x
- CSS: Tailwind CSS v4 (tokens en @theme, sin tailwind.config.js)
- Package manager: pnpm
- Lenguaje: TypeScript estricto

## Deploy

- Plataforma: definir si es Cloudflare / Vercel / GitHub Pages
- Base path: /nombre-repo (dejar vacío si es dominio raíz)
- Dominio: ejemplo.com (o none)
- Build command: pnpm run build
- Output dir: dist/

## Idioma y locale

- Idioma del contenido: es-AR (o es-ES, en, etc.)
- html lang: es
- Fechas: formato DD/MM/YYYY

## Tipografía

- **Producción:** fuentes self-hosted en `public/fonts/` con `@font-face` en `global.css`. Ver proceso en `PERFORMANCE.md` Fase 1. Google Fonts CDN solo se acepta en desarrollo/prototipado.
- `font-display: swap` obligatorio en todos los `@font-face` — evita FOIT (texto invisible)
- Subset `latin` únicamente — no latin-ext (agrega ~30% de peso innecesario para sitios en español)
- Preload del peso crítico del h1 en `<head>` de `Layout.astro`: `<link rel="preload" as="font" type="font/woff2" href="/fonts/fuente-800.woff2" crossorigin />`
- Fallback: sans-serif

## Íconos

- Usar siempre `astro-icon` con paquetes `@iconify-json` instalados localmente — nunca fuentes de íconos vía CSS. Resuelve SVG inline en build time — solo incluye los íconos que realmente se usan.
- Colección default: Material Symbols (`material-symbols:`). Alternativas: Phosphor (`ph:`), Tabler (`tabler:`). Para logos de marcas: Simple Icons (`simple-icons:`). Instalar solo los `@iconify-json` de las colecciones en uso.
- Componente semántico: `<Icon name="material-symbols:close" class="size-5" />` — sin prop `size`. Tamaño y color vía clases Tailwind.
- Buscador: icones.js.org

## Colores — brand

- Los colores de la marca viven en global.css (@theme), nunca deben ser hardcodeados
- Usar nombres descriptivos: `--color-brand-beige`, no `--color-brand-primary`

## Componentes

- Custom tags semánticos de layout: `m-container`, `m-row`, `m-col` — son HTML tags estilados via CSS, no Web Components. No necesitan JS ni customElements.define()
- Sin React, Vue ni Svelte — solo .astro
- Sin CSS modules — todo via Tailwind + @theme tokens

### Estructura de carpetas

```
src/components/
  form/       → Input, Checkbox, Select, Textarea, Radio, Form
  layout/     → Navigation, Footer, NavDesktop, NavMobile, Carrusel, FaqAccordion
  seo/        → SEO
  ui/         → Button, Breadcrumb, Glow, ImageBackground
```

- `form/`: componentes de formulario reutilizables
- `layout/`: componentes grandes de layout (nav, footer, secciones complejas)
- `seo/`: componente SEO y configuración relacionada
- `ui/`: componentes atómicos y utilitarios de UI

## SEO

- usar componente SEO. /src/components/seo/SEO.astro

## Imágenes

- Formatos preferidos: WebP para fotos, SVG para ilustraciones, PNG solo si es necesario
- Imagen LCP (hero): `loading="eager"` + `fetchpriority="high"` + `width` y `height` explícitos
- Imágenes below-fold: `loading="lazy"` + `decoding="async"` + `width` y `height` explícitos siempre (evita CLS)
- Alt text: siempre requerido — nunca `alt=""`

## Performance — reglas siempre activas

- **Layout.astro:** debe tener `<main>` wrapeando `<slot />`. Si una página tiene su propio `<main>`, usar prop `noMain` para evitar anidado.
- **CSS crítico inline:** inyectar `<style is:inline>` en `<head>` con los estilos above-the-fold (~2KB máximo). Incluye: vars CSS, reset, m-container/row/col, utilidades críticas (hidden, flex, grid, fixed, absolute, relative, w-full, block), tipografía de headings.
- **Lenis:** cargar con `is:inline` + on-interaction + setTimeout. El timeout mínimo son 3s; en proyectos con GTM u otros scripts pesados, usar TTI medido + 1.5s. Nunca con import estático — genera un critical request chain de ~278ms que bloquea el hilo principal.
- **GTM / scripts de terceros:** diferir con patrón interaction + setTimeout. Delay mínimo 5s; el valor exacto es TTI medido post-Lenis + ~1.5s (ver PERFORMANCE.md Fase 3). Nunca disparar en `window.load` sin delay.
- **astro-icon:** `icon()` en `astro.config.mjs` siempre con `include` explícito para cada colección instalada. Sin `include`, puede incluir iconos no usados en el bundle.

## Lo que NO hacer en este proyecto

- No usar npm — siempre pnpm
- No hardcodear colores fuera de @theme
- No crear componentes parametrizados de página completa (ver filosofía en Astro-Builder)
- No agregar dependencias sin consultar
- No usar Google Fonts CDN en producción (ni para tipografías ni para iconos)
